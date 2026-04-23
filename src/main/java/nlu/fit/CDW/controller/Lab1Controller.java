package nlu.fit.CDW.controller;

import nlu.fit.CDW.dto.UserDto;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Controller
public class Lab1Controller {

//    @GetMapping("/")
//    public String home(Model model) {
//        model.addAttribute("message", "Hello World");
//        return "index";
//    }

    @GetMapping("/success")
    public String success(Model model) {
        return "success";
    }

    @PostMapping("/register")
    public String regiser(@RequestBody UserDto userDto, RedirectAttributes redirectAttrs) {
        redirectAttrs.addFlashAttribute("message", "User registered successfully!");

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("email", userDto.email());
        userMap.put("password", userDto.password());
        userMap.put("fullName", userDto.fullName());
        redirectAttrs.addFlashAttribute("user", userMap);

        return "redirect:/success";
    }

    @PostMapping("/exist-email")
    public String existsEmail(String email) {
        List<String> listEmail = new ArrayList<>();
        listEmail.add("test@gmail.com");
        listEmail.add("test1@gmail.com");
        listEmail.add("test2@gmail.com");
        if (listEmail.contains(email)) {
            return "Email exists";
        } else {
            return "Email not exists";
        }
    }
}
