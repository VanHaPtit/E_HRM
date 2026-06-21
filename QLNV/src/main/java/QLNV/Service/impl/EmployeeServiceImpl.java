package QLNV.Service.impl;

import QLNV.DTO.mapper.EmployeeMapper;
import QLNV.DTO.request.EmployeeRequest;
import QLNV.DTO.response.EmployeeResponse;
import QLNV.Entity.Employee;
import QLNV.Repository.EmployeeRepository;
import QLNV.Service.CloudinaryService;
import QLNV.Service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository nhanVienRepository;

    @Autowired
    private QLNV.Repository.UserRepository userRepository;

    @Autowired
    private QLNV.Repository.RoleRepository roleRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private CloudinaryService cloudinaryService;
    
    @Autowired
    private EmployeeMapper mapper;

    @Override
    public List<EmployeeResponse> getAll() {
        return nhanVienRepository.findAll().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<EmployeeResponse> getById(Long id) {
        return nhanVienRepository.findById(id).map(mapper::toResponse);
    }

    @Override
    public EmployeeResponse save(EmployeeRequest request, MultipartFile file) throws IOException {
        Employee nv = new Employee();
        mapper.updateEntityFromRequest(nv, request);

        if (file != null && !file.isEmpty()) {
            nv.setAvatarUrl(cloudinaryService.uploadImage(file));
        }

        Employee savedNv = nhanVienRepository.save(nv);

        // Tự động tạo tài khoản cho nhân viên mới
        QLNV.Entity.User user = new QLNV.Entity.User();
        // Dùng mã nhân viên làm username mặc định
        user.setUsername(savedNv.getMaNv());
        // Mật khẩu mặc định là 123456
        user.setPasswordHash(passwordEncoder.encode("123456"));
        user.setNhanVien(savedNv);

        // Lấy quyền mặc định là USER
        QLNV.Entity.Role role = roleRepository.findByTenRole("USER")
                .orElseThrow(() -> new RuntimeException("Error: Role USER is not found in database."));
        user.setRole(role);
        
        userRepository.save(user);

        return mapper.toResponse(savedNv);
    }

    @Override
    public EmployeeResponse update(Long id, EmployeeRequest request, MultipartFile file) throws IOException {
        Employee existing = nhanVienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại"));

        mapper.updateEntityFromRequest(existing, request);

        if (file != null && !file.isEmpty()) {
            existing.setAvatarUrl(cloudinaryService.uploadImage(file));
        }

        return mapper.toResponse(nhanVienRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!nhanVienRepository.existsById(id)) throw new RuntimeException("Không tìm thấy");
        nhanVienRepository.deleteById(id);
    }

    @Override
    public EmployeeResponse findByMaNv(String maNv) {
        return nhanVienRepository.findByMaNv(maNv)
                .map(mapper::toResponse)
                .orElse(null);
    }
}

