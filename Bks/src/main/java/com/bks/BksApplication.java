package com.bks;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BksApplication {
    public static void main(String[] args) {
        SpringApplication.run(BksApplication.class, args);
        System.out.println("\n🩸 Bks démarré avec succès!");
        System.out.println("📍 API disponible sur: http://localhost:8080");
        System.out.println("📚 Documentation: http://localhost:8080/api/docs\n");
    }
}