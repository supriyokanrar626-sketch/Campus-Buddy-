import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { askCampusBuddy, identifyBuilding, isGeminiConfigured } from '../lib/gemini';
import { askBunkPlanner } from '../lib/bunkPlanner';
import {
  Mic,
  MicOff,
  Camera,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Image as ImageIcon,
  Trash2,
  HelpCircle,
  Info,
  Loader2,
  Copy,
  Check,
  X,
  MapPin,
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Where is the Central Library & what are the timings?',
  'Tell me about campus canteen and mess hours',
  'What are the boys & girls hostel facilities?',
  'What are the latest placement statistics & top recruiters?',
  'When is the annual tech fest TechNova?',
  'Which engineering departments are available at NIT Kolkata?',
  'Ami kal class bunk korte pari?',
  'DBMS attendance check korbo',
];

export default function AIChatPage() {
  const { user, userProfile, userRole, isDemo } = useAuth();
  const [mode, setMode] = useState('text'); // 'text' | 'voice' | 'vision'
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `👋 Hello ${userProfile?.displayName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'there'}! I am **CampusBuddy AI**, your intelligent guide for **Narula Institute of Technology (NIT Kolkata)**.\n\nAsk me about campus buildings, lecture schedules, library timings, canteen food, hostel rules, or upload a photo of any campus building to identify it!`,
      mode: 'text',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Vision Mode State
  const [selectedImage, setSelectedImage] = useState(null); // { file, previewUrl, base64, mimeType }
  const fileInputRef = useRef(null);

  // Voice Mode State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const recognitionRef = useRef(null);

  // TTS State
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const chatEndRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setVoiceTranscript(currentTranscript);
        setInputValue(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Toggle Voice Recognition
  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setVoiceTranscript('');
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  };

  // Handle Image Selection
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result.split(',')[1];
      setSelectedImage({
        file,
        previewUrl: URL.createObjectURL(file),
        base64: base64Data,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Text-To-Speech
  const handleSpeakMessage = (msgId, text) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown formatting before speaking
    const cleanText = text.replace(/[*_#`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Copy Message to Clipboard
  const handleCopyMessage = async (msgId, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Clear Chat History
  const handleClearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingMessageId(null);
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: 'Chat history cleared. How can I help you explore NIT Kolkata today?',
        mode: 'text',
        timestamp: new Date(),
      },
    ]);
  };

  // Send Message
  const handleSendMessage = async (textToSend = inputValue) => {
    const trimmed = textToSend.trim();
    if (!trimmed && !selectedImage) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const currentImage = selectedImage;
    const currentMode = currentImage ? 'vision' : mode;

    // Construct user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: trimmed || (currentImage ? 'Uploaded campus image for identification' : ''),
      mode: currentMode,
      image: currentImage?.previewUrl || null,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setVoiceTranscript('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsLoading(true);

    try {
      let aiReplyText = '';
      let buildingInfo = null;
      const isBunkQuery = /\b(bunk|attendance|kal class|skip|bunk kar|hole khole|cal karo)\b/i.test(trimmed);

      if (currentImage) {
        // Vision request
        const visionResult = await identifyBuilding(currentImage.base64, currentImage.mimeType);
        if (visionResult.identified && visionResult.building) {
          buildingInfo = visionResult.building;
          aiReplyText = `🏛️ **${visionResult.building.name} (${visionResult.building.shortName})**\n\n${visionResult.description}\n\n📍 **Location:** ${visionResult.building.location || 'NIT Campus'}\n🕒 **Timings:** ${visionResult.building.timings || 'Standard campus hours'}`;
        } else {
          aiReplyText = visionResult.description || 'I analyzed the photo, but could not identify a specific campus building. Try uploading a clearer exterior photo!';
        }

        // If user also typed a question along with the photo
        if (trimmed) {
          const textAnswer = await askCampusBuddy(trimmed);
          aiReplyText += `\n\n---\n**Regarding your query:**\n${textAnswer}`;
        }
      } else if (isBunkQuery) {
        // Smart Bunk Planner routing using local askBunkPlanner
        const attendance = [
          { name: 'DBMS', percentage: 80 },
          { name: 'DSA', percentage: 66 },
          { name: 'OS', percentage: 92 },
        ];
        aiReplyText = await askBunkPlanner(trimmed, attendance);
      } else {
        // Normal text / voice query
        aiReplyText = await askCampusBuddy(trimmed);
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReplyText,
        mode: currentMode,
        building: buildingInfo,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Auto speak if in voice mode
      if (mode === 'voice' && !currentImage) {
        handleSpeakMessage(aiMsg.id, aiReplyText);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "I'm having trouble connecting to the campus knowledge base right now. Please try again in a moment! 🔄",
          mode: 'text',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto w-full glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-white">CampusBuddy AI</h2>
              <span className="badge badge-info text-[0.65rem]">
                {isGeminiConfigured ? 'Gemini 2.0 Flash' : 'Demo Knowledge Base'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Voice, Vision & Knowledge Assistant for NIT Kolkata
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="btn-ghost p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Input Mode Selector Bar */}
      <div className="px-4 py-2 bg-surface-light/40 border-b border-white/5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              mode === 'text'
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Text Chat</span>
          </button>

          <button
            onClick={() => setMode('voice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              mode === 'voice'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Mode</span>
          </button>

          <button
            onClick={() => {
              setMode('vision');
              fileInputRef.current?.click();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              mode === 'vision'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Vision (Campus Photo)</span>
          </button>
        </div>

        <div className="text-[0.7rem] text-slate-400 hidden sm:flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>Ask questions in English or Bengali script</span>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                  isUser
                    ? 'bg-gradient-to-br from-primary to-blue-600 text-white'
                    : 'bg-surface-lighter text-primary border border-white/10'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble Container */}
              <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Attached Image Preview */}
                {msg.image && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-white/10 shadow-lg max-w-sm">
                    <img
                      src={msg.image}
                      alt="Uploaded query"
                      className="w-full h-auto object-cover max-h-60"
                    />
                  </div>
                )}

                {/* Bubble Content */}
                <div
                  className={`p-4 ${
                    isUser
                      ? 'chat-bubble-user text-white'
                      : 'chat-bubble-ai text-slate-200'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap leading-relaxed space-y-2">
                    {msg.text}
                  </div>

                  {/* Identified Building Card Shortcut */}
                  {msg.building && (
                    <div className="mt-3 p-3 rounded-lg bg-surface-lighter/50 border border-primary/20 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {msg.building.name}
                        </p>
                        <p className="text-[0.65rem] text-slate-400">
                          {msg.building.location || 'NIT Campus Location'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bubble Footer & Actions */}
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[0.65rem] text-slate-400 gap-3">
                    <span>
                      {new Date(msg.timestamp || Date.now()).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {!isUser && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSpeakMessage(msg.id, msg.text)}
                          className={`p-1 rounded hover:bg-white/10 transition-colors ${
                            isSpeaking ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                          }`}
                          title={isSpeaking ? 'Stop speech' : 'Read aloud'}
                        >
                          {isSpeaking ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-lighter text-primary border border-white/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="chat-bubble-ai p-4 flex items-center gap-3">
              <div className="typing-indicator flex items-center">
                <span />
                <span />
                <span />
              </div>
              <span className="text-xs text-slate-400">CampusBuddy is thinking...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-white/5 bg-surface/40 flex items-center gap-2 overflow-x-auto">
          <span className="text-[0.7rem] text-slate-400 shrink-0 flex items-center gap-1 font-medium">
            <HelpCircle className="w-3 h-3 text-primary" /> Suggestions:
          </span>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[0.7rem] px-3 py-1.5 rounded-full bg-white/5 hover:bg-primary/20 hover:border-primary/40 border border-white/10 text-slate-300 hover:text-white whitespace-nowrap transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Selected Image Attachment Preview Bar */}
      {selectedImage && (
        <div className="px-4 py-2 bg-surface-light border-t border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedImage.previewUrl}
              alt="Upload preview"
              className="w-10 h-10 object-cover rounded-lg border border-purple-500/40"
            />
            <div>
              <p className="text-xs font-medium text-white truncate max-w-xs">
                {selectedImage.file.name}
              </p>
              <p className="text-[0.65rem] text-purple-300">
                Ready for Campus AI building recognition
              </p>
            </div>
          </div>
          <button
            onClick={removeSelectedImage}
            className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-rose-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Live Voice Recording Status Bar */}
      {isRecording && (
        <div className="px-4 py-2.5 bg-emerald-950/40 border-t border-emerald-500/30 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="wave-bar" />
              <span className="wave-bar" />
              <span className="wave-bar" />
              <span className="wave-bar" />
              <span className="wave-bar" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-400">Listening to your voice...</p>
              <p className="text-[0.65rem] text-slate-400 truncate max-w-md">
                {voiceTranscript || 'Speak your question clearly now'}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleSendMessage(voiceTranscript)}
            className="btn-primary py-1 px-3 text-xs flex items-center gap-1.5"
            disabled={!voiceTranscript.trim()}
          >
            <Send className="w-3 h-3" />
            <span>Send Audio</span>
          </button>
        </div>
      )}

      {/* Bottom Input Area */}
      <div className="p-4 border-t border-white/10 bg-surface/90 backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          {/* Photo upload trigger button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-3 rounded-xl border transition-all ${
              selectedImage
                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                : 'glass-input border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
            title="Upload campus building photo"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Mic trigger button */}
          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`p-3 rounded-xl border transition-all ${
              isRecording
                ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30 animate-pulse'
                : 'glass-input border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
            title={isRecording ? 'Stop recording' : 'Speak your question'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input Box */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isRecording
                ? 'Listening to voice...'
                : selectedImage
                ? 'Add an optional question about this photo (or just click Send)...'
                : 'Ask CampusBuddy anything about NIT Kolkata (timings, hostel, classes, etc.)...'
            }
            className="flex-1 glass-input px-4 py-3 text-sm focus:outline-none placeholder:text-slate-500 text-white rounded-xl"
            disabled={isLoading}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || (!inputValue.trim() && !selectedImage)}
            className="btn-primary p-3 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            title="Send Message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}