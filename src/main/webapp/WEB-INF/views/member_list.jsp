<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>Danh sách thành viên</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header-container { display: flex; justify-content: space-between; align-items: center; }
    </style>
</head>
<body>
<div style="width: 800px; margin: 0 auto;">
    <div class="header-container">
        <h3>Tổng số thành viên: <span id="total">${members.size()}</span></h3>
        <button onclick="window.location.href='/member/register'">Thêm nhân viên</button>
    </div>

    <div style="margin: 20px 0;">
        Lọc giới tính: 
        <select id="genderFilter">
            <option value="all">Tất cả</option>
            <option value="false">Nam</option>
            <option value="true">Nữ</option>
        </select>
    </div>

    <table>
        <thead>
            <tr>
                <th>Họ tên</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody id="memberTableBody">
            <c:forEach var="m" items="${members}">
                <tr>
                    <td>${m.hoten}</td>
                    <td>${m.ngaysinh}</td>
                    <td>${m.nu ? 'Nữ' : 'Nam'}</td>
                    <td><a href="/member/detail?email=${m.email}">${m.email}</a></td>
                </tr>
            </c:forEach>
        </tbody>
    </table>
</div>

<script>
    $(document).ready(function() {
        $('#genderFilter').change(function() {
            var gender = $(this).val();
            // Nếu chọn 'all', ta reload trang hoặc gọi API lấy tất cả. Ở đây ta gọi API filter.
            $.ajax({
                url: '/member/filter',
                data: { nu: gender },
                success: function(data) {
                    var tbody = $('#memberTableBody');
                    tbody.empty();
                    $.each(data, function(index, m) {
                        var genderText = m.nu ? 'Nữ' : 'Nam';
                        tbody.append(
                            '<tr>' +
                            '<td>' + m.hoten + '</td>' +
                            '<td>' + m.ngaysinh + '</td>' +
                            '<td>' + genderText + '</td>' +
                            '<td><a href="/member/detail?email=' + m.email + '">' + m.email + '</a></td>' +
                            '</tr>'
                        );
                    });
                    $('#total').text(data.length);
                }
            });
        });
    });
</script>
</body>
</html>
