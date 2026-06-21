package QLNV.Entity.Enum;

public enum RequestStatus {
    CHO_DUYET,      // Đơn vừa gửi – chờ duyệt
    DA_DUYET,       // Đã được duyệt
    TU_CHOI,        // Bị từ chối
    HUY,            // Người gửi tự hủy đơn
    HOAN_TAT       // Đã hoàn tất xử lý
}
