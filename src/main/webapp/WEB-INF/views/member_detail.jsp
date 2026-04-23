<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Chi tiết thành viên</title>
</head>
<body>
    <div style="width: 500px; margin: 50px auto; border: 1px solid blue; padding: 20px;">
        <h2>Thông tin chi tiết thành viên</h2>
        <p><strong>Họ tên:</strong> ${member.hoten}</p>
        <p><strong>Email:</strong> ${member.email}</p>
        <p><strong>Ngày sinh:</strong> ${member.ngaysinh}</p>
        <p><strong>Giới tính:</strong> ${member.nu ? 'Nữ' : 'Nam'}</p>
        <p><strong>Địa chỉ:</strong> ${member.diachi}, ${member.quan}, ${member.thanhpho}</p>
        <p><strong>Điện thoại:</strong> ${member.dienthoai}</p>
        <hr>
        <a href="/member/list">Quay lại danh sách</a>
    </div>
</body>
</html>
