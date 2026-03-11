import { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [err, setErr]   = useState('');

  const submit = async () => {
    try {
      setErr('');
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload  = mode === 'login'
        ? { email: form.email, password: form.password }
        : form;

      const { data } = await axios.post(endpoint, payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role',  data.role);
      if (data.name) {
        localStorage.setItem('name', data.name);
      }
      // Hard redirect so Navbar + routes immediately see updated role
      window.location.href = data.role === 'admin' ? '/admin' : '/';
    } catch (e) {
      setErr(e?.response?.data?.message || 'Something went wrong');
    }
  };

  const inp = "w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:border-gray-500";

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white border border-gray-200 rounded p-8">
      <h2 className="text-lg font-bold text-gray-800 mb-2">
        {mode === 'login' ? '🔒 Login' : '🆕 Create account'}
      </h2>
      <p className="text-xs text-gray-500 mb-5">
        {mode === 'login'
          ? "Don't have an account? "
          : 'Already have an account? '}
        <button
          type="button"
          onClick={() => setMode(m => (m === 'login' ? 'signup' : 'login'))}
          className="text-blue-600 hover:underline"
        >
          {mode === 'login' ? 'Sign up' : 'Login'}
        </button>
      </p>

      {mode === 'signup' && (
        <>
          <label className="text-sm text-gray-600 mb-1 block">Name</label>
          <input
            className={inp}
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
        </>
      )}

      <label className="text-sm text-gray-600 mb-1 block">Email</label>
      <input
        className={inp}
        value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
      />

      <label className="text-sm text-gray-600 mb-1 block">Password</label>
      <input
        type="password"
        className={inp}
        value={form.password}
        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
      />

      {err && <p className="text-red-500 text-sm mb-3">{err}</p>}

      <button
        onClick={submit}
        className="w-full bg-gray-800 text-white text-sm py-2 rounded hover:bg-gray-700"
      >
        {mode === 'login' ? 'Login' : 'Sign up'}
      </button>
    </div>
  );
}