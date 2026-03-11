import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPage() {
  const [pending, setPending] = useState([]);
  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const load = () => axios.get('/api/reviews/pending', { headers }).then(r => setPending(r.data));
  useEffect(() => { load(); }, []);

  const update = async (id, status) => {
    await axios.patch(`/api/reviews/${id}/status`, { status }, { headers });
    load();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">🔒 Admin — Pending Reviews ({pending.length})</h2>

      {pending.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8 border border-dashed border-gray-200 rounded">
          No pending reviews.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {pending.map(r => (
          <div key={r._id} className="bg-white border border-gray-200 rounded p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-semibold text-gray-800 text-sm">{r.author?.name}</span>
                <span className="text-gray-400 text-sm"> → </span>
                <span className="text-blue-600 text-sm">{r.business?.name}</span>
              </div>
              <span className="text-xs text-gray-400">{r.createdAt?.slice(0, 10)}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{r.text}</p>
            <div className="flex gap-4 text-xs text-gray-400 mb-3">
              <span>Q:{r.ratings.quality}</span>
              <span>S:{r.ratings.service}</span>
              <span>V:{r.ratings.value}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => update(r._id, 'approved')}
                className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
              >✓ Approve</button>
              <button
                onClick={() => update(r._id, 'rejected')}
                className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
              >✗ Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}