import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BusinessPage() {
  const { id }  = useParams();
  const nav     = useNavigate();
  const [biz, setBiz]       = useState(null);
  const [reviews, setReviews] = useState([]);
  const [form, setForm]     = useState({ text: '', ratings: { quality: 5, service: 5, value: 5 } });
  const [msg, setMsg]       = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`/api/businesses/${id}`).then(r => setBiz(r.data));
    axios.get(`/api/reviews?businessId=${id}`).then(r => setReviews(r.data));
  }, [id]);

  const submitReview = async () => {
    await axios.post('/api/reviews',
      { business: id, ...form },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMsg('Review submitted — awaiting approval.');
    setForm({ text: '', ratings: { quality: 5, service: 5, value: 5 } });
  };

  if (!biz) return <p className="p-6 text-gray-400">Loading…</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Back */}
      <button onClick={() => nav('/')} className="text-sm text-gray-400 hover:text-gray-700 mb-4">← Back</button>

      {/* Business info */}
      <div className="bg-white border border-gray-200 rounded p-5 mb-5">
        <h2 className="text-xl font-bold text-gray-800">📄 {biz.name}</h2>
        <p className="text-sm text-gray-400 mt-1">{biz.category} · {biz.location}</p>
        {biz.description && <p className="text-sm text-gray-600 mt-3">{biz.description}</p>}
      </div>

      {/* Reviews */}
      <h3 className="font-semibold text-gray-700 mb-3">Reviews ({reviews.length})</h3>
      <div className="flex flex-col gap-2 mb-6">
        {reviews.length === 0 && <p className="text-sm text-gray-400">No reviews yet.</p>}
        {reviews.map(r => (
          <div key={r._id} className="bg-white border border-gray-200 rounded p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-gray-800">{r.author?.name}</span>
              <span className="text-gray-400">{r.createdAt?.slice(0, 10)}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{r.text}</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>Quality: {r.ratings.quality}</span>
              <span>Service: {r.ratings.service}</span>
              <span>Value: {r.ratings.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Review form */}
      {token ? (
        <div className="bg-white border border-gray-200 rounded p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Write a Review</h3>
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:border-gray-500"
            placeholder="Share your experience…"
            value={form.text}
            onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
          />
          <div className="flex flex-col gap-2 mb-4">
            {['quality', 'service', 'value'].map(k => (
              <div key={k} className="flex items-center gap-3 text-sm">
                <label className="w-20 capitalize text-gray-600">{k}</label>
                <select
                  value={form.ratings[k]}
                  onChange={e => setForm(f => ({ ...f, ratings: { ...f.ratings, [k]: +e.target.value } }))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            ))}
          </div>
          {msg && <p className="text-sm text-green-600 mb-3">{msg}</p>}
          <button
            onClick={submitReview}
            className="bg-gray-800 text-white text-sm px-4 py-2 rounded hover:bg-gray-700"
          >Submit</button>
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded">
          <a href="/login" className="underline">Log in</a> to write a review.
        </p>
      )}
    </div>
  );
}