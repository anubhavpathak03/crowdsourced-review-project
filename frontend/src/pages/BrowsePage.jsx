import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Restaurants', 'Cafés', 'Shops', 'Services', 'Hotels'];

export default function BrowsePage() {
  const [businesses, setBusinesses] = useState([]);
  const [category, setCategory]     = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const url = category ? `/api/businesses?category=${category}` : '/api/businesses';
    axios.get(url).then(r => {
      const data = r.data;
      setBusinesses(Array.isArray(data) ? data : []);
    }).catch(() => {
      setBusinesses([]);
    });
  }, [category]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📂 All Businesses</h2>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setCategory('')}
          className={`px-3 py-1 text-sm border rounded ${!category ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
        >All</button>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1 text-sm border rounded ${category === c ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
          >{c}</button>
        ))}
      </div>

      {/* Business list */}
      <div className="flex flex-col gap-2">
        {businesses.map(biz => (
          <div
            key={biz._id}
            onClick={() => nav(`/business/${biz._id}`)}
            className="flex items-center justify-between bg-white border border-gray-200 rounded px-4 py-3 cursor-pointer hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-800">📄 {biz.name}</span>
            <span className="text-sm text-gray-400">{biz.category} · {biz.location}</span>
          </div>
        ))}
        {businesses.length === 0 && (
          <p className="text-sm text-gray-400 py-8 text-center">No businesses found.</p>
        )}
      </div>
    </div>
  );
}