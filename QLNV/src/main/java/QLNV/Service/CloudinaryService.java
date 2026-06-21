package QLNV.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {

        String resourceType = "auto";

        // Dọn tên file
        String originalName = file.getOriginalFilename();
        String publicId = originalName != null
                ? originalName.replace(" ", "_").replaceAll("[^a-zA-Z0-9._-]", "")
                : "file_" + System.currentTimeMillis();

        Map upload = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "auto",
                        "folder", "hop_dong_lao_dong",
                        "public_id", publicId
                )
        );

        return upload.get("secure_url").toString();
    }

}
