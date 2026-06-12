import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { useMutation } from '../../hooks/useMutation';
import { authService } from './service/authService';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { mutate: login, loading } = useMutation(async () => {
        const result = await authService.login(email, password);
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        return result;
    }, (res) => { showToast('Login successful', 'success'); navigate('/'); }, (err) => showToast(err.message, 'error'));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { showToast('Please fill all fields', 'error'); return; }
        login();
    };

    return (
        <div className="login-page">
            <div className="login-page__left">
                <div className="overlay-content">
                    <h1>L'Éclat Héritage</h1>
                    <p>Di sản chế tác thủ công mang đến sự trang trọng.</p>
                </div>
            </div>

            <div className="login-page__right">
                <div className="form-wrapper">
                    <div className="tabs">
                        <button type="button" className="tabs__item tabs__item--active">ĐĂNG NHẬP</button>
                        <button type="button" className="tabs__item" onClick={() => navigate('/register')}>ĐĂNG KÝ</button>
                    </div>

                    <div className="form-content">
                        <h2>Xin chào trở lại</h2>
                        <p>Vui lòng nhập đầy đủ thông tin để có thể xem bộ sưu tập dành riêng cho bạn.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>EMAIL</label>
                                <input type="email" placeholder="name@maison.com" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <div className="password-header">
                                    <label>MẬT KHẨU</label>
                                    <button type="button" className="password-header__link" onClick={() => navigate('/forgot-password')}>QUÊN MẬT KHẨU?</button>
                                </div>
                                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>

                            <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Logging...' : 'ĐĂNG NHẬP'}</button>
                        </form>

                        <div className="divider"><span>HOẶC TIẾP TỤC VỚI</span></div>

                        <div className="social-buttons">
                            <button className="social-btn"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" /> GOOGLE</button>
                            <button className="social-btn"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" alt="Apple" /> APPLE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;