<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
	<%@ page contentType="text/html;charset=UTF-8" language="java" %>
		<html>

		<head>
			<title>Đăng ký thành viên</title>
			<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/style.css" />
		</head>

		<body>
			<div>

				<h3>Đăng ký thành viên</h3>

				<form id="registerForm" action="/register" method="post">
					<table>
						<tr>
							<td>* Địa chỉ Email:</td>
							<td><input type="email" name="email" required /></td>
						</tr>
						<tr>
							<td>* Mật khẩu:</td>
							<td><input type="password" name="password" required /></td>
						</tr>
						<tr>
							<td>* Nhập lại mật khẩu:</td>
							<td><input type="password" name="confirmPassword" required /></td>
						</tr>
						<tr>
							<td>* Họ tên:</td>
							<td><input type="text" name="fullName" required /></td>
						</tr>
						<tr>
							<td>* Ngày sinh:</td>
							<td><input type="text" name="dob" placeholder="dd/mm/yyyy" required /></td>
						</tr>
						<tr>
							<td>Giới tính:</td>
							<td>
								<input type="checkbox" name="gender" value="female" /> Nữ
							</td>
						</tr>
						<tr>
							<td>Trình độ văn hóa:</td>
							<td>
								<select name="education">
									<option value="">Chọn ...</option>
									<option value="highschool">Trung học</option>
									<option value="college">Cao đẳng</option>
									<option value="university">Đại học</option>
								</select>
							</td>
						</tr>
						<tr>
							<td>Địa chỉ:</td>
							<td><input type="text" name="address" /></td>
						</tr>
						<tr>
							<td>Thành phố:</td>
							<td>
								<select name="city">
									<option value="">Chọn ...</option>
									<option value="hanoi">Hà Nội</option>
									<option value="hcm">TP. Hồ Chí Minh</option>
									<option value="danang">Đà Nẵng</option>
								</select>
							</td>
						</tr>
						<tr>
							<td>Quận:</td>
							<td>
								<select name="district">
									<option value="">Chọn ...</option>
								</select>
							</td>
						</tr>
						<tr>
							<td>Phường:</td>
							<td>
								<select name="ward">
									<option value="">Chọn ...</option>
								</select>
							</td>
						</tr>
						<tr>
							<td>Điện thoại:</td>
							<td><input type="text" name="phone" /></td>
						</tr>
						<tr>
							<td colspan="2">
								<input type="submit" value="Submit" />
							</td>
						</tr>
					</table>
				</form>
			</div>
			
			<h1>Welcome</h1>
			<h2>${message}</h2>
			<a href="${pageContext.request.contextPath}/personList">Person List</a>

			<script>
				function checkHaveDataSpecial(partialData) {
					if (partialData.email || partialData.password || partialData.confirmPassword ||
						partialData.fullName || partialData.dob) {
						// alert("Error Field have Error");
						return;
					}
				}

				function checkEmailExist(email) {
					fetch('${pageContext.request.contextPath}/exist-email', {
						method: 'POST',
						headers: {
							"Content-Type": "application/json"
						},
						body: email
					}).then(response => console.log(response))
						.catch(error => {
							alert("Email Nay da co nguoi dang ky");
						})
				}

				function checkLengthPassword(password) {
					if (password.length < 8) {
						alert("Mật khẩu có ít nhất 8 ký tự.Thử lại.");
						return;

					}
				}

				function checkSamePasswordAndConfirmPassword(password, confirmPassword) {
					if (password.toLowerCase() !== confirmPassword.toUpperCase()) {
						alert("Mat khau khong tuong ung vui long thu lai");
						return;
					}
				}

				function checkDateFormat(date) {
					const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
					if (!datePattern.test(date)) {
						alert("Ngày không hợp lệ.Thử lại.")
						return;
					}
				}

				const form = document.getElementById("registerForm");

				form.addEventListener("submit", function (e) {
					e.preventDefault();

					const formData = new FormData(form);
					const dataObj = {};
					formData.forEach((key, value) => {
						dataObj[value] = key;
					});

					console.log("TestData", dataObj);

					const fields = ["email", "password", "confirmPassword", "fullName", "dob"]
					const partialData = {};
					fields.forEach(key => {
						partialData[key] = formData.get(key);
					})

					checkHaveDataSpecial(partialData);

					const email = partialData.email
					checkEmailExist(email);

					const password = partialData.password;
					checkLengthPassword(password);

					const confirmPassword = partialData.confirmPassword;
					checkSamePasswordAndConfirmPassword(password, confirmPassword);

					const date = partialData.dob;
					checkDateFormat(date);

					fetch('${pageContext.request.contextPath}/register', {
						method: form.method,
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(dataObj)
					})
						.then(response => {
							if (response.redirected) {
								window.location.href = response.url;
							} else {
								return response.json();
							}
						})
						.catch(error => {
							console.error("Error:", error);
						});
				})
			</script>
		</body>

		</html>