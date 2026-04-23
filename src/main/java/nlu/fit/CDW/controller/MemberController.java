package nlu.fit.CDW.controller;

import nlu.fit.CDW.model.ThanhVien;
import nlu.fit.CDW.validator.ThanhVienValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/member")
public class MemberController {

    private static List<ThanhVien> members = new ArrayList<>();

    static {
        members.add(ThanhVien.builder()
                .email("teo@nlu.edu.vn")
                .matkhau("12345678")
                .hoten("Nguyễn Văn Tèo")
                .ngaysinh("01/01/2000")
                .nu(false)
                .build());
    }

    @Autowired
    private ThanhVienValidator thanhVienValidator;

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        if (!model.containsAttribute("thanhVien")) {
            model.addAttribute("thanhVien", new ThanhVien());
        }
        return "register";
    }

    @PostMapping("/register")
    public String registerMember(@ModelAttribute("thanhVien") ThanhVien thanhVien,
                                 BindingResult result, Model model) {
        
        thanhVienValidator.validate(thanhVien, result);

        if (result.hasErrors()) {
            return "register";
        }

        members.add(thanhVien);
        model.addAttribute("thanhVien", thanhVien);
        return "success_member";
    }

    @GetMapping("/list")
    public String listMembers(Model model) {
        model.addAttribute("members", members);
        return "member_list";
    }

    @GetMapping("/filter")
    @ResponseBody
    public List<ThanhVien> filterByGender(@RequestParam String nu) {
        if ("all".equals(nu)) return members;
        boolean isFemale = Boolean.parseBoolean(nu);
        return members.stream().filter(m -> m.isNu() == isFemale).toList();
    }

    @GetMapping("/detail")
    public String memberDetail(@RequestParam String email, Model model) {
        ThanhVien member = members.stream()
                .filter(m -> m.getEmail().equals(email))
                .findFirst()
                .orElse(null);
        model.addAttribute("member", member);
        return "member_detail";
    }

    @GetMapping("/districts")
    @ResponseBody
    public List<String> getDistricts(@RequestParam String city) {
        if ("HCM".equals(city)) return List.of("Quận 1", "Quận 9", "Thủ Đức");
        return List.of("Ba Đình", "Hoàn Kiếm", "Cầu Giấy");
    }

    public static List<ThanhVien> getStaticMembers() {
        return members;
    }
}
