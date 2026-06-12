import React from "react";
import "./forgot-password.css";

type ForgotPasswordPageProps = {
  onBackToLogin: () => void;
};

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onBackToLogin,
}) => {
  return (
    <div className="forgot-page">
      <div className="forgot-page__left">
        <div className="forgot-brand">L&apos;ÉCLAT HÉRITAGE</div>
        <div className="forgot-left__bottom">
          <p className="forgot-quote">
            Mỗi viên đá là một câu chuyện, mỗi thiết kế là một huyền thoại được
            lưu truyền qua nhiều thế hệ tinh hoa.
          </p>
          <p className="forgot-quote__cite">L&apos;ÉCLAT HÉRITAGE</p>
        </div>
      </div>

      <div className="forgot-page__right">
        <div className="forgot-form-shell">
          <main className="forgot-form-main">
            <h1 className="forgot-title">Quên Mật Khẩu</h1>
            <p className="forgot-subtitle">
              Nhập email của bạn để nhận hướng dẫn khôi phục quyền truy cập vào
              bộ sưu tập cá nhân.
            </p>

            <form className="forgot-form">
              <div className="forgot-field">
                <label htmlFor="forgot-phone">Số điện thoại</label>
                <input
                  id="forgot-phone"
                  type="tel"
                  name="phone"
                  placeholder="084XXXXXX"
                  autoComplete="tel"
                />
              </div>

              <div className="forgot-field">
                <label htmlFor="forgot-email">ĐỊA CHỈ EMAIL</label>
                <input
                  id="forgot-email"
                  type="email"
                  name="email"
                  placeholder="example@heritage.com"
                  autoComplete="email"
                />
              </div>

              <button type="submit" className="forgot-submit">
                GỬI YÊU CẦU
              </button>
            </form>

            <button
              type="button"
              className="forgot-back"
              onClick={onBackToLogin}
            >
              ← Quay lại Đăng nhập
            </button>
          </main>

          <footer className="forgot-footer">
            © 2024 L&apos;ÉCLAT HÉRITAGE. ALL RIGHTS RESERVED.
          </footer>

          <button
            type="button"
            className="forgot-help"
            aria-label="Trợ giúp"
            title="Trợ giúp"
          >
            ?
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
