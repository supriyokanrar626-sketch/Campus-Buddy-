import React from 'react';
import { Search, Filter, Folder, File, Grid } from 'lucide-react';

const PapersPage = () => {
  const [dept, setDept] = useState('');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const papers = [
    { id: '1', name: 'Maths I', dept: 'CSE', year: '2024', subject: 'Maths' },
    { id: '2', name: 'Physics I', dept: 'CSE', year: '2024', subject: 'Physics' },
    { id: '3', name: 'Maths II', dept: 'ECE', year: '2023', subject: 'Maths' },
    { id: '4', name: 'Physics II', dept: 'ECE', year: '2023', subject: 'Physics' },
  ];

  const filteredPapers = papers.filter(p => {
    const matchesDept = !dept || p.dept === dept;
    const matchesYear = !year || p.year === year;
    const matchesSubject = !subject || p.subject === subject;
    return matchesDept && matchesYear && matchesSubject;
  });

  const handleView = (paper) => {
    const link = import.meta.env.VITE_PAPERS_DRIVE_LINK || 'https://drive.google.com';
    window.open(link, '_blank');
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Papers</h1>
        
        <div className="bg-white/5 backdrop-blur-xl border-white/10 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Dept</label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full bg-gray-800 text-white rounded p-2"
              >
                <option value="">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-gray-800 text-white rounded p-2"
              >
                <option value="">All Years</option>
                <option value="2024">2024-2025</option>
                <option value="2023">2023-2024</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-gray-800 text-white rounded p-2"
              >
                <option value="">All Subjects</option>
                <option value="Maths">Maths</option>
                <option value="Physics">Physics</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white/5 backdrop-blur-xl border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
            >
              <h3 className="font-bold">{paper.name}</h3>
              <p className="text-sm text-gray-300">{paper.dept} - {paper.year}</p>
              <p className="text-sm text-gray-300">{paper.subject}</p>
              <button
                onClick={() => handleView(paper)}
                className="mt-2 text-blue-600 hover underline text-sm"
              >
                View Papers
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PapersPage;