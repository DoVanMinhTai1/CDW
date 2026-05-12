import React from 'react';
import './register.css';

type RegisterPageProps = {
    onSwitchToLogin: () => void;
};

const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
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
                        <button type="button" className="tabs__item" onClick={onSwitchToLogin}>
                            ĐĂNG NHẬP
                        </button>
                        <button type="button" className="tabs__item tabs__item--active">
                            ĐĂNG KÝ
                        </button>
                    </div>

                    <div className="form-content">
                        <h2>Tạo tài khoản mới</h2>
                        <p>Hoàn tất những thông tin bên dưới để bắt đầu trải nghiệm cùng L'Éclat Héritage.</p>

                        <form>
                            <div className="form-group">
                                <label>HỌ VÀ TÊN</label>
                                <input type="text" placeholder="Nguyễn Văn A" />
                            </div>

                            <div className="form-group">
                                <label>EMAIL</label>
                                <input type="email" placeholder="name@maison.com" />
                            </div>

                            <div className="form-group">
                                <label>SỐ ĐIỆN THOẠI</label>
                                <input type="tel" placeholder="09xx xxx xxx" />
                            </div>

                            <div className="form-group">
                                <label>MẬT KHẨU</label>
                                <input type="password" placeholder="Tối thiểu 8 ký tự" />
                            </div>

                            <div className="form-group">
                                <label>XÁC NHẬN MẬT KHẨU</label>
                                <input type="password" placeholder="Nhập lại mật khẩu" />
                            </div>

                            <label className="checkbox-row">
                                <input type="checkbox" />
                                <span>Tôi đồng ý với điều khoản và chính sách bảo mật.</span>
                            </label>

                            <button type="submit" className="login-btn">
                                TẠO TÀI KHOẢN
                            </button>
                        </form>

                        <div className="divider">
                            <span>HOẶC TIẾP TỤC VỚI</span>
                        </div>

                        <div className="social-buttons">
                            <button className="social-btn">
                                <img
                                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                                    alt="Google"
                                />
                                GOOGLE
                            </button>

                            <button className="social-btn">
                                <img
                                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg"
                                    alt="Apple"
                                />
                                APPLE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
