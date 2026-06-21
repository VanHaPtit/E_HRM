package QLNV.Controller;

import QLNV.Entity.Employee;
import QLNV.Entity.Role;
import QLNV.Entity.User;
import QLNV.DTO.request.LoginRequest;
import QLNV.DTO.request.SignupRequest;
import QLNV.DTO.response.MessageResponse;
import QLNV.DTO.response.UserInfoResponse;
import QLNV.Repository.EmployeeRepository;
import QLNV.Repository.RoleRepository;
import QLNV.Repository.UserRepository;
import QLNV.Service.ForgotPasswordService;
import QLNV.Service.impl.UserDetailsImpl;
import QLNV.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    EmployeeRepository nhanVienRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        // 2. Lưu thông tin xác thực vào Security Context của Spring
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Lấy thông tin chi tiết người dùng sau khi đăng nhập thành công
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // 4. Tạo Cookie chứa JWT Token
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);
        String jwtToken = jwtCookie.getValue();

        List<String> roles = new ArrayList<>();
        for (org.springframework.security.core.GrantedAuthority authority : userDetails.getAuthorities()) {
            roles.add(authority.getAuthority());
        }
        UserInfoResponse responseBody = new UserInfoResponse(
                jwtToken,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getFullName(),
                roles
        );
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(responseBody);
    }

    @Autowired
    ForgotPasswordService forgotPasswordService;

    // Quên mật khẩu
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam("username") String username) throws Exception {
        forgotPasswordService.processForgotPassword(username);
        return ResponseEntity.ok(new MessageResponse("Mật khẩu mới đã được gửi đến email của bạn."));
    }

    // Đổi mật khẩu
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody QLNV.DTO.request.ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Chưa xác thực"));
        }
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("User không tồn tại"));
        }

        if (!encoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Mật khẩu cũ không chính xác"));
        }

        user.setPasswordHash(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Đổi mật khẩu thành công!"));
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new MessageResponse("You've been signed out!"));
    }
}