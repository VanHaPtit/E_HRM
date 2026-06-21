package QLNV.Config;

import QLNV.Service.impl.UserDetailsServiceImpl;
import QLNV.security.AuthEntryPointJwt;
import QLNV.security.AuthTokenFilter;
import QLNV.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableMethodSecurity // Cho phép phân quyền bằng @PreAuthorize trong Controller
public class SecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Autowired
    private JwtUtils jwtUtils;

    // --- 1. Filter xử lý Token JWT (Không dùng @Bean để tránh Tomcat tự động đăng ký) ---
    public AuthTokenFilter authenticationJwtTokenFilter() {
        AuthTokenFilter filter = new AuthTokenFilter();
        filter.setJwtUtils(jwtUtils);
        filter.setUserDetailsService(userDetailsService);
        return filter;
    }

    // --- 2. Cấu hình kiểm tra Tài khoản & Mật khẩu ---
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // --- 5. CHUỖI BỘ LỌC BẢO MẬT (Security Filter Chain) ---
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of("*"));
                    config.setAllowedMethods(List.of("*"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setAllowCredentials(false);
                    return config;
                }))

                // Vô hiệu hóa CSRF vì chúng ta dùng Stateless JWT
                .csrf(csrf -> csrf.disable())

                // Xử lý lỗi 401 Unauthorized khi truy cập trái phép
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))

                // Không tạo Session trên Server (Stateless)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Phân quyền URL
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll() // Cho phép Login/Register tự do

                        // CHO PHÉP TẤT CẢ USER ĐỌC DANH MỤC (phục vụ dropdown, hiển thị thông tin)
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/phongban/**", "/api/chucvu/**", "/api/phu-cap/**", "/api/roles/**").hasAnyAuthority("ADMIN", "HR", "USER")

                        // QUYỀN DÀNH CHO ADMIN (Được xem toàn bộ danh mục hệ thống và lương)
                        .requestMatchers("/api/phongban/**", "/api/chucvu/**", "/api/phu-cap/**", "/api/phu-cap-nhan-vien/**", "/api/bangluong/**", "/api/roles/**").hasAuthority("ADMIN")

                        // QUYỀN DÀNH CHO ADMIN & HR (Quản lý hồ sơ nhân viên, hợp đồng)
                        .requestMatchers("/api/hop-dong/**", "/api/nguoi-phu-thuoc/**", "/api/qua-trinh-cong-tac/**", "/api/calamviec/**").hasAnyAuthority("ADMIN", "HR")

                        // QUYỀN CHUNG ADMIN, HR, USER (Chấm công, phép, thông tin cá nhân)
                        .requestMatchers("/api/nhanvien/**", "/api/cham-cong-chi-tiet/**", "/api/attendance/**", "/api/don-xin-phep/**", "/api/quy-phep-nam/**").hasAnyAuthority("ADMIN", "HR", "USER")

                        .anyRequest().authenticated()               // Các API khác phải đăng nhập
                );

        // Đăng ký Provider xác thực
        http.authenticationProvider(authenticationProvider());

        // Kiểm tra JWT Filter trước khi thực hiện các bước khác
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


}