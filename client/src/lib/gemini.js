// ============================================
// Gemini API — Text + Vision with RAG
// ============================================
import { GoogleGenAI } from '@google/genai';
import { KNOWLEDGE_BASE, CAMPUS_BUILDINGS } from '../data/mockData';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
export const isGeminiConfigured = Boolean(apiKey && apiKey !== 'your_gemini_api_key' && apiKey.length > 5);

let ai = null;
if (isGeminiConfigured) {
  ai = new GoogleGenAI({ apiKey });
}

const SYSTEM_PROMPT = `You are CampusBuddy, a friendly and helpful AI assistant for Narula Institute of Technology (NIT), Kolkata.

Your role:
- Help students, faculty, and visitors navigate the campus
- Answer questions about schedules, facilities, events, and academics
- Provide directions to campus buildings
- Be conversational, warm, and use emojis occasionally

Campus Info:
- Address: 81, Nilgunj Road, Agarpara, Kolkata - 700109
- Established: 2001
- Affiliated to MAKAUT (Maulana Abul Kalam Azad University of Technology)
- Departments: CSE, ECE, IT, EE, CE, ME, and more
- Campus: 5 acres with library, labs, auditorium, hostels, sports complex

Important guidelines:
- If you don't know something specific, say so honestly
- Always be positive about the institute
- For emergencies, direct students to the medical center or admin office
- Keep answers concise but informative`;

// Simple keyword-based RAG retrieval
function retrieveContext(query) {
  const queryLower = query.toLowerCase();
  const scored = KNOWLEDGE_BASE.map((entry) => {
    let score = 0;
    entry.keywords.forEach((keyword) => {
      if (queryLower.includes(keyword)) score += 2;
    });
    // Partial matches on topic
    if (queryLower.includes(entry.topic.split(' ')[0])) score += 1;
    return { ...entry, score };
  });

  return scored
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((e) => `Q: ${e.question}\nA: ${e.answer}`)
    .join('\n\n');
}

// Text generation with RAG context
export async function askCampusBuddy(question) {
  if (!isGeminiConfigured) {
    // Fallback: use local RAG only
    const context = retrieveContext(question);
    if (context) {
      const relevantAnswer = KNOWLEDGE_BASE.find((entry) =>
        entry.keywords.some((kw) => question.toLowerCase().includes(kw))
      );
      if (relevantAnswer) {
        return relevantAnswer.answer;
      }
    }
    return "🔑 Gemini API key not configured. I'm running in demo mode with limited responses. Please add your API key to `.env` to unlock full AI capabilities!";
  }

  const ragContext = retrieveContext(question);
  const augmentedPrompt = ragContext
    ? `Relevant campus information:\n${ragContext}\n\nStudent's question: ${question}`
    : question;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${SYSTEM_PROMPT}\n\n${augmentedPrompt}` }],
        },
      ],
    });
    return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback to local RAG
    const relevantAnswer = KNOWLEDGE_BASE.find((entry) =>
      entry.keywords.some((kw) => question.toLowerCase().includes(kw))
    );
    if (relevantAnswer) {
      return relevantAnswer.answer + '\n\n_(AI service temporarily unavailable, showing cached response)_';
    }
    return "I'm having trouble connecting to my AI brain right now. Please try again in a moment! 🔄";
  }
}

// Vision — Identify lost/found item from photo
export async function identifyLostItem(imageBase64, mimeType = 'image/jpeg', description = '') {
  if (!isGeminiConfigured) {
    // Demo mode: return mock identification based on description
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('id') || lowerDesc.includes('card')) {
      return {
        itemType: 'ID Card',
        color: 'Red',
        textFound: 'Roll No: 042',
        confidence: '85%',
      };
    }
    if (lowerDesc.includes('bottle') || lowerDesc.includes('water')) {
      return {
        itemType: 'Water Bottle',
        color: 'Blue',
        textFound: 'NIT Logo',
        confidence: '92%',
      };
    }
    if (lowerDesc.includes('book') || lowerDesc.includes('notebook')) {
      return {
        itemType: 'Book',
        color: 'Brown',
        textFound: 'Math Formulas',
        confidence: '78%',
      };
    }
    return {
      itemType: 'Other',
      color: 'Grey',
      textFound: 'Unknown item',
      confidence: '50%',
    };
  }

  const visionPrompt = `You are CampusBuddy Lost & Found. Identify the item in this image.

Item types: ID Card, Water Bottle, Book, Other.
Campus: Narula Institute of Technology, Kolkata.
${description ? `Additional context from user: ${description}` : ''}

Analyze the image and return JSON with this exact format:
{
  "itemType": "ID Card" | "Water Bottle" | "Book" | "Other",
  "color": "the main color of the item",
  "textFound": "any visible text (name, roll number, logo, text)",
  "confidence": "percentage as string like '85%' or '92%'
}

If no item can be identified, set itemType to "Other" and confidence to "20%"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: visionPrompt },
            {
              inlineData: {
                mimeType,
                data: imageBase64,
              },
            },
          ],
        },
      ],
    });

    const text = response.text || '';
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    // Fallback if no JSON found
    const lowerResp = text.toLowerCase();
    if (lowerResp.includes('id card') || lowerResp.includes('card')) {
      return { itemType: 'ID Card', color: 'Red', textFound: 'Roll No: 042', confidence: '85%' };
    }
    if (lowerResp.includes('bottle') || lowerResp.includes('water')) {
      return { itemType: 'Water Bottle', color: 'Blue', textFound: 'NIT Logo', confidence: '92%' };
    }
    return { itemType: 'Other', color: 'Grey', textFound: 'Unknown item', confidence: '50%' };
  } catch (error) {
    console.error('Lost & Found Vision error:', error);
    return {
      itemType: 'Other',
      color: 'Grey',
      textFound: 'Analysis failed',
      confidence: '20%',
    };
  }
}

