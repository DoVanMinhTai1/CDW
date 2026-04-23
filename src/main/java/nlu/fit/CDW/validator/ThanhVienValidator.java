package nlu.fit.CDW.validator;

import nlu.fit.CDW.controller.MemberController;
import nlu.fit.CDW.model.ThanhVien;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import java.util.regex.Pattern;

@Component
public class ThanhVienValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return ThanhVien.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        ThanhVien tv = (ThanhVien) target;

        // Check trống
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "hoten", "empty", "Bạn không thể để trống dữ liệu này");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "email", "empty", "Bạn không thể để trống dữ liệu này");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "matkhau", "empty", "Bạn không thể để trống dữ liệu này");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "reMatkhau", "empty", "Bạn không thể để trống dữ liệu này");

        // Check Email
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        if (tv.getEmail() != null && !Pattern.compile(emailRegex).matcher(tv.getEmail()).matches()) {
            errors.rejectValue("email", "invalid", "Email không hợp lệ. Thử lại.");
        } else {
            boolean exists = MemberController.getStaticMembers().stream()
                    .anyMatch(m -> m.getEmail().equalsIgnoreCase(tv.getEmail()));
            if (exists) {
                errors.rejectValue("email", "exists", "Email này đã có người đăng ký. Thử lại.");
            }
        }

        // Check độ dài Pass
        if (tv.getMatkhau() != null && tv.getMatkhau().length() < 8) {
            errors.rejectValue("matkhau", "short", "Mật khẩu có ít nhất 8 ký tự. Thử lại.");
        }

        // Check khớp Pass
        if (tv.getMatkhau() != null && !tv.getMatkhau().equals(tv.getReMatkhau())) {
            errors.rejectValue("reMatkhau", "mismatch", "Mật khẩu không tương ứng. Thử lại.");
        }

        // Check format ngày
        String dateRegex = "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/((19|20)\\d\\d)$";
        if (tv.getNgaysinh() != null && !Pattern.compile(dateRegex).matcher(tv.getNgaysinh()).matches()) {
            errors.rejectValue("ngaysinh", "invalid", "Ngày không hợp lệ. Thử lại.");
        }
    }
}
