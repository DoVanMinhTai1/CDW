package nlu.fit.CDW.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThanhVien {
    private String email;
    private String matkhau;
    private String reMatkhau; // Thêm trường nhập lại mật khẩu
    private String hoten;
    private String ngaysinh;
    private boolean nu;
    private String tdvanhoa;
    private String diachi;
    private String dienthoai;
    private String thanhpho;
    private String quan;
    private String phuong;
}
