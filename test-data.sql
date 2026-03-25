-- ============================================
-- TEST DATA FOR HOSPITAL DASHBOARD (CONFLICT-SAFE VERSION)
-- Uses INSERT IGNORE and safe SELECTs to avoid conflicts
-- ============================================

-- IMPORTANT: Set your hospital ID here
SET @HOPITAL_ID = 2;
SET @ADMIN_ID = 1;

-- ============================================
-- 1. CREATE TEST DONORS (skip if email exists)
-- ============================================
INSERT IGNORE INTO utilisateurs (email, mot_de_passe, nom, prenom, telephone, role, actif, date_creation, points_total, hopital_id)
VALUES 
('donneur1@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Martin', 'Jean', '0612345678', 'DONNEUR', true, NOW() - INTERVAL 90 DAY, 150, NULL),
('donneur2@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Bernard', 'Marie', '0623456789', 'DONNEUR', true, NOW() - INTERVAL 60 DAY, 80, NULL),
('donneur3@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Petit', 'Pierre', '0634567890', 'DONNEUR', true, NOW() - INTERVAL 45 DAY, 200, NULL),
('donneur4@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Robert', 'Sophie', '0645678901', 'DONNEUR', true, NOW() - INTERVAL 30 DAY, 50, NULL),
('donneur5@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Richard', 'Lucas', '0656789012', 'DONNEUR', true, NOW() - INTERVAL 15 DAY, 30, NULL),
('donneur6@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Durand', 'Emma', '0667890123', 'DONNEUR', true, NOW() - INTERVAL 10 DAY, 0, NULL),
('donneur7@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Leroy', 'Thomas', '0678901234', 'DONNEUR', true, NOW() - INTERVAL 7 DAY, 10, NULL),
('donneur8@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Moreau', 'Camille', '0689012345', 'DONNEUR', true, NOW() - INTERVAL 5 DAY, 0, NULL);

-- ============================================
-- 2. CREATE DONOR PROFILES (only if user exists and no profile yet)
-- ============================================
INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1985-03-15', 'O_POSITIF', '12 Rue de Paris', 'Paris', 'CIN001', 'HOMME', 70.0, NOW() - INTERVAL 30 DAY, 5, NOW() + INTERVAL 60 DAY
FROM utilisateurs u WHERE u.email = 'donneur1@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1990-07-22', 'A_NEGATIF', '34 Avenue Lyon', 'Lyon', 'CIN002', 'FEMME', 60.0, NOW() - INTERVAL 45 DAY, 3, NOW() + INTERVAL 45 DAY
FROM utilisateurs u WHERE u.email = 'donneur2@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1988-11-08', 'B_POSITIF', '56 Boulevard Marseille', 'Marseille', 'CIN003', 'HOMME', 75.0, NOW() - INTERVAL 20 DAY, 8, NOW() + INTERVAL 70 DAY
FROM utilisateurs u WHERE u.email = 'donneur3@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1992-01-30', 'AB_POSITIF', '78 Rue Bordeaux', 'Bordeaux', 'CIN004', 'FEMME', 65.0, NOW() - INTERVAL 60 DAY, 2, NOW() + INTERVAL 30 DAY
FROM utilisateurs u WHERE u.email = 'donneur4@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1987-05-12', 'O_NEGATIF', '90 Avenue Lille', 'Lille', 'CIN005', 'HOMME', 72.0, NOW() - INTERVAL 15 DAY, 1, NOW() + INTERVAL 75 DAY
FROM utilisateurs u WHERE u.email = 'donneur5@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1995-09-18', 'A_POSITIF', '23 Rue Nantes', 'Nantes', 'CIN006', 'FEMME', 58.0, NULL, 0, NOW()
FROM utilisateurs u WHERE u.email = 'donneur6@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1983-12-05', 'B_NEGATIF', '45 Boulevard Strasbourg', 'Strasbourg', 'CIN007', 'HOMME', 68.0, NOW() - INTERVAL 90 DAY, 4, NOW() + INTERVAL 0 DAY
FROM utilisateurs u WHERE u.email = 'donneur7@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1991-04-25', 'AB_NEGATIF', '67 Avenue Nice', 'Nice', 'CIN008', 'FEMME', 62.0, NULL, 0, NOW()
FROM utilisateurs u WHERE u.email = 'donneur8@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

