package nlu.fit.backend.dto.profile;

import lombok.Data;
import java.util.List;

@Data
public class UserProfileResponseDto {
    private String fullName;
    private String email;
    private String primaryShippingAddress;
    private String memberSince; // Định dạng chuỗi hiển thị thời gian tham gia (Ví dụ: "October 2021")
    private List<RecentOrderDto> recentOrders; // Danh sách 3-5 đơn hàng hiển thị ở bảng dưới
}