import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { useMutation } from '../../hooks/useMutation';
import { authService } from './service/authService';

export function LoginRegister() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { mutate: handleLogin, loading: loginLoading } = useMutation(
    async () => {
      const result = await authService.login(email, password);
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      return result;
    },
    (result) => {
      showToast('Login successful', 'success');
      setTimeout(() => navigate('/'), 1000);
    },
    (err) => {
      showToast(err.message, 'error');
    }
  );

  const { mutate: handleRegister, loading: registerLoading } = useMutation(
    async () => {
      return await authService.register({
        email,
        password,
        name: email.split('@')[0]
      });
    },
    () => {
      showToast('Registration successful, please login', 'success');
      setMode('login');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    },
    (err) => {
      showToast(err.message, 'error');
    }
  );

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill all fields', 'error');
      return;
    }
    handleLogin();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      showToast('Please fill all fields', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    handleRegister();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          {mode === 'login' ? 'Login' : 'Register'}
        </h1>

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 font-semibold"
            >
              {loginLoading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-center mt-4">
              Don't have an account?
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-blue-500 hover:underline ml-2"
              >
                Register
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter your password (min 6 chars)"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={registerLoading}
              className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 font-semibold"
            >
              {registerLoading ? 'Registering...' : 'Register'}
            </button>

            <p className="text-center mt-4">
              Already have an account?
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-blue-500 hover:underline ml-2"
              >
                Login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