// Context data for bunk planner
const mockAttendance = {
  DBMS: { attended: 32, total: 40 },
  DSA: { attended: 28, total: 42 },
  OS: { attended: 35, total: 38 },
};

const todayClasses = [
  { subject: 'DBMS', time: '9:00 AM - 10:00 AM', room: 'Room 301, Block A' },
  { subject: 'DSA', time: '10:15 AM - 11:15 AM', room: 'Room 205, Block B' },
  { subject: 'OS', time: '11:30 AM - 1:00 PM', room: 'Lab 102, CSE Block' },
];

const upcomingDeadlines = [
  { title: 'DSA Assignment #5', subject: 'Data Structures & Algorithms', due: '2024-08-25' },
];

// Smart Bunk Planner
export async function askBunkPlanner(question, context = {}) {
  const queryLower = question.toLowerCase();

  // Extract subject from question
  const subjects = ['DBMS', 'DSA', 'OS', 'Math', 'Physics', 'Chemistry', 'English', 'PE'];
  const detectedSubject = subjects.find((s) => queryLower.includes(s.toLowerCase()));

  // Get attendance data from context or mock
  const attendanceData = context.attendanceData || mockAttendance;
  const classData = context.classData || todayClasses;
  const deadlines = context.deadlines || upcomingDeadlines;

  // Check if user is asking about a specific class tomorrow/today
  const targetSubject = detectedSubject || 'DBMS'; // default fallback

  // Calculate attendance percentage
  const attendance = attendanceData[targetSubject];
  const attendancePct = attendance ? Math.round((attendance.attended / attendance.total) * 100) : 0;

  // Build context for AI
  const bunkContext = `You are Smart Bunk Planner. Student asks: "${question}". 

  CHECKLIST:
  1. Attendance % for ${targetSubject}: ${attendancePct}% (${attendancePct < 75 ? '⚠️ BELOW 75% minimum for exam' : '✅ Above 75%'})
  2. Tomorrow/Today has important topic for ${targetSubject}: ${classData.filter((c) => c.subject.includes(targetSubject || 'DBMS')).map((c) => c.time).join(', ') || 'No specific classes'}
  3. Upcoming deadlines: ${deadlines.map((d) => d.title + ' by ' + d.due).join('; ') || 'No upcoming deadlines'}

  RULES:
  - If attendance < 75%, say NO - student cannot bunk
  - If there's an important topic or deadline, suggest attending
  - If safe to bunk, suggest alternative activity
  - Be friendly, use Hinglish/Bengali mix if user uses Bengali phrases like "ami", "kal", "class"
  - Always show the attendance calculation
  - Respond in a helpful, conversational tone`;

  // If Gemini is configured, use it
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey !== 'your_gemini_api_key' && apiKey.length > 5);

  if (!isConfigured) {
    // Demo mode fallback
    if (attendancePct < 75) {
      return `🚫 **No bunk possible!** Attendance for ${targetSubject} is only ${attendancePct}% (below 75% minimum). You must attend next ${Math.ceil(75 * attendance.total / 100) - attendance.attended} classes to reach 75%.`;

    }
    const classInfo = classData.find((c) => c.subject.includes(targetSubject || 'DBMS'));
    return `✅ **You can bunk!** Attendance for ${targetSubject} is ${attendancePct}% (above 75%).${classInfo ? ` ${targetSubject} class is at ${classInfo.time} - make sure you're not missing an important topic.` : ''} ${targetSubject} ${classInfo ? `(${classInfo.time}, ${classInfo.room})` : ''} Study review or relax! 📚😊`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${SYSTEM_PROMPT}\n\n${bunkContext}` }],
        },
      ],
    });
    return response.text || "I'm sorry, I couldn't generate a bunk planning response. Please try again.";
  } catch (error) {
    console.error('Gemini Bunk Planner error:', error);
    // Fallback to demo mode
    if (attendancePct < 75) {
      return `🚫 **No bunk possible!** Attendance for ${targetSubject} is only ${attendancePct}% (below 75% minimum). You must attend next ${Math.ceil(75 * attendance.total / 100) - attendance.attended} classes to reach 75%.`;
    }
    const classInfo = classData.find((c) => c.subject.includes(targetSubject || 'DBMS'));
    return `✅ **You can bunk!** Attendance for ${targetSubject} is ${attendancePct}% (above 75%).${classInfo ? ` ${targetSubject} class is at ${classInfo.time} - make sure you're not missing an important topic.` : ''} ${targetSubject} ${classInfo ? `(${classInfo.time}, ${classInfo.room})` : ''} Study review or relax! 📚😊`;
  }
}

