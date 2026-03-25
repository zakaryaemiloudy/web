-- Sample data for BKS Blood Bank System
-- This file is executed after schema creation (ddl-auto: create-drop)

-- Insert sample users (passwords are BCrypt hashed for 'password')
INSERT INTO utilisateur (id, email, mot_de_passe, role, statut, date_creation) VALUES
(1, 'superadmin@bks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'SUPER_ADMIN', 'ACTIF', NOW()),
(2, 'admin@bks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'ACTIF', NOW()),
(3, 'donor1@bks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DONNEUR', 'ACTIF', NOW()),
(4, 'donor2@bks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DONNEUR', 'ACTIF', NOW()),
(5, 'patient1@bks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'PATIENT', 'ACTIF', NOW()),
(6, 'admin2@bks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'ACTIF', NOW()),
(7, 'donor3@bks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DONNEUR', 'ACTIF', NOW()),
(8, 'donor4@bks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DONNEUR', 'ACTIF', NOW()),
(9, 'donor5@bks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DONNEUR', 'ACTIF', NOW()),
(10, 'donor6@bks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DONNEUR', 'ACTIF', NOW()),
(11, 'donor7@bks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DONNEUR', 'ACTIF', NOW()),
(12, 'donor8@bks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DONNEUR', 'ACTIF', NOW()),
(13, 'patient2@bks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'PATIENT', 'ACTIF', NOW()),
(14, 'patient3@bks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'PATIENT', 'ACTIF', NOW()),
(15, 'patient4@bks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'PATIENT', 'ACTIF', NOW());

-- Insert sample hospitals
INSERT INTO hopital (id, nom, adresse, ville, region, capacite_stockage, statut, date_creation) VALUES
(1, 'Hôpital Central Casablanca', '123 Boulevard Hassan II', 'Casablanca', 'Grand Casablanca', 1000, 'VALIDE', NOW()),
(2, 'Clinique Rabat Médical', '456 Avenue Mohammed V', 'Rabat', 'Rabat-Salé-Zemmour-Zaër', 800, 'VALIDE', NOW()),
(3, 'Centre Hospitalier Marrakech', '789 Rue de la Kasbah', 'Marrakech', 'Marrakech-Tensift-Al Haouz', 600, 'VALIDE', NOW()),
(4, 'Hôpital Fès Universitaire', '321 Boulevard Allal Ben Abdallah', 'Fès', 'Fès-Boulemane', 750, 'EN_ATTENTE', NOW()),
(5, 'Clinique Agadir Santé', '654 Avenue du 20 Août', 'Agadir', 'Souss-Massa-Draâ', 500, 'VALIDE', NOW()),
(6, 'Hôpital Meknès Régional', '987 Rue Ibn Khaldoun', 'Meknès', 'Meknès-Tafilalet', 650, 'VALIDE', NOW()),
(7, 'Centre Médical Oujda', '147 Boulevard Zerktouni', 'Oujda', 'Oriental', 550, 'EN_ATTENTE', NOW()),
(8, 'Clinique Tanger Nord', '258 Avenue de la Plage', 'Tanger', 'Tanger-Tétouan', 700, 'SUSPENDU', NOW()),
(9, 'Hôpital Safi Municipal', '369 Rue des Oliviers', 'Safi', 'Doukkala-Abda', 450, 'VALIDE', NOW()),
(10, 'Centre Hospitalier Kénitra', '741 Boulevard de la Gare', 'Kénitra', 'Gharb-Chrarda-Béni Hssen', 600, 'EN_ATTENTE', NOW()),
(11, 'Clinique El Jadida', '852 Avenue Mohammed VI', 'El Jadida', 'Doukkala-Abda', 500, 'VALIDE', NOW()),
(12, 'Hôpital Nador Provincial', '963 Rue de la Méditerranée', 'Nador', 'Oriental', 480, 'VALIDE', NOW()),
(13, 'Centre Médical Tetouan', '159 Boulevard de la Montagne', 'Tétouan', 'Tanger-Tétouan', 520, 'EN_ATTENTE', NOW()),
(14, 'Clinique Beni Mellal', '357 Rue des Roses', 'Beni Mellal', 'Tadla-Azilal', 430, 'VALIDE', NOW()),
(15, 'Hôpital Khouribga', '468 Avenue Industrielle', 'Khouribga', 'Chaouia-Ouardigha', 490, 'SUSPENDU', NOW());

-- Insert sample donors
INSERT INTO donneur (id, utilisateur_id, nom, prenom, date_naissance, groupe_sanguin, telephone, adresse, ville, region, poids, taille, antecedents_medicaux, statut, date_creation) VALUES
(1, 3, 'Alaoui', 'Ahmed', '1990-05-15', 'A_POSITIF', '+212600000001', '10 Rue des Roses', 'Casablanca', 'Grand Casablanca', 75.5, 175, 'Aucun', 'ACTIF', NOW()),
(2, 4, 'Benjelloun', 'Fatima', '1985-08-22', 'O_NEGATIF', '+212600000002', '25 Avenue des Palmiers', 'Rabat', 'Rabat-Salé-Zemmour-Zaër', 68.0, 165, 'Allergie aux pénicillines', 'ACTIF', NOW()),
(3, 7, 'Tazi', 'Youssef', '1992-03-10', 'B_POSITIF', '+212600000003', '5 Boulevard Hassan II', 'Marrakech', 'Marrakech-Tensift-Al Haouz', 80.0, 180, 'Aucun', 'ACTIF', NOW()),
(4, 8, 'El Amrani', 'Amina', '1988-11-05', 'AB_NEGATIF', '+212600000004', '15 Rue Ibn Sina', 'Fès', 'Fès-Boulemane', 65.0, 160, 'Diabète de type 1', 'ACTIF', NOW()),
(5, 9, 'Bennani', 'Omar', '1995-07-20', 'O_POSITIF', '+212600000005', '30 Avenue du Roi', 'Agadir', 'Souss-Massa-Draâ', 72.0, 172, 'Aucun', 'ACTIF', NOW()),
(6, 10, 'Zahraoui', 'Leila', '1987-12-12', 'A_NEGATIF', '+212600000006', '45 Rue de la Kasbah', 'Meknès', 'Meknès-Tafilalet', 70.0, 168, 'Hypertension', 'ACTIF', NOW()),
(7, 11, 'Haddad', 'Karim', '1993-09-08', 'B_NEGATIF', '+212600000007', '60 Boulevard Zerktouni', 'Oujda', 'Oriental', 78.0, 178, 'Aucun', 'ACTIF', NOW()),
(8, 12, 'Mouline', 'Sara', '1991-04-25', 'AB_POSITIF', '+212600000008', '75 Avenue de la Plage', 'Tanger', 'Tanger-Tétouan', 66.0, 162, 'Asthme léger', 'ACTIF', NOW());

-- Insert sample donations
INSERT INTO don (id, donneur_id, hopital_id, campagne_id, quantite_ml, groupe_sanguin, date_don, remarques, statut, date_creation) VALUES
(1, 1, 1, NULL, 450, 'A_POSITIF', '2024-01-15', 'Premier don', 'VALIDE', NOW()),
(2, 1, 1, NULL, 450, 'A_POSITIF', '2024-04-20', 'Don régulier', 'VALIDE', NOW()),
(3, 2, 2, NULL, 450, 'O_NEGATIF', '2024-02-10', 'Don d\'urgence', 'VALIDE', NOW()),
(4, 2, 2, NULL, 450, 'O_NEGATIF', '2024-05-05', 'Don planifié', 'EN_ATTENTE', NOW()),
(5, 3, 3, 1, 450, 'B_POSITIF', '2024-03-15', 'Campagne Ramadan', 'VALIDE', NOW()),
(6, 4, 4, NULL, 450, 'AB_NEGATIF', '2024-01-25', 'Don universitaire', 'VALIDE', NOW()),
(7, 5, 5, NULL, 450, 'O_POSITIF', '2024-02-28', 'Don saisonnier', 'VALIDE', NOW()),
(8, 6, 6, NULL, 450, 'A_NEGATIF', '2024-03-10', 'Don communautaire', 'EN_ATTENTE', NOW()),
(9, 7, 7, NULL, 450, 'B_NEGATIF', '2024-04-05', 'Premier don', 'REJETE', NOW()),
(10, 8, 8, NULL, 450, 'AB_POSITIF', '2024-05-12', 'Don d\'urgence', 'VALIDE', NOW()),
(11, 1, 1, 2, 450, 'A_POSITIF', '2024-06-01', 'Campagne étudiants', 'VALIDE', NOW()),
(12, 3, 3, NULL, 450, 'B_POSITIF', '2024-06-15', 'Don régulier', 'VALIDE', NOW()),
(13, 5, 5, NULL, 450, 'O_POSITIF', '2024-07-03', 'Vacances d\'été', 'EN_ATTENTE', NOW()),
(14, 2, 2, 3, 450, 'O_NEGATIF', '2024-06-14', 'Journée mondiale', 'VALIDE', NOW()),
(15, 4, 4, NULL, 450, 'AB_NEGATIF', '2024-07-20', 'Don planifié', 'VALIDE', NOW()),
(16, 6, 6, NULL, 450, 'A_NEGATIF', '2024-08-05', 'Retour de vacances', 'VALIDE', NOW()),
(17, 7, 7, NULL, 450, 'B_NEGATIF', '2024-08-18', 'Don communautaire', 'EN_ATTENTE', NOW()),
(18, 8, 8, NULL, 450, 'AB_POSITIF', '2024-09-02', 'Nouvelle saison', 'VALIDE', NOW()),
(19, 1, 1, NULL, 450, 'A_POSITIF', '2024-09-15', 'Don mensuel', 'VALIDE', NOW()),
(20, 3, 3, NULL, 450, 'B_POSITIF', '2024-10-01', 'Automne', 'VALIDE', NOW());

-- Insert sample blood requests
INSERT INTO demande_sang (id, hopital_id, groupe_sanguin, quantite_ml, urgence, raison, statut, date_creation) VALUES
(1, 1, 'A_POSITIF', 1000, 'NORMAL', 'Chirurgie programmée', 'EN_COURS', NOW()),
(2, 2, 'O_NEGATIF', 500, 'URGENT', 'Accident de la route', 'EN_COURS', NOW()),
(3, 3, 'B_POSITIF', 800, 'NORMAL', 'Transfusion sanguine', 'TRAITEE', NOW()),
(4, 5, 'AB_NEGATIF', 300, 'URGENT', 'Hémorragie', 'EN_COURS', NOW()),
(5, 6, 'O_POSITIF', 1200, 'NORMAL', 'Opération cardiaque', 'EN_COURS', NOW()),
(6, 7, 'A_NEGATIF', 600, 'URGENT', 'Accident vasculaire', 'TRAITEE', NOW()),
(7, 8, 'B_NEGATIF', 400, 'NORMAL', 'Traitement oncologique', 'ANNULEE', NOW()),
(8, 9, 'AB_POSITIF', 900, 'URGENT', 'Choc hémorragique', 'EN_COURS', NOW()),
(9, 10, 'A_POSITIF', 700, 'NORMAL', 'Transplantation', 'TRAITEE', NOW()),
(10, 11, 'O_NEGATIF', 350, 'URGENT', 'Intervention d\'urgence', 'EN_COURS', NOW()),
(11, 12, 'B_POSITIF', 1100, 'NORMAL', 'Chirurgie orthopédique', 'EN_COURS', NOW()),
(12, 13, 'AB_NEGATIF', 250, 'URGENT', 'Hémorragie digestive', 'TRAITEE', NOW()),
(13, 14, 'O_POSITIF', 850, 'NORMAL', 'Accouchement compliqué', 'ANNULEE', NOW()),
(14, 15, 'A_NEGATIF', 500, 'URGENT', 'Traumatisme crânien', 'EN_COURS', NOW()),
(15, 1, 'B_NEGATIF', 650, 'NORMAL', 'Dialyse rénale', 'TRAITEE', NOW());

-- Insert sample campaigns
INSERT INTO campagne_don (id, titre, description, lieu_collecte, ville, region, date_debut, date_fin, objectif_dons, dons_collectes, statut, date_creation) VALUES
(1, 'Campagne Solidarité Ramadan', 'Collecte de sang pendant le mois sacré', 'Place Jemaa el-Fna', 'Marrakech', 'Marrakech-Tensift-Al Haouz', '2024-03-01', '2024-03-31', 200, 45, 'EN_COURS', NOW()),
(2, 'Don du Sang Étudiants', 'Campagne dans les universités', 'Université Hassan II', 'Casablanca', 'Grand Casablanca', '2024-04-15', '2024-04-30', 150, 120, 'TERMINEE', NOW()),
(3, 'Journée Mondiale du Donneur', 'Célébration internationale', 'Parc de la Ligue Arabe', 'Rabat', 'Rabat-Salé-Zemmour-Zaër', '2024-06-14', '2024-06-14', 100, 0, 'PLANIFIEE', NOW()),
(4, 'Campagne Été Sanguin', 'Collecte estivale pour les besoins accrus', 'Plage d\'Agadir', 'Agadir', 'Souss-Massa-Draâ', '2024-07-01', '2024-07-31', 180, 25, 'EN_COURS', NOW()),
(5, 'Donneurs Solidaires Fès', 'Campagne communautaire', 'Place Boujloud', 'Fès', 'Fès-Boulemane', '2024-05-10', '2024-05-25', 120, 95, 'TERMINEE', NOW()),
(6, 'Sang pour la Vie Meknès', 'Collecte régionale', 'Jardin Lalla Aouda', 'Meknès', 'Meknès-Tafilalet', '2024-08-15', '2024-08-30', 140, 0, 'PLANIFIEE', NOW()),
(7, 'Campagne Oujda Unie', 'Solidarité locale', 'Place du 16 Août 1953', 'Oujda', 'Oriental', '2024-09-01', '2024-09-15', 90, 15, 'EN_COURS', NOW()),
(8, 'Don du Sang Tanger', 'Campagne côtière', 'Port de Tanger', 'Tanger', 'Tanger-Tétouan', '2024-10-05', '2024-10-20', 110, 0, 'PLANIFIEE', NOW()),
(9, 'Solidarité Safi', 'Collecte municipale', 'Port de Safi', 'Safi', 'Doukkala-Abda', '2024-06-20', '2024-07-05', 80, 65, 'TERMINEE', NOW()),
(10, 'Campagne Kénitra Verte', 'Environnement et santé', 'Parc National', 'Kénitra', 'Gharb-Chrarda-Béni Hssen', '2024-11-01', '2024-11-15', 100, 0, 'PLANIFIEE', NOW());

-- Insert sample blood stocks
INSERT INTO stock_sang (id, hopital_id, groupe_sanguin, quantite_ml, date_peremption, statut, date_creation) VALUES
(1, 1, 'A_POSITIF', 2500, '2024-07-15', 'DISPONIBLE', NOW()),
(2, 1, 'O_NEGATIF', 1800, '2024-08-20', 'DISPONIBLE', NOW()),
(3, 2, 'B_POSITIF', 1200, '2024-06-30', 'DISPONIBLE', NOW()),
(4, 2, 'AB_POSITIF', 800, '2024-09-10', 'DISPONIBLE', NOW()),
(5, 3, 'O_POSITIF', 3000, '2024-10-05', 'DISPONIBLE', NOW()),
(6, 5, 'A_NEGATIF', 600, '2024-11-15', 'CRITIQUE', NOW()),
(7, 6, 'B_NEGATIF', 1400, '2024-07-25', 'DISPONIBLE', NOW()),
(8, 6, 'AB_NEGATIF', 950, '2024-08-30', 'DISPONIBLE', NOW()),
(9, 7, 'O_POSITIF', 1100, '2024-09-12', 'DISPONIBLE', NOW()),
(10, 8, 'A_POSITIF', 750, '2024-10-18', 'CRITIQUE', NOW()),
(11, 9, 'B_POSITIF', 1600, '2024-11-02', 'DISPONIBLE', NOW()),
(12, 10, 'AB_POSITIF', 500, '2024-12-08', 'CRITIQUE', NOW()),
(13, 11, 'O_NEGATIF', 2200, '2024-07-30', 'DISPONIBLE', NOW()),
(14, 12, 'A_NEGATIF', 850, '2024-08-15', 'DISPONIBLE', NOW()),
(15, 13, 'B_NEGATIF', 1200, '2024-09-20', 'DISPONIBLE', NOW()),
(16, 14, 'AB_NEGATIF', 400, '2024-10-25', 'CRITIQUE', NOW()),
(17, 15, 'O_POSITIF', 1800, '2024-11-10', 'DISPONIBLE', NOW()),
(18, 4, 'A_POSITIF', 900, '2024-12-01', 'DISPONIBLE', NOW()),
(19, 4, 'O_NEGATIF', 650, '2024-12-15', 'CRITIQUE', NOW()),
(20, 5, 'B_POSITIF', 1300, '2024-07-20', 'DISPONIBLE', NOW());

-- Insert sample notifications
INSERT INTO notification (id, utilisateur_id, titre, message, type, lue, date_creation) VALUES
(1, 3, 'Don validé', 'Votre don du 15 janvier 2024 a été validé. Merci pour votre générosité!', 'DON_VALIDE', false, NOW()),
(2, 4, 'Rappel don', 'Il est temps de faire un nouveau don. Votre dernier don date du 10 février 2024.', 'RAPPEL_DON', false, NOW()),
(3, 5, 'Demande urgente', 'Un besoin urgent en sang O- a été signalé près de chez vous.', 'DEMANDE_URGENTE', false, NOW()),
(4, 7, 'Campagne disponible', 'Nouvelle campagne "Solidarité Ramadan" disponible à Marrakech.', 'CAMPAGNE_DISPONIBLE', false, NOW()),
(5, 8, 'Badge obtenu', 'Félicitations! Vous avez obtenu le badge "Premier Don".', 'BADGE_OBTENU', true, NOW()),
(6, 9, 'Stock critique', 'Stock de sang A- critique dans votre région.', 'STOCK_CRITIQUE', false, NOW()),
(7, 10, 'Don rejeté', 'Votre don du 5 avril 2024 a été rejeté. Contactez votre hôpital pour plus d\'infos.', 'DON_REJETE', false, NOW()),
(8, 11, 'Points gagnés', 'Vous avez gagné 50 points pour votre don récent.', 'POINTS_GAGNES', true, NOW()),
(9, 12, 'Rappel médical', 'N\'oubliez pas votre visite médicale annuelle avant de donner.', 'RAPPEL_MEDICAL', false, NOW()),
(10, 13, 'Demande satisfaite', 'Votre demande de sang a été satisfaite. Merci pour votre patience.', 'DEMANDE_SATISFAITE', true, NOW()),
(11, 14, 'Campagne terminée', 'La campagne "Don du Sang Étudiants" est maintenant terminée.', 'CAMPAGNE_TERMINEE', false, NOW()),
(12, 15, 'Nouveau record', 'Vous avez battu votre record personnel de dons cette année!', 'RECORD_PERSONNEL', true, NOW());

-- Insert sample badges for donors
INSERT INTO badge (id, nom, description, seuil_dons, icone, couleur) VALUES
(1, 'Premier Don', 'Premier don de sang effectué', 1, '🌟', '#FFD700'),
(2, 'Donneur Régulier', '5 dons effectués', 5, '🏆', '#C0C0C0'),
(3, 'Héros du Sang', '10 dons effectués', 10, '💎', '#FF6B6B'),
(4, 'Légende', '25 dons effectués', 25, '👑', '#8B4513');

-- Link donors to badges
INSERT INTO donneur_badge (donneur_id, badge_id, date_obtention) VALUES
(1, 1, NOW()),
(1, 2, NOW()),
(2, 1, NOW()),
(3, 1, NOW()),
(3, 2, NOW()),
(4, 1, NOW()),
(5, 1, NOW()),
(5, 2, NOW()),
(6, 1, NOW()),
(7, 1, NOW()),
(8, 1, NOW()),
(8, 2, NOW());

-- Insert sample monthly reports
INSERT INTO rapport_mensuel (id, mois, annee, total_dons, total_donneurs, total_demandes, demandes_satisfaites, stocks_critiques, date_creation) VALUES
(1, 1, 2024, 45, 32, 28, 25, 2, NOW()),
(2, 2, 2024, 52, 38, 35, 32, 1, NOW()),
(3, 3, 2024, 48, 35, 30, 28, 3, NOW()),
(4, 4, 2024, 61, 42, 40, 37, 2, NOW()),
(5, 5, 2024, 55, 39, 38, 35, 1, NOW()),
(6, 6, 2024, 67, 45, 42, 39, 4, NOW()),
(7, 7, 2024, 49, 36, 33, 30, 2, NOW()),
(8, 8, 2024, 58, 41, 37, 34, 3, NOW()),
(9, 9, 2024, 63, 44, 41, 38, 1, NOW()),
(10, 10, 2024, 56, 40, 35, 32, 2, NOW());

-- Insert sample daily statistics
INSERT INTO statistiques_quotidiennes (id, date_stat, total_dons_jour, nouveaux_donneurs, demandes_traitees, stocks_ajoutes, stocks_utilises, date_creation) VALUES
(1, '2024-03-14', 5, 2, 3, 2250, 1800, NOW()),
(2, '2024-03-13', 7, 1, 4, 3150, 2100, NOW()),
(3, '2024-03-12', 3, 0, 2, 1350, 900, NOW()),
(4, '2024-03-11', 6, 3, 5, 2700, 2400, NOW()),
(5, '2024-03-10', 4, 1, 3, 1800, 1500, NOW()),
(6, '2024-03-09', 8, 2, 6, 3600, 3000, NOW()),
(7, '2024-03-08', 2, 0, 1, 900, 750, NOW()),
(8, '2024-03-07', 9, 4, 7, 4050, 3600, NOW()),
(9, '2024-03-06', 5, 1, 4, 2250, 1800, NOW()),
(10, '2024-03-05', 6, 2, 5, 2700, 2250, NOW());
