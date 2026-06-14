import React, { useState } from 'react';
import './register.css';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { useMutation } from '../../hooks/useMutation';
import { authService } from './service/authService';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const { mutate: register, loading } = useMutation(async () => {
        return await authService.register({ fullName: name, email, password });
    }, () => { showToast('Đăng ký tài khoản thành công! Vui lòng đăng nhập.', 'success'); navigate('/login'); }, (err) => showToast(err.message, 'error'));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password || !confirm) { showToast('Please fill all fields', 'error'); return; }
        if (password !== confirm) { showToast('Passwords do not match', 'error'); return; }
        register();
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
                        <button type="button" className="tabs__item" onClick={() => navigate('/login')}>ĐĂNG NHẬP</button>
                        <button type="button" className="tabs__item tabs__item--active">ĐĂNG KÝ</button>
                    </div>

                    <div className="form-content">
                        <h2>Tạo tài khoản mới</h2>
                        <p>Hoàn tất những thông tin bên dưới để bắt đầu trải nghiệm cùng L'Éclat Héritage.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group"><label>HỌ VÀ TÊN</label><input type="text" placeholder="Nguyễn Văn A" value={name} onChange={e => setName(e.target.value)} /></div>
                            <div className="form-group"><label>EMAIL</label><input type="email" placeholder="name@maison.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
                            <div className="form-group"><label>SỐ ĐIỆN THOẠI</label><input type="tel" placeholder="09xx xxx xxx" value={phone} onChange={e => setPhone(e.target.value)} /></div>
                            <div className="form-group"><label>MẬT KHẨU</label><input type="password" placeholder="Tối thiểu 8 ký tự" value={password} onChange={e => setPassword(e.target.value)} /></div>
                            <div className="form-group"><label>XÁC NHẬN MẬT KHẨU</label><input type="password" placeholder="Nhập lại mật khẩu" value={confirm} onChange={e => setConfirm(e.target.value)} /></div>

                            <label className="checkbox-row"><input type="checkbox" /> <span>Tôi đồng ý với điều khoản và chính sách bảo mật.</span></label>

                            <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Creating...' : 'TẠO TÀI KHOẢN'}</button>
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

export default RegisterPage;
