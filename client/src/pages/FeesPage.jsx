import React, { useState, useEffect } from 'react';
import api from '../lib/api';

const FeesPage = () => {
  const [fees, setFees] = useState({
    total: 0,
    paid: 0,
    due: 0,
  });

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/fees')
      .then((res) => {
        setFees(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching fees:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <div className="mx-auto max-w-4xl">

        <h1 className="mb-6 text-center text-2xl font-bold">
          Fees
        </h1>

        {loading ? (
          <p className="mt-12 text-center">
            Loading...
          </p>
        ) : (
          <>
            {/* Fee Summary */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div className="text-2xl font-bold text-blue-500">
                  ₹{fees.total}
                </div>
                <div className="text-sm text-gray-300">
                  Total
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div className="text-2xl font-bold text-green-500">
                  ₹{fees.paid}
                </div>
                <div className="text-sm text-gray-300">
                  Paid
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div className="text-2xl font-bold text-red-500">
                  ₹{fees.due}
                </div>
                <div className="text-sm text-gray-300">
                  Due
                </div>
              </div>

            </div>

            {/* Fee History */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

              <h2 className="mb-4 text-lg font-medium">
                Fee History
              </h2>

              {history.length === 0 ? (
                <p className="py-8 text-center text-gray-400">
                  No fee history available.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">

                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left">
                          Fee Type
                        </th>

                        <th className="px-4 py-3 text-left">
                          Amount
                        </th>

                        <th className="px-4 py-3 text-left">
                          Status
                        </th>

                        <th className="px-4 py-3 text-left">
                          Receipt
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {history.map((item, idx) => (
                        <tr
                          key={item._id || idx}
                          className="border-b border-white/5"
                        >
                          <td className="px-4 py-3">
                            {item.feeType}
                          </td>

                          <td className="px-4 py-3">
                            ₹{item.amount}
                          </td>

                          <td
                            className={`px-4 py-3 ${
                              item.status === 'Paid'
                                ? 'text-green-500'
                                : 'text-red-500'
                            }`}
                          >
                            {item.status}
                          </td>

                          <td className="px-4 py-3">
                            {item.receipt ? (
                              <a
                                href={item.receipt}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                Download
                              </a>
                            ) : (
                              <span className="text-gray-500">
                                N/A
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default FeesPage;