-- ============================================
-- 3. CREATE BLOOD DEMANDS (skip duplicates based on patient+date)
-- ============================================
INSERT IGNORE INTO demandes_sang (hopital_id, groupe_sanguin_demande, quantite_demandee, urgence, statut, date_demande, date_besoin, nom_patient, prenom_patient, medecin_id, notes)
VALUES
(@HOPITAL_ID, 'O_NEGATIF', 900, 'CRITIQUE', 'EN_ATTENTE', NOW() - INTERVAL 2 HOUR, NOW() + INTERVAL 2 HOUR, 'Dubois', 'Alain', NULL, 'Urgence vitale - chirurgie cardiaque'),
(@HOPITAL_ID, 'AB_NEGATIF', 450, 'CRITIQUE', 'EN_ATTENTE', NOW() - INTERVAL 4 HOUR, NOW() + INTERVAL 4 HOUR, 'Lambert', 'Claire', NULL, 'Urgence - accident de la route'),
(@HOPITAL_ID, 'O_POSITIF', 1350, 'HAUTE', 'EN_ATTENTE', NOW() - INTERVAL 6 HOUR, NOW() + INTERVAL 12 HOUR, 'Fontaine', 'Robert', NULL, 'Transfusion urgente'),
(@HOPITAL_ID, 'A_POSITIF', 900, 'HAUTE', 'EN_COURS', NOW() - INTERVAL 1 DAY, NOW() + INTERVAL 1 DAY, 'Rousseau', 'Julie', NULL, 'Cancer - chimiothérapie'),
(@HOPITAL_ID, 'B_POSITIF', 450, 'NORMALE', 'EN_ATTENTE', NOW() - INTERVAL 2 DAY, NOW() + INTERVAL 3 DAY, 'Girard', 'Nicolas', NULL, 'Anémie sévère'),
(@HOPITAL_ID, 'A_NEGATIF', 450, 'NORMALE', 'VALIDEE', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY, 'Bonnet', 'Marie', NULL, 'Opération programmée'),
(@HOPITAL_ID, 'B_NEGATIF', 450, 'NORMALE', 'EN_ATTENTE', NOW() - INTERVAL 4 DAY, NOW() + INTERVAL 2 DAY, 'Dupont', 'Pierre', NULL, 'Transfusion préventive'),
(@HOPITAL_ID, 'AB_POSITIF', 450, 'BASSE', 'EN_ATTENTE', NOW() - INTERVAL 5 DAY, NOW() + INTERVAL 5 DAY, 'Martin', 'Sophie', NULL, 'Contrôle routinier');

-- ============================================
-- 4. CREATE STOCK LEVELS (delete old, insert new)
-- ============================================
DELETE FROM stock_sang WHERE hopital_id = @HOPITAL_ID;

INSERT INTO stock_sang (hopital_id, groupe_sanguin, quantite_disponible, nombre_poches, niveau_stock, seuil_alerte, seuil_critique, derniere_mise_a_jour, alerte_envoyee)
VALUES
(@HOPITAL_ID, 'O_NEGATIF', 800, 1, 'CRITIQUE', 2000, 1000, NOW(), true),
(@HOPITAL_ID, 'AB_NEGATIF', 1200, 2, 'CRITIQUE', 2000, 1000, NOW(), true),
(@HOPITAL_ID, 'B_NEGATIF', 3500, 7, 'ALERTE', 4000, 2000, NOW(), true),
(@HOPITAL_ID, 'A_NEGATIF', 4200, 9, 'ALERTE', 5000, 2500, NOW(), false),
(@HOPITAL_ID, 'O_POSITIF', 8500, 18, 'NORMAL', 6000, 3000, NOW(), false),
(@HOPITAL_ID, 'A_POSITIF', 7200, 16, 'NORMAL', 5000, 2500, NOW(), false),
(@HOPITAL_ID, 'B_POSITIF', 12000, 26, 'OPTIMAL', 5000, 2500, NOW(), false),
(@HOPITAL_ID, 'AB_POSITIF', 9800, 21, 'OPTIMAL', 5000, 2500, NOW(), false);

-- ============================================
-- 5. CREATE DONATIONS (DONS) - Mix of statuses
-- ============================================
INSERT IGNORE INTO dons (donneur_id, hopital_id, date_don, quantite_ml, statut, valide_par_id, date_validation, date_peremption, numero_poche, notes)
SELECT d.id, @HOPITAL_ID, NOW() - INTERVAL 2 HOUR, 450, 'VALIDE', @ADMIN_ID, NOW() - INTERVAL 1 HOUR, NOW() + INTERVAL 42 DAY, CONCAT('POCHE-', FLOOR(RAND()*1000000)), 'Don standard'
FROM donneurs d JOIN utilisateurs u ON d.utilisateur_id = u.id WHERE u.email = 'donneur1@test.com';

