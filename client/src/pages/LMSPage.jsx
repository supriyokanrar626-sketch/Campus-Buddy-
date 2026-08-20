import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Progress, Table, TableBody, TableRow, TableCell, TableHead } from 'lucide-react';

const LMSPage = () => {
  const [overall, setOverall] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attendance').then(res => {
      setOverall(res.data.overall);
      setSubjects(res.data.subjects);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const getStatusColor = (pct) => pct < 75 ? 'red' : 'green';

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Attendance</h1>
        
        {loading ? (
          <p className="text-center mt-12">Loading...</p>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border-white/10 rounded-xl p-6 margin-auto">
            <div className="text-5xl font-bold mb-2">{overall}%</div>
            <Progress size={120} thickness={20} className="w-48 h-48 mx-auto" />
            <p className="text-center mt-4">Overall Attendance</p>
            
            <Table className="mt-8 w-full text-sm">
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableColumn>Total</TableColumn>
                  <TableColumn>Attended</TableColumn>
                  <TableColumn>%</TableColumn>
                  <TableColumn>Status</TableColumn>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((sub, idx) => {
                  const [att, total] = sub.split('/').map(Number);
                  const pct = Math.round((att / total) * 100);
                  return (
                    <TableRow key={idx} className="border-b">
                      <TableCell>{sub}</TableCell>
                      <TableCell>{total}</TableCell>
                      <TableCell>{att}</TableCell>
                      <TableCell>{pct}%</TableCell>
                      <TableCell className={getStatusColor(pct) === 'red' ? 'text-red-500' : 'text-green-500'}>
                        {getStatusColor(pct) === 'red' ? 'You need to attend next 3 classes' : 'Good'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LMSPage;