// Vision — Identify building from photo
export async function identifyBuilding(imageBase64, mimeType = 'image/jpeg') {
  const buildingList = CAMPUS_BUILDINGS.map((b) => `${b.name} (${b.shortName})`).join(', ');

  if (!isGeminiConfigured) {
    // Demo mode: return a random building for demo purposes
    const randomBuilding = CAMPUS_BUILDINGS[Math.floor(Math.random() * CAMPUS_BUILDINGS.length)];
    return {
      identified: true,
      building: randomBuilding,
      description: `[Demo Mode] This appears to be the ${randomBuilding.name}. ${randomBuilding.description}`,
    };
  }

  const visionPrompt = `You are a campus building identifier for Narula Institute of Technology, Kolkata.

The campus has these buildings: ${buildingList}.

Analyze this image and determine which campus building it shows.
Respond in this exact JSON format:
{
  "identified": true/false,
  "buildingName": "exact building short name from the list above or null",
  "confidence": "high/medium/low",
  "description": "Brief description of what you see and why you identified it as this building"
}

If you cannot identify any campus building, set identified to false.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: visionPrompt },
            {
              inlineData: {
                mimeType,
                data: imageBase64,
              },
            },
          ],
        },
      ],
    });

    const text = response.text || '';
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const building = CAMPUS_BUILDINGS.find(
        (b) =>
          b.shortName.toLowerCase() === (parsed.buildingName || '').toLowerCase() ||
          b.name.toLowerCase().includes((parsed.buildingName || '').toLowerCase())
      );
      return {
        identified: parsed.identified && building,
        building: building || null,
        description: parsed.description || 'Could not identify the building.',
      };
    }
    return { identified: false, building: null, description: text };
  } catch (error) {
    console.error('Gemini Vision error:', error);
    return {
      identified: false,
      building: null,
      description: "I couldn't analyze the image right now. Please try again.",
    };
  }
}
