package QLNV.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "allowed_ip")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllowedIp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String ipAddress;

    private String description;

    @Column(nullable = false)
    private boolean isActive = true;
}
