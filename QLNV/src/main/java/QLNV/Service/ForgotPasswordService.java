package QLNV.Service;

import QLNV.DTO.request.EmailRequest;
import QLNV.Entity.User;
import QLNV.Repository.UserRepository;
import QLNV.Util.PasswordGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ForgotPasswordService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SendGridMailService sendGridMailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void processForgotPassword(String username) {
        String cleanUsername = username != null ? username.trim() : "";
        // 1. Kiểm tra user có tồn tại không
        User user = userRepository.findByUsername(cleanUsername)
                .orElseThrow(() -> new RuntimeException("Tài khoản (Mã nhân viên) không tồn tại trong hệ thống: " + cleanUsername));

        // 2. Lấy Email của nhân viên
        if (user.getNhanVien() == null) {
            throw new RuntimeException("Tài khoản này chưa được liên kết với hồ sơ nhân viên nào.");
        }
        
        String email = user.getNhanVien().getEmailCongTy();
        if (email == null || email.isEmpty()) {
            email = user.getNhanVien().getEmailCaNhan();
        }

        if (email == null || email.isEmpty()) {
            throw new RuntimeException("Không tìm thấy địa chỉ Email nào (công ty hoặc cá nhân) trong hồ sơ của nhân viên này.");
        }

        // 3. Tạo mật khẩu mới
        String newPassword = PasswordGenerator.generateRandomPassword(8);

        // 4. Cập nhật vào DB
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        // 5. Gửi mail thông báo
        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setToEmails(java.util.List.of(email));
        emailRequest.setSubject("Khôi phục mật khẩu - Hệ thống QLNV");
        emailRequest.setContent("Chào bạn,\n\nBạn đã yêu cầu khôi phục mật khẩu.\n\nMật khẩu mới của bạn là: " + newPassword +
                "\n\nVui lòng đăng nhập và đổi lại mật khẩu ngay để bảo đảm an toàn bảo mật.\nTrân trọng.");

        try {
            sendGridMailService.sendMail(emailRequest);
        } catch (Exception e) {
            System.err.println("Không thể gửi email: " + e.getMessage());
            throw new RuntimeException("Lỗi gửi email: " + e.getMessage());
        }
    }
}
