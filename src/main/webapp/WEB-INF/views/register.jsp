<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<html>
<head>
    <title>Đăng ký thành viên</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        .error { color: red; font-style: italic; font-size: 0.9em; }
        table { border-spacing: 10px; }
        .form-container { width: 500px; margin: 0 auto; border: 1px solid #ccc; padding: 20px; }
    </style>
</head>
<body>
<div class="form-container">
    <h2>Đăng ký thành viên</h2>
    <form:form modelAttribute="thanhVien" method="post" action="/member/register">
        <table>
            <tr>
                <td>Họ tên *:</td>
                <td>
                    <form:input path="hoten" />
                    <form:errors path="hoten" cssClass="error" />
                </td>
            </tr>
            <tr>
                <td>Email *:</td>
                <td>
                    <form:input path="email" />
                    <form:errors path="email" cssClass="error" />
                </td>
            </tr>
            <tr>
                <td>Mật khẩu *:</td>
                <td>
                    <form:password path="matkhau" />
                    <form:errors path="matkhau" cssClass="error" />
                </td>
            </tr>
            <tr>
                <td>Nhập lại mật khẩu *:</td>
                <td>
                    <form:password path="reMatkhau" />
                    <form:errors path="reMatkhau" cssClass="error" />
                </td>
            </tr>
            <tr>
                <td>Ngày sinh (dd/mm/yyyy) *:</td>
                <td>
                    <form:input path="ngaysinh" placeholder="dd/mm/yyyy" />
                    <form:errors path="ngaysinh" cssClass="error" />
                </td>
            </tr>
            <tr>
                <td>Giới tính:</td>
                <td>
                    <form:radiobutton path="nu" value="false" label="Nam" />
                    <form:radiobutton path="nu" value="true" label="Nữ" />
                </td>
            </tr>
            <tr>
                <td>Thành phố:</td>
                <td>
                    <form:select path="thanhpho" id="city">
                        <form:option value="" label="-- Chọn Thành phố --" />
                        <form:option value="HCM" label="TP. Hồ Chí Minh" />
                        <form:option value="HN" label="Hà Nội" />
                    </form:select>
                </td>
            </tr>
            <tr>
                <td>Quận/Huyện:</td>
                <td>
                    <form:select path="quan" id="district">
                        <form:option value="" label="-- Chọn Quận --" />
                    </form:select>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <button type="submit">Submit</button>
                    <button type="reset">Reset</button>
                </td>
            </tr>
        </table>
    </form:form>
</div>

<script>
    $(document).ready(function() {
        // AJAX cho Cascading Dropdown
        $('#city').change(function() {
            var selectedCity = $(this).val();
            if (selectedCity) {
                $.ajax({
                    url: '/member/districts',
                    data: { city: selectedCity },
                    success: function(data) {
                        var districtSelect = $('#district');
                        districtSelect.empty();
                        districtSelect.append('<option value="">-- Chọn Quận --</option>');
                        $.each(data, function(index, value) {
                            districtSelect.append('<option value="' + value + '">' + value + '</option>');
                        });
                    }
                });
            }
        });
    });
</script>
</body>
</html>