INSERT IGNORE INTO dons (donneur_id, hopital_id, date_don, quantite_ml, statut, valide_par_id, date_validation, date_peremption, numero_poche, notes)
SELECT d.id, @HOPITAL_ID, NOW() - INTERVAL 4 HOUR, 450, 'VALIDE', @ADMIN_ID, NOW() - INTERVAL 3 HOUR, NOW() + INTERVAL 42 DAY, CONCAT('POCHE-', FLOOR(RAND()*1000000)), 'Don standard'
FROM donneurs d JOIN utilisateurs u ON d.utilisateur_id = u.id WHERE u.email = 'donneur2@test.com';

INSERT IGNORE INTO dons (donneur_id, hopital_id, date_don, quantite_ml, statut, valide_par_id, date_validation, date_peremption, numero_poche, notes)
SELECT d.id, @HOPITAL_ID, NOW() - INTERVAL 6 HOUR, 450, 'VALIDE', @ADMIN_ID, NOW() - INTERVAL 5 HOUR, NOW() + INTERVAL 42 DAY, CONCAT('POCHE-', FLOOR(RAND()*1000000)), 'Don standard'
FROM donneurs d JOIN utilisateurs u ON d.utilisateur_id = u.id WHERE u.email = 'donneur3@test.com';

INSERT IGNORE INTO dons (donneur_id, hopital_id, date_don, quantite_ml, statut, valide_par_id, date_validation, date_peremption, numero_poche, notes)
SELECT d.id, @HOPITAL_ID, NOW() - INTERVAL 1 DAY, 450, 'VALIDE', @ADMIN_ID, NOW() - INTERVAL 1 DAY + INTERVAL 2 HOUR, NOW() + INTERVAL 41 DAY, CONCAT('POCHE-', FLOOR(RAND()*1000000)), 'Don standard'
FROM donneurs d JOIN utilisateurs u ON d.utilisateur_id = u.id WHERE u.email = 'donneur4@test.com';

INSERT IGNORE INTO dons (donneur_id, hopital_id, date_don, quantite_ml, statut, valide_par_id, date_validation, date_peremption, numero_poche, notes)
SELECT d.id, @HOPITAL_ID, NOW() - INTERVAL 1 DAY - INTERVAL 2 HOUR, 450, 'VALIDE', @ADMIN_ID, NOW() - INTERVAL 1 DAY + INTERVAL 1 HOUR, NOW() + INTERVAL 41 DAY, CONCAT('POCHE-', FLOOR(RAND()*1000000)), 'Don standard'
FROM donneurs d JOIN utilisateurs u ON d.utilisateur_id = u.id WHERE u.email = 'donneur5@test.com';

INSERT IGNORE INTO dons (donneur_id, hopital_id, date_don, quantite_ml, statut, valide_par_id, date_validation, date_peremption, numero_poche, notes)
SELECT d.id, @HOPITAL_ID, NOW() - INTERVAL 30 MINUTE, 450, 'EN_ATTENTE', NULL, NULL, NULL, NULL, 'En attente de validation'
FROM donneurs d JOIN utilisateurs u ON d.utilisateur_id = u.id WHERE u.email = 'donneur6@test.com';

INSERT IGNORE INTO dons (donneur_id, hopital_id, date_don, quantite_ml, statut, valide_par_id, date_validation, date_peremption, numero_poche, notes)
SELECT d.id, @HOPITAL_ID, NOW() - INTERVAL 1 HOUR, 450, 'EN_ATTENTE', NULL, NULL, NULL, NULL, 'En attente de validation'
FROM donneurs d JOIN utilisateurs u ON d.utilisateur_id = u.id WHERE u.email = 'donneur7@test.com';

INSERT IGNORE INTO dons (donneur_id, hopital_id, date_don, quantite_ml, statut, valide_par_id, date_validation, date_peremption, numero_poche, notes)
SELECT d.id, @HOPITAL_ID, NOW() - INTERVAL 2 HOUR, 450, 'EN_ATTENTE', NULL, NULL, NULL, NULL, 'En attente de validation'
FROM donneurs d JOIN utilisateurs u ON d.utilisateur_id = u.id WHERE u.email = 'donneur8@test.com';

