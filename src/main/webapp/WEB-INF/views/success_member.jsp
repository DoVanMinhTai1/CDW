<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Đăng ký thành công</title>
</head>
<body>
    <div style="width: 500px; margin: 50px auto; border: 1px solid green; padding: 20px;">
        <h2 style="color: green;">Đăng ký thành công!</h2>
        <h3>Xin chào: ${thanhVien.hoten}</h3>
        <p><strong>Email:</strong> ${thanhVien.email}</p>
        <p><strong>Mật khẩu:</strong> ${thanhVien.matkhau}</p>
        <hr>
        <a href="/member/list">Xem danh sách thành viên</a> | 
        <a href="/member/register">Đăng ký thêm</a>
    </div>
</body>
</html>
