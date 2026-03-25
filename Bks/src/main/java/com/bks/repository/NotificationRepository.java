package com.bks.repository;

import com.bks.enums.Role;
import com.bks.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByDestinataireIdOrderByDateCreationDesc(Long destinataireId);
    List<Notification> findByDestinataireIdAndLueFalseOrderByDateCreationDesc(Long destinataireId);
    List<Notification> findByGlobaleTrueOrderByDateCreationDesc();
    List<Notification> findByHopitalIdOrderByDateCreationDesc(Long hopitalId);
    List<Notification> findByRoleCibleOrderByDateCreationDesc(Role role);

    @Query("SELECT n FROM Notification n WHERE n.dateExpiration < :date")
    List<Notification> findNotificationsExpirees(LocalDateTime date);

    Long countByDestinataireIdAndLueFalse(Long destinataireId);
}