INSERT IGNORE INTO dons (donneur_id, hopital_id, date_don, quantite_ml, statut, valide_par_id, date_validation, date_peremption, numero_poche, notes)
SELECT d.id, @HOPITAL_ID, NOW() - INTERVAL 7 DAY, 450, 'VALIDE', @ADMIN_ID, NOW() - INTERVAL 7 DAY + INTERVAL 2 HOUR, NOW() + INTERVAL 35 DAY, CONCAT('POCHE-', FLOOR(RAND()*1000000)), 'Don standard'
FROM donneurs d JOIN utilisateurs u ON d.utilisateur_id = u.id WHERE u.email = 'donneur1@test.com';

INSERT IGNORE INTO dons (donneur_id, hopital_id, date_don, quantite_ml, statut, valide_par_id, date_validation, date_peremption, numero_poche, notes)
SELECT d.id, @HOPITAL_ID, NOW() - INTERVAL 14 DAY, 450, 'VALIDE', @ADMIN_ID, NOW() - INTERVAL 14 DAY + INTERVAL 2 HOUR, NOW() + INTERVAL 28 DAY, CONCAT('POCHE-', FLOOR(RAND()*1000000)), 'Don standard'
FROM donneurs d JOIN utilisateurs u ON d.utilisateur_id = u.id WHERE u.email = 'donneur2@test.com';

INSERT IGNORE INTO dons (donneur_id, hopital_id, date_don, quantite_ml, statut, valide_par_id, date_validation, date_peremption, numero_poche, notes)
SELECT d.id, @HOPITAL_ID, NOW() - INTERVAL 21 DAY, 450, 'VALIDE', @ADMIN_ID, NOW() - INTERVAL 21 DAY + INTERVAL 2 HOUR, NOW() + INTERVAL 21 DAY, CONCAT('POCHE-', FLOOR(RAND()*1000000)), 'Don standard'
FROM donneurs d JOIN utilisateurs u ON d.utilisateur_id = u.id WHERE u.email = 'donneur3@test.com';

-- ============================================
-- 6. CREATE CAMPAIGNS
-- ============================================
INSERT IGNORE INTO campagnes_don (titre, description, date_debut, date_fin, objectif_dons, dons_actuels, statut, priorite, hopital_id, localisation, notes, image_url, date_creation)
VALUES
('Journée Mondiale du Don de Sang', 'Venez sauver des vies!', NOW() - INTERVAL 2 DAY, NOW() + INTERVAL 5 DAY, 100, 45, 'ACTIVE', 'HAUTE', @HOPITAL_ID, 'Hall principal', 'Inscriptions sur place', NULL, NOW()),
('Marathon du Don', 'Campagne intensive 3 jours', NOW() + INTERVAL 3 DAY, NOW() + INTERVAL 6 DAY, 150, 0, 'A_VENIR', 'NORMALE', @HOPITAL_ID, 'Centre de transfusion', 'Petit déjeuner offert', NULL, NOW()),
('Collecte Urgence O-Négatif', 'Stock critique O-', NOW() - INTERVAL 1 DAY, NOW() + INTERVAL 2 DAY, 50, 12, 'ACTIVE', 'CRITIQUE', @HOPITAL_ID, 'Salle des urgences', 'Appel prioritaire O-', NULL, NOW()),
('Campagne Étudiante', 'Campus donation', NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 3 DAY, 80, 67, 'TERMINEE', 'NORMALE', @HOPITAL_ID, 'Université locale', 'Succès!', NULL, NOW());

-- ============================================
-- 7. CREATE CANDIDATURES
-- ============================================
INSERT IGNORE INTO candidatures_demande (demande_id, donneur_id, statut, date_candidature, date_traitement, notes)
SELECT ds.id, d.id, 'EN_ATTENTE', NOW() - INTERVAL 1 HOUR, NULL, 'Disponible immédiatement'
FROM demandes_sang ds, donneurs d JOIN utilisateurs u ON d.utilisateur_id = u.id 
WHERE ds.nom_patient = 'Dubois' AND u.email = 'donneur1@test.com';

