import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Search, Folder, File, Grid, Shield, Trash, LogOut, Upload } from 'lucide-react';

const LostFoundPage = () => {
  const [tabs, setTabs] = useState('lost');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ itemType: '', description: '', location: '', imageBase64: '' });
  const [droppedFile, setDroppedFile] = useState(null);

  useEffect(() => {
    api.get('/lostfound/all').then(res => setItems(res.data)).catch(err => console.error(err));
  }, []);

  const handleTabChange = (tab) => setTabs(tab);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, imageBase64: reader.result.toString() }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { ...form, id: crypto.randomUUID() };
    await api.post('/lostfound/report', formData).then(() => {
      setForm({ itemType: '', description: '', location: '', imageBase64: '' });
      alert('Report submitted');
    }).catch(err => console.error(err));
  };

  const lostItems = items.filter(i => i.status === 'lost');
  const foundItems = items.filter(i => i.status === 'found');

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Lost & Found</h1>
        
        <div className="bg-white/5 backdrop-blur-xl border-white/10 rounded-xl p-4 mb-6">
          <button
            onClick={() => setTabs('lost')}
            className={tabs === 'lost' ? 'bg-blue-600 text-white' : 'text-white hover:bg-blue-600 px-4 py-2 rounded'}
          >
            Lost Items
          </button>
          <button
            onClick={() => setTabs('found')}
            className={tabs === 'found' ? 'bg-blue-600 text-white' : 'text-white hover:bg-blue-600 px-4 py-2 rounded ml-4'}
          >
            Found Items
          </button>
        </div>

        {tabs === 'lost' ? (
          <div>
            <h2 className="text font-medium mb-4">Report Lost Item</h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <label className="block text-sm mb-1">Item Type</label>
                <select
                  value={form.itemType}
                  onChange={(e) => setForm(prev => ({ ...prev, itemType: e.target.value }))}
                  className="w-full bg-gray-800 text-white rounded p-2"
                >
                  <option value="">Select Item Type</option>
                  <option value="ID Card">ID Card</option>
                  <option value="Bottle">Bottle</option>
                  <option value="Book">Book</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Location</label>
                <select
                  value={form.location}
                  onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-gray-800 text-white rounded p-2"
                >
                  <option value="">Select Location</option>
                  <option value="Library">Library</option>
                  <option value="Canteen">Canteen</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-800 text-white rounded p-2 h-24 resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm mb-1">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick=() => document.querySelector('input[type="file"]').click()
                  className="mt-2 text-sm text-blue-600 hover underline"
                >
                  Upload Photo
                </button>
                {droppedFile && (
                  <div className="mt-2">
                    <img src={droppedFile} alt="preview" className="w-24 h-24 object-cover" />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="mt-4 w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Report Lost
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text font-medium mb-4">Found Items</h2>
            <div className="grid grid-cols-2 gap-4">
              {foundItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 backdrop-blur-xl border-white/10 rounded-xl p-4"
                >
                  <div className="w-24 h-24 rounded overflow-hidden mb-3">
                    {item.imageBase64 ? (
                      <img src={`data:image/png;base64,${item.imageBase64}`} alt="found" />
                    ) : (
                      <div className="w-full h-full bg-gray-700"></div>
                    )}
                  </div>
                  <h3 className="font-bold">{item.itemType}</h3>
                  <p className="text-sm text-gray-300">{item.location}</p>
                  <p className="text-gray-400 mt-1">{item.description}</p>
                  <div className="mt-2">
                    <span className="text-green-500 text-sm font-medium">AI Match: 92%</span>
                    <span className="text-gray-500 text-sm ml-2">AI Match badge</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LostFoundPage;