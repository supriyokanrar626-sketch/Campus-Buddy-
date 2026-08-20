import React, { useState, useEffect } from 'react';
import api from '../lib/api';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [photoURL, setPhotoURL] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [marksheet, setMarksheet] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/profile').then(res => setUser(res.data)).catch(err => console.error(err));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImagePreview(objectURL);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        setPhotoURL(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      studentId: user.studentId,
      dept: user.dept,
      stream: user.stream,
      course: user.course,
      year: user.year,
      rollNo: user.rollNo,
      address: user.address,
      mobileNo: user.mobileNo,
      email: user.email,
      photoURL: photoURL,
      marksheet: user.marksheet
    };
    await api.put('/profile', formData).then(res => {
      setUser(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
        
        {user ? (
          <div className="bg-white/5 backdrop-blur-xl border-white/10 rounded-xl p-6 margin-auto">
            <div className="text-center mb-6">
              <img
                src={user.photoURL || '/placeholder-avatar.png'}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover mx-auto mt-2 border-2 border-white/10"
              />
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-2 hidden"
              />
              <button
                onClick=() => document.querySelector('input[type="file"]').click()
                className="text-sm text-blue-600 hover underline"
              >
                Change Avatar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 mt-8">
              <div>
                <label className="block text-sm font-medium mb-1">Student ID</label>
                <input
                  value={user.studentId || ''}
                  disabled
                  className="bg-gray-100 w-full p-2 rounded border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <input
                  value={user.dept || ''}
                  disabled
                  className="bg-gray-100 w-full p-2 rounded border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Stream</label>
                <input
                  value={user.stream || ''}
                  disabled
                  className="bg-gray-100 w-full p-2 rounded border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <input
                  value={user.course || ''}
                  disabled
                  className="bg-gray-100 w-full p-2 rounded border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  value={user.year || ''}
                  disabled
                  className="bg-gray-100 w-full p-2 rounded border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Roll No</label>
                <input
                  value={user.rollNo || ''}
                  disabled
                  className="bg-gray-100 w-full p-2 rounded border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  value={user.address || ''}
                  disabled
                  className="bg-gray-100 w-full p-2 rounded border-transparent h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mobile No</label>
                <input
                  value={user.mobileNo || ''}
                  disabled
                  className="bg-gray-100 w-full p-2 rounded border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  value={user.email || ''}
                  disabled
                  className="bg-gray-100 w-full p-2 rounded border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Marksheet</label>
                <div className="space-y-2">
                  {marksheet.length > 0 ? (
                    marksheet.map((item, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded">
                        <span>{item.sem}</span>
                        <span>{item.gpa}</span>
                        <span>{item.sgpa}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500">No marksheet data</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        ) : (
          <p className="text-center mt-12">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;