INSERT IGNORE INTO candidatures_demande (demande_id, donneur_id, statut, date_candidature, date_traitement, notes)
SELECT ds.id, d.id, 'EN_ATTENTE', NOW() - INTERVAL 2 HOUR, NULL, 'Peut venir cet après-midi'
FROM demandes_sang ds, donneurs d JOIN utilisateurs u ON d.utilisateur_id = u.id 
WHERE ds.nom_patient = 'Lambert' AND u.email = 'donneur2@test.com';

INSERT IGNORE INTO candidatures_demande (demande_id, donneur_id, statut, date_candidature, date_traitement, notes)
SELECT ds.id, d.id, 'ACCEPTEE', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 20 HOUR, 'Donneur validé'
FROM demandes_sang ds, donneurs d JOIN utilisateurs u ON d.utilisateur_id = u.id 
WHERE ds.nom_patient = 'Rousseau' AND u.email = 'donneur3@test.com';

INSERT IGNORE INTO candidatures_demande (demande_id, donneur_id, statut, date_candidature, date_traitement, notes)
SELECT ds.id, d.id, 'REJETEE', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 DAY, 'Donneur indisponible'
FROM demandes_sang ds, donneurs d JOIN utilisateurs u ON d.utilisateur_id = u.id 
WHERE ds.nom_patient = 'Girard' AND u.email = 'donneur4@test.com';

-- ============================================
-- 8. CREATE NOTIFICATIONS
-- ============================================
INSERT IGNORE INTO notifications (titre, message, type, priorite, date_creation, lue, destinataire_id, hopital_id, lien, date_lecture)
VALUES
('Nouveau don validé', 'Le don de Jean Martin a été validé. +450ml O+ ajouté.', 'SUCCES', 'NORMALE', NOW() - INTERVAL 2 HOUR, false, @ADMIN_ID, @HOPITAL_ID, '/admin/dons', NULL),
('Stock critique O-', 'Stock O- critique: 800ml restant!', 'URGENCE', 'CRITIQUE', NOW() - INTERVAL 4 HOUR, false, @ADMIN_ID, @HOPITAL_ID, '/admin/stocks', NULL),
('Nouvelle candidature', 'Postulation pour Dubois (O-)', 'ALERTE', 'HAUTE', NOW() - INTERVAL 1 HOUR, false, @ADMIN_ID, @HOPITAL_ID, '/admin/demandes', NULL),
('Campagne en cours', '45/100 dons atteints', 'INFO', 'NORMALE', NOW() - INTERVAL 6 HOUR, true, @ADMIN_ID, @HOPITAL_ID, '/admin/campagnes', NOW() - INTERVAL 5 HOUR),
('Demande urgente', 'Nouvelle demande AB- urgent', 'URGENCE', 'HAUTE', NOW() - INTERVAL 3 HOUR, false, @ADMIN_ID, @HOPITAL_ID, '/admin/demandes', NULL);

-- ============================================
-- 9. CREATE BADGES (upsert on duplicate)
-- ============================================
INSERT INTO badges (nom, description, icone, couleur, points_attribues, nombre_dons_requis, actif, date_creation)
VALUES
('Premier Pas', 'Votre premier don', 'volunteer_activism', '#10B981', 50, 1, true, NOW()),
('Donneur Régulier', '5 dons réalisés', 'favorite', '#3B82F6', 100, 5, true, NOW()),
('Héros Anonyme', '10 dons réalisés', 'star', '#8B5CF6', 200, 10, true, NOW()),
('Super Donneur', '20 dons réalisés', 'workspace_premium', '#F59E0B', 500, 20, true, NOW()),
('Légende du Don', '50 dons réalisés', 'emoji_events', '#EF4444', 1000, 50, true, NOW())
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    icone = VALUES(icone),
    couleur = VALUES(couleur);

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'DONORS' as table_name, COUNT(*) as count FROM utilisateurs WHERE role = 'DONNEUR'
UNION ALL SELECT 'DONATIONS', COUNT(*) FROM dons WHERE hopital_id = @HOPITAL_ID
UNION ALL SELECT 'DEMANDS', COUNT(*) FROM demandes_sang WHERE hopital_id = @HOPITAL_ID
UNION ALL SELECT 'STOCKS', COUNT(*) FROM stock_sang WHERE hopital_id = @HOPITAL_ID
UNION ALL SELECT 'CAMPAIGNS', COUNT(*) FROM campagnes_don WHERE hopital_id = @HOPITAL_ID
UNION ALL SELECT 'NOTIFICATIONS', COUNT(*) FROM notifications WHERE hopital_id = @HOPITAL_ID;
