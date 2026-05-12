import React from 'react';
import './login.css';

type LoginPageProps = {
    onSwitchToRegister: () => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
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
                        <button
                            type="button"
                            className="tabs__item tabs__item--active"
                        >
                            ĐĂNG NHẬP
                        </button>
                        <button
                            type="button"
                            className="tabs__item"
                            onClick={onSwitchToRegister}
                        >
                            ĐĂNG KÝ
                        </button>
                    </div>

                    <div className="form-content">
                        <h2>Welcome Back</h2>
                        <p>
                            Vui lòng nhập đầy đủ thông tin để có thể xem bộ sưu tập dành riêng cho bạn.
                        </p>

                        <form>
                            <div className="form-group">
                                <label>EMAIL</label>
                                <input type="email" placeholder="name@maison.com" />
                            </div>

                            <div className="form-group">
                                <div className="password-header">
                                    <label>MẬT KHẨU</label>
                                    <span>QUÊN MẬT KHẨU?</span>
                                </div>

                                <input type="password" placeholder="••••••••" />
                            </div>

                            <button type="submit" className="login-btn">
                                ĐĂNG NHẬP
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

export default LoginPage;