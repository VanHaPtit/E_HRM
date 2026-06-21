package QLNV.Repository;

import QLNV.Entity.AllowedIp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AllowedIpRepository extends JpaRepository<AllowedIp, Long> {
    List<AllowedIp> findByIsActiveTrue();
    Optional<AllowedIp> findByIpAddressAndIsActiveTrue(String ipAddress);
}
