package nlu.fit.CDW.dto;

public record UserDto(String email,
                      String password,
                      String confirmPassword,
                      String fullName,
                      String dob,
                      String gender,
                      String education,
                      String address,
                      String city,
                      String district,
                      String ward,
                      String phone) {
}
