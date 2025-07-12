"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/data/users';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      document.cookie = `session=${user.id}; path=/`;
      router.push('/admin/dashboard');
    } catch {
      setError('Invalid credentials');
    }
  }

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="mb-2 w-full p-2 border" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="mb-2 w-full p-2 border" />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
    </form>
  );
}
