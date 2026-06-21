package QLNV.Service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
public class QRCodeGeneratorService {

    @Value("${app.attendance.qr-url}")
    private String qrBaseUrl;

    private final String SECRET_KEY = "HRM_PROJECT_SECRET_KEY_2026";
    public String generateDynamicToken() {
        long timeIndex = System.currentTimeMillis() / 7000;
        return DigestUtils.sha256Hex(SECRET_KEY + timeIndex);
    }

    public String getQRCodeBase64() throws Exception {
        String token = generateDynamicToken();

        String qrContent = qrBaseUrl + "?token=" + token;

        int width = 400;
        int height = 400;

        // Tạo Matrix cho mã QR
        BitMatrix matrix = new MultiFormatWriter().encode(
                qrContent, BarcodeFormat.QR_CODE, width, height);

        // Ghi Matrix ra stream dưới dạng ảnh PNG
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", outputStream);

        // Chuyển đổi mảng byte sang chuỗi Base64 để Frontend render bằng thẻ <img>
        byte[] pngData = outputStream.toByteArray();
        return Base64.getEncoder().encodeToString(pngData);
    }

    public boolean isValidToken(String clientToken) {
        if (clientToken == null) return false;

        String currentToken = generateDynamicToken();

        long previousTimeIndex = (System.currentTimeMillis() / 7000) - 1;
        String previousToken = DigestUtils.sha256Hex(SECRET_KEY + previousTimeIndex);

        // Token hợp lệ nếu khớp với token hiện tại hoặc token ngay trước đó
        return clientToken.equals(currentToken) || clientToken.equals(previousToken);
    }
}