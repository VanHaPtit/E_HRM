package QLNV.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "tax_brackets")
@Data
public class TaxBracket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal nguongThuNhap; // Ví dụ: 5,000,000; 10,000,000...
    private Double thueSuat;          // Ví dụ: 0.05; 0.1...
    private BigDecimal giamTruBac;    // Số tiền trừ thẳng (VD: 250,000) để tính nhanh
}
