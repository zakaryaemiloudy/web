-- ============================================
-- COMPREHENSIVE TEST DATA - BLOOD BANK SYSTEM
-- Run this to populate database with abundant test data
-- Safe to run multiple times (uses INSERT IGNORE)
-- ============================================

-- Set your hospital ID (run for each hospital you want to populate)
SET @HOPITAL_ID = 2;
SET @ADMIN_ID = 1;

-- ============================================
-- 1. CREATE HOSPITALS (if not exists)
-- ============================================
INSERT IGNORE INTO hopitaux (nom, adresse, ville, code_postal, telephone, email, capacite_stock_max, date_creation)
VALUES
('Centre Hospitalier Principal', '123 Avenue de la Santé', 'Paris', '75001', '0142345678', 'contact@chp-paris.fr', 100000, NOW()),
('Hôpital Universitaire Lyon', '45 Rue de la Recherche', 'Lyon', '69001', '0472345678', 'contact@hu-lyon.fr', 80000, NOW()),
('CHU Marseille', '78 Boulevard du Prado', 'Marseille', '13001', '0491345678', 'contact@chu-marseille.fr', 90000, NOW());

-- ============================================
-- 2. CREATE TEST DONORS (30 donors, skip if email exists)
-- ============================================
INSERT IGNORE INTO utilisateurs (email, mot_de_passe, nom, prenom, telephone, role, actif, date_creation, points_total, hopital_id)
VALUES 
('donneur1@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Martin', 'Jean', '0612345678', 'DONNEUR', true, NOW() - INTERVAL 90 DAY, 150, NULL),
('donneur2@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Bernard', 'Marie', '0623456789', 'DONNEUR', true, NOW() - INTERVAL 60 DAY, 80, NULL),
('donneur3@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Petit', 'Pierre', '0634567890', 'DONNEUR', true, NOW() - INTERVAL 45 DAY, 200, NULL),
('donneur4@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Robert', 'Sophie', '0645678901', 'DONNEUR', true, NOW() - INTERVAL 30 DAY, 50, NULL),
('donneur5@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Richard', 'Lucas', '0656789012', 'DONNEUR', true, NOW() - INTERVAL 15 DAY, 30, NULL),
('donneur6@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Durand', 'Emma', '0667890123', 'DONNEUR', true, NOW() - INTERVAL 10 DAY, 0, NULL),
('donneur7@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Leroy', 'Thomas', '0678901234', 'DONNEUR', true, NOW() - INTERVAL 7 DAY, 10, NULL),
('donneur8@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Moreau', 'Camille', '0689012345', 'DONNEUR', true, NOW() - INTERVAL 5 DAY, 0, NULL),
('donneur9@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Garcia', 'Antoine', '0690123456', 'DONNEUR', true, NOW() - INTERVAL 120 DAY, 300, NULL),
('donneur10@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Roux', 'Julie', '0601234567', 'DONNEUR', true, NOW() - INTERVAL 200 DAY, 450, NULL),
('donneur11@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Fournier', 'David', '0611122334', 'DONNEUR', true, NOW() - INTERVAL 50 DAY, 100, NULL),
('donneur12@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Girard', 'Laura', '0622233445', 'DONNEUR', true, NOW() - INTERVAL 80 DAY, 180, NULL),
('donneur13@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Andre', 'Nicolas', '0633344556', 'DONNEUR', true, NOW() - INTERVAL 25 DAY, 20, NULL),
('donneur14@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Mercier', 'Sarah', '0644455667', 'DONNEUR', true, NOW() - INTERVAL 35 DAY, 60, NULL),
('donneur15@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Dupont', 'Alexandre', '0655566778', 'DONNEUR', true, NOW() - INTERVAL 12 DAY, 5, NULL),
('donneur16@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Lambert', 'Chloe', '0666677889', 'DONNEUR', true, NOW() - INTERVAL 70 DAY, 120, NULL),
('donneur17@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Bonnet', 'Maxime', '0677788990', 'DONNEUR', true, NOW() - INTERVAL 40 DAY, 90, NULL),
('donneur18@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Francois', 'Emilie', '0688899001', 'DONNEUR', true, NOW() - INTERVAL 55 DAY, 75, NULL),
('donneur19@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Martinez', 'Hugo', '0699900112', 'DONNEUR', true, NOW() - INTERVAL 20 DAY, 35, NULL),
('donneur20@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Lefebvre', 'Manon', '0600112233', 'DONNEUR', true, NOW() - INTERVAL 95 DAY, 250, NULL),
('donneur21@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'David', 'Romain', '0611223344', 'DONNEUR', true, NOW() - INTERVAL 65 DAY, 95, NULL),
('donneur22@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Chevalier', 'Anais', '0622334455', 'DONNEUR', true, NOW() - INTERVAL 30 DAY, 55, NULL),
('donneur23@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Maillard', 'Theo', '0633445566', 'DONNEUR', true, NOW() - INTERVAL 18 DAY, 15, NULL),
('donneur24@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Brunet', 'Lola', '0644556677', 'DONNEUR', true, NOW() - INTERVAL 8 DAY, 8, NULL),
('donneur25@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Barbier', 'Louis', '0655667788', 'DONNEUR', true, NOW() - INTERVAL 110 DAY, 380, NULL),
('donneur26@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Arnaud', 'Jade', '0666778899', 'DONNEUR', true, NOW() - INTERVAL 45 DAY, 70, NULL),
('donneur27@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Colin', 'Ethan', '0677889900', 'DONNEUR', true, NOW() - INTERVAL 22 DAY, 25, NULL),
('donneur28@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Vidal', 'Alice', '0688990011', 'DONNEUR', true, NOW() - INTERVAL 3 DAY, 2, NULL),
('donneur29@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Perrin', 'Nathan', '0699001122', 'DONNEUR', true, NOW() - INTERVAL 140 DAY, 520, NULL),
('donneur30@test.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjJAgM7iMVRuY1Y6WZL3F3p4xJhB0aG', 'Morin', 'Zoe', '0600112234', 'DONNEUR', true, NOW() - INTERVAL 75 DAY, 130, NULL);

-- ============================================
-- 3. CREATE DONOR PROFILES (all blood groups)
-- ============================================
INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1985-03-15', 'O_POSITIF', '12 Rue de Paris', 'Paris', 'CIN001', 'HOMME', 70.0, NOW() - INTERVAL 30 DAY, 5, NOW() + INTERVAL 60 DAY FROM utilisateurs u WHERE u.email = 'donneur1@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1990-07-22', 'A_NEGATIF', '34 Avenue Lyon', 'Lyon', 'CIN002', 'FEMME', 60.0, NOW() - INTERVAL 45 DAY, 3, NOW() + INTERVAL 45 DAY FROM utilisateurs u WHERE u.email = 'donneur2@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1988-11-08', 'B_POSITIF', '56 Boulevard Marseille', 'Marseille', 'CIN003', 'HOMME', 75.0, NOW() - INTERVAL 20 DAY, 8, NOW() + INTERVAL 70 DAY FROM utilisateurs u WHERE u.email = 'donneur3@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1992-01-30', 'AB_POSITIF', '78 Rue Bordeaux', 'Bordeaux', 'CIN004', 'FEMME', 65.0, NOW() - INTERVAL 60 DAY, 2, NOW() + INTERVAL 30 DAY FROM utilisateurs u WHERE u.email = 'donneur4@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1987-05-12', 'O_NEGATIF', '90 Avenue Lille', 'Lille', 'CIN005', 'HOMME', 72.0, NOW() - INTERVAL 15 DAY, 1, NOW() + INTERVAL 75 DAY FROM utilisateurs u WHERE u.email = 'donneur5@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1995-09-18', 'A_POSITIF', '23 Rue Nantes', 'Nantes', 'CIN006', 'FEMME', 58.0, NULL, 0, NOW() FROM utilisateurs u WHERE u.email = 'donneur6@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1983-12-05', 'B_NEGATIF', '45 Boulevard Strasbourg', 'Strasbourg', 'CIN007', 'HOMME', 68.0, NOW() - INTERVAL 90 DAY, 4, NOW() + INTERVAL 0 DAY FROM utilisateurs u WHERE u.email = 'donneur7@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1991-04-25', 'AB_NEGATIF', '67 Avenue Nice', 'Nice', 'CIN008', 'FEMME', 62.0, NULL, 0, NOW() FROM utilisateurs u WHERE u.email = 'donneur8@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

-- Continue with remaining donors (varied blood groups)
INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1986-06-14', 'O_POSITIF', '11 Place de la République', 'Paris', 'CIN009', 'HOMME', 75.0, NOW() - INTERVAL 25 DAY, 6, NOW() + INTERVAL 65 DAY FROM utilisateurs u WHERE u.email = 'donneur9@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1989-09-23', 'O_POSITIF', '22 Rue du Commerce', 'Lyon', 'CIN010', 'FEMME', 55.0, NOW() - INTERVAL 10 DAY, 10, NOW() + INTERVAL 80 DAY FROM utilisateurs u WHERE u.email = 'donneur10@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1987-11-02', 'A_POSITIF', '33 Avenue Victor Hugo', 'Marseille', 'CIN011', 'HOMME', 82.0, NOW() - INTERVAL 40 DAY, 4, NOW() + INTERVAL 50 DAY FROM utilisateurs u WHERE u.email = 'donneur11@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1993-02-18', 'A_NEGATIF', '44 Rue de la Paix', 'Bordeaux', 'CIN012', 'FEMME', 63.0, NOW() - INTERVAL 5 DAY, 7, NOW() + INTERVAL 85 DAY FROM utilisateurs u WHERE u.email = 'donneur12@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1990-08-30', 'B_POSITIF', '55 Boulevard Saint-Germain', 'Lille', 'CIN013', 'HOMME', 78.0, NOW() - INTERVAL 20 DAY, 2, NOW() + INTERVAL 70 DAY FROM utilisateurs u WHERE u.email = 'donneur13@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1984-12-12', 'B_NEGATIF', '66 Rue de Rivoli', 'Nantes', 'CIN014', 'FEMME', 59.0, NOW() - INTERVAL 35 DAY, 5, NOW() + INTERVAL 55 DAY FROM utilisateurs u WHERE u.email = 'donneur14@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1996-03-08', 'AB_POSITIF', '77 Avenue des Champs-Élysées', 'Strasbourg', 'CIN015', 'HOMME', 71.0, NULL, 0, NOW() FROM utilisateurs u WHERE u.email = 'donneur15@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1982-07-19', 'O_NEGATIF', '88 Rue Montmartre', 'Nice', 'CIN016', 'FEMME', 67.0, NOW() - INTERVAL 50 DAY, 8, NOW() + INTERVAL 40 DAY FROM utilisateurs u WHERE u.email = 'donneur16@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1994-05-25', 'O_POSITIF', '99 Boulevard Haussmann', 'Paris', 'CIN017', 'HOMME', 74.0, NOW() - INTERVAL 15 DAY, 3, NOW() + INTERVAL 75 DAY FROM utilisateurs u WHERE u.email = 'donneur17@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1988-10-03', 'A_POSITIF', '10 Place Bellecour', 'Lyon', 'CIN018', 'FEMME', 61.0, NOW() - INTERVAL 28 DAY, 4, NOW() + INTERVAL 62 DAY FROM utilisateurs u WHERE u.email = 'donneur18@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1991-01-17', 'B_POSITIF', '20 Vieux-Port', 'Marseille', 'CIN019', 'HOMME', 80.0, NOW() - INTERVAL 8 DAY, 2, NOW() + INTERVAL 82 DAY FROM utilisateurs u WHERE u.email = 'donneur19@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1986-04-09', 'AB_NEGATIF', '30 Place de la Bourse', 'Bordeaux', 'CIN020', 'FEMME', 57.0, NOW() - INTERVAL 60 DAY, 12, NOW() + INTERVAL 30 DAY FROM utilisateurs u WHERE u.email = 'donneur20@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1989-08-21', 'A_NEGATIF', '40 Grand Place', 'Lille', 'CIN021', 'HOMME', 76.0, NOW() - INTERVAL 22 DAY, 3, NOW() + INTERVAL 68 DAY FROM utilisateurs u WHERE u.email = 'donneur21@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1992-11-30', 'B_NEGATIF', '50 Promenade des Anglais', 'Nice', 'CIN022', 'FEMME', 64.0, NOW() - INTERVAL 12 DAY, 2, NOW() + INTERVAL 78 DAY FROM utilisateurs u WHERE u.email = 'donneur22@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1995-02-14', 'O_POSITIF', '60 Rue de la République', 'Strasbourg', 'CIN023', 'HOMME', 73.0, NULL, 0, NOW() FROM utilisateurs u WHERE u.email = 'donneur23@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1987-06-28', 'A_POSITIF', '70 Avenue Jean Médecin', 'Nice', 'CIN024', 'FEMME', 66.0, NOW() - INTERVAL 4 DAY, 1, NOW() + INTERVAL 86 DAY FROM utilisateurs u WHERE u.email = 'donneur24@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1983-09-05', 'B_POSITIF', '80 Rue du Président', 'Paris', 'CIN025', 'HOMME', 85.0, NOW() - INTERVAL 75 DAY, 15, NOW() + INTERVAL 15 DAY FROM utilisateurs u WHERE u.email = 'donneur25@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1990-12-20', 'AB_POSITIF', '90 Boulevard de la Liberté', 'Lyon', 'CIN026', 'FEMME', 60.0, NOW() - INTERVAL 18 DAY, 2, NOW() + INTERVAL 72 DAY FROM utilisateurs u WHERE u.email = 'donneur26@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1994-03-11', 'O_NEGATIF', '100 Place Garibaldi', 'Marseille', 'CIN027', 'HOMME', 69.0, NOW() - INTERVAL 9 DAY, 1, NOW() + INTERVAL 81 DAY FROM utilisateurs u WHERE u.email = 'donneur27@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1996-07-04', 'A_NEGATIF', '110 Rue Sainte-Catherine', 'Bordeaux', 'CIN028', 'FEMME', 54.0, NULL, 0, NOW() FROM utilisateurs u WHERE u.email = 'donneur28@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1985-10-16', 'B_NEGATIF', '120 Grand Boulevard', 'Lille', 'CIN029', 'HOMME', 77.0, NOW() - INTERVAL 35 DAY, 9, NOW() + INTERVAL 55 DAY FROM utilisateurs u WHERE u.email = 'donneur29@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);

INSERT IGNORE INTO donneurs (utilisateur_id, date_naissance, groupe_sanguin, adresse, ville, cin, sexe, poids, dernier_don_valide, nombre_dons_total, prochaine_eligibilite)
SELECT u.id, '1991-05-22', 'AB_NEGATIF', '130 Avenue de la Plage', 'Nice', 'CIN030', 'FEMME', 62.0, NOW() - INTERVAL 20 DAY, 3, NOW() + INTERVAL 70 DAY FROM utilisateurs u WHERE u.email = 'donneur30@test.com' AND NOT EXISTS (SELECT 1 FROM donneurs d WHERE d.utilisateur_id = u.id);


-- ============================================
-- 4. CREATE BLOOD STOCKS (all 8 blood groups)
-- ============================================
INSERT IGNORE INTO stocks (hopital_id, groupe_sanguin, quantite_ml, nombre_poches, seuil_alerte, seuil_critique, niveau_stock, date_derniere_mise_a_jour)
VALUES
(@HOPITAL_ID, 'A_POSITIF', 22500, 50, 4500, 2250, 'NORMAL', NOW() - INTERVAL 1 DAY),
(@HOPITAL_ID, 'A_NEGATIF', 9000, 20, 2250, 900, 'ALERTE', NOW() - INTERVAL 2 DAY),
(@HOPITAL_ID, 'B_POSITIF', 18000, 40, 4500, 2250, 'NORMAL', NOW() - INTERVAL 1 DAY),
(@HOPITAL_ID, 'B_NEGATIF', 6750, 15, 2250, 900, 'ALERTE', NOW() - INTERVAL 3 DAY),
(@HOPITAL_ID, 'AB_POSITIF', 13500, 30, 2250, 900, 'NORMAL', NOW() - INTERVAL 1 DAY),
(@HOPITAL_ID, 'AB_NEGATIF', 4500, 10, 1350, 450, 'CRITIQUE', NOW() - INTERVAL 4 DAY),
(@HOPITAL_ID, 'O_POSITIF', 31500, 70, 6750, 4500, 'OPTIMAL', NOW() - INTERVAL 1 DAY),
(@HOPITAL_ID, 'O_NEGATIF', 5400, 12, 2250, 900, 'CRITIQUE', NOW() - INTERVAL 5 DAY);

-- ============================================
-- 5. CREATE BLOOD DEMANDS (15+ demands, varied statuses)
-- ============================================
INSERT IGNORE INTO demandes_sang (hopital_id, groupe_sanguin_demande, quantite_demandee, urgence, statut, date_demande, date_besoin, nom_patient, prenom_patient, medecin_id, notes)
VALUES
(@HOPITAL_ID, 'O_NEGATIF', 900, 'CRITIQUE', 'EN_ATTENTE', NOW() - INTERVAL 2 HOUR, NOW() + INTERVAL 2 HOUR, 'Dubois', 'Alain', NULL, 'Urgence vitale - chirurgie cardiaque'),
(@HOPITAL_ID, 'AB_NEGATIF', 450, 'CRITIQUE', 'EN_ATTENTE', NOW() - INTERVAL 4 HOUR, NOW() + INTERVAL 4 HOUR, 'Lambert', 'Claire', NULL, 'Urgence - accident de la route'),
(@HOPITAL_ID, 'O_POSITIF', 1350, 'HAUTE', 'EN_ATTENTE', NOW() - INTERVAL 6 HOUR, NOW() + INTERVAL 12 HOUR, 'Fontaine', 'Robert', NULL, 'Transfusion urgente'),
(@HOPITAL_ID, 'A_NEGATIF', 900, 'CRITIQUE', 'VALIDEE', NOW() - INTERVAL 8 HOUR, NOW() + INTERVAL 1 HOUR, 'Moreau', 'Sophie', @ADMIN_ID, 'Chirurgie d urgence - stock suffisant'),
(@HOPITAL_ID, 'B_POSITIF', 450, 'NORMALE', 'EN_ATTENTE', NOW() - INTERVAL 10 HOUR, NOW() + INTERVAL 24 HOUR, 'Garcia', 'Marc', NULL, 'Transfusion programmée'),
(@HOPITAL_ID, 'AB_POSITIF', 450, 'NORMALE', 'EN_ATTENTE', NOW() - INTERVAL 12 HOUR, NOW() + INTERVAL 48 HOUR, 'Roux', 'Isabelle', NULL, 'Anémie sévère - traitement en cours'),
(@HOPITAL_ID, 'O_POSITIF', 900, 'HAUTE', 'VALIDEE', NOW() - INTERVAL 1 DAY, NOW(), 'Petit', 'Julien', @ADMIN_ID, 'Transfusion urgente - patient stabilisé'),
(@HOPITAL_ID, 'A_POSITIF', 450, 'NORMALE', 'EN_ATTENTE', NOW() - INTERVAL 1 DAY, NOW() + INTERVAL 2 DAY, 'Durand', 'Emma', NULL, 'Chimiothérapie - traitement régulier'),
(@HOPITAL_ID, 'B_NEGATIF', 450, 'CRITIQUE', 'EN_ATTENTE', NOW() - INTERVAL 18 HOUR, NOW() + INTERVAL 6 HOUR, 'Leroy', 'Thomas', NULL, 'Accident travail - hémorragie interne'),
(@HOPITAL_ID, 'O_NEGATIF', 1350, 'HAUTE', 'VALIDEE', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 HOUR, 'Bernard', 'Marie', @ADMIN_ID, 'Césarienne urgente - mère et enfant sauvés'),
(@HOPITAL_ID, 'A_NEGATIF', 900, 'CRITIQUE', 'REFUSEE', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY, 'Martin', 'Jean', NULL, 'Stock insuffisant - demande reportée'),
(@HOPITAL_ID, 'AB_NEGATIF', 450, 'HAUTE', 'EN_ATTENTE', NOW() - INTERVAL 2 DAY, NOW() + INTERVAL 6 HOUR, 'Richard', 'Lucas', NULL, 'Maladie rare - plasma spécialisé requis'),
(@HOPITAL_ID, 'O_POSITIF', 1800, 'NORMALE', 'EN_ATTENTE', NOW() - INTERVAL 2 DAY, NOW() + INTERVAL 3 DAY, 'Fournier', 'Laura', NULL, 'Opération programmée - stock de sécurité'),
(@HOPITAL_ID, 'A_POSITIF', 450, 'NORMALE', 'VALIDEE', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY, 'Girard', 'Nicolas', @ADMIN_ID, 'Transfusion réussie - patient stable'),
(@HOPITAL_ID, 'B_POSITIF', 1350, 'HAUTE', 'EN_ATTENTE', NOW() - INTERVAL 4 DAY, NOW() + INTERVAL 12 HOUR, 'Andre', 'Sarah', NULL, 'Leucémie - traitement intensif'),
(@HOPITAL_ID, 'AB_POSITIF', 900, 'NORMALE', 'EN_ATTENTE', NOW() - INTERVAL 5 DAY, NOW() + INTERVAL 1 WEEK, 'Mercier', 'Alexandre', NULL, 'Thalasémie - suivi régulier'),
(@HOPITAL_ID, 'O_NEGATIF', 450, 'CRITIQUE', 'VALIDEE', NOW() - INTERVAL 6 HOUR, NOW() - INTERVAL 30 MINUTE, 'Dupont', 'Chloe', @ADMIN_ID, 'Traumatisme crânien - neurochirurgie'),
(@HOPITAL_ID, 'A_POSITIF', 1350, 'HAUTE', 'EN_ATTENTE', NOW() - INTERVAL 3 HOUR, NOW() + INTERVAL 8 HOUR, 'Lambert', 'Maxime', NULL, 'Hémophilie - saignement persistant');


-- ============================================
-- 6. CREATE DONATIONS (40+ donations for chart data)
-- ============================================
INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 1 DAY, 450, 'POCH-001', NOW() + INTERVAL 41 DAY, @ADMIN_ID, NOW() - INTERVAL 1 DAY
FROM donneurs d WHERE d.cin = 'CIN001' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-001');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 3 DAY, 450, 'POCH-002', NOW() + INTERVAL 39 DAY, @ADMIN_ID, NOW() - INTERVAL 3 DAY
FROM donneurs d WHERE d.cin = 'CIN003' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-002');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 5 DAY, 450, 'POCH-003', NOW() + INTERVAL 37 DAY, @ADMIN_ID, NOW() - INTERVAL 5 DAY
FROM donneurs d WHERE d.cin = 'CIN005' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-003');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 7 DAY, 450, 'POCH-004', NOW() + INTERVAL 35 DAY, @ADMIN_ID, NOW() - INTERVAL 7 DAY
FROM donneurs d WHERE d.cin = 'CIN009' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-004');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 9 DAY, 450, 'POCH-005', NOW() + INTERVAL 33 DAY, @ADMIN_ID, NOW() - INTERVAL 9 DAY
FROM donneurs d WHERE d.cin = 'CIN010' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-005');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 11 DAY, 450, 'POCH-006', NOW() + INTERVAL 31 DAY, @ADMIN_ID, NOW() - INTERVAL 11 DAY
FROM donneurs d WHERE d.cin = 'CIN011' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-006');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 13 DAY, 450, 'POCH-007', NOW() + INTERVAL 29 DAY, @ADMIN_ID, NOW() - INTERVAL 13 DAY
FROM donneurs d WHERE d.cin = 'CIN012' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-007');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 14 DAY, 450, 'POCH-008', NOW() + INTERVAL 28 DAY, @ADMIN_ID, NOW() - INTERVAL 14 DAY
FROM donneurs d WHERE d.cin = 'CIN013' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-008');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 2 WEEK, 450, 'POCH-009', NOW() + INTERVAL 28 DAY, @ADMIN_ID, NOW() - INTERVAL 2 WEEK
FROM donneurs d WHERE d.cin = 'CIN014' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-009');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 16 DAY, 450, 'POCH-010', NOW() + INTERVAL 26 DAY, @ADMIN_ID, NOW() - INTERVAL 16 DAY
FROM donneurs d WHERE d.cin = 'CIN016' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-010');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 18 DAY, 450, 'POCH-011', NOW() + INTERVAL 24 DAY, @ADMIN_ID, NOW() - INTERVAL 18 DAY
FROM donneurs d WHERE d.cin = 'CIN017' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-011');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 20 DAY, 450, 'POCH-012', NOW() + INTERVAL 22 DAY, @ADMIN_ID, NOW() - INTERVAL 20 DAY
FROM donneurs d WHERE d.cin = 'CIN018' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-012');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 3 WEEK, 450, 'POCH-013', NOW() + INTERVAL 21 DAY, @ADMIN_ID, NOW() - INTERVAL 3 WEEK
FROM donneurs d WHERE d.cin = 'CIN019' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-013');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 22 DAY, 450, 'POCH-014', NOW() + INTERVAL 20 DAY, @ADMIN_ID, NOW() - INTERVAL 22 DAY
FROM donneurs d WHERE d.cin = 'CIN020' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-014');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 24 DAY, 450, 'POCH-015', NOW() + INTERVAL 18 DAY, @ADMIN_ID, NOW() - INTERVAL 24 DAY
FROM donneurs d WHERE d.cin = 'CIN021' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-015');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 26 DAY, 450, 'POCH-016', NOW() + INTERVAL 16 DAY, @ADMIN_ID, NOW() - INTERVAL 26 DAY
FROM donneurs d WHERE d.cin = 'CIN022' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-016');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 4 WEEK, 450, 'POCH-017', NOW() + INTERVAL 14 DAY, @ADMIN_ID, NOW() - INTERVAL 4 WEEK
FROM donneurs d WHERE d.cin = 'CIN025' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-017');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 30 DAY, 450, 'POCH-018', NOW() + INTERVAL 12 DAY, @ADMIN_ID, NOW() - INTERVAL 30 DAY
FROM donneurs d WHERE d.cin = 'CIN026' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-018');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 35 DAY, 450, 'POCH-019', NOW() + INTERVAL 7 DAY, @ADMIN_ID, NOW() - INTERVAL 35 DAY
FROM donneurs d WHERE d.cin = 'CIN027' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-019');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 38 DAY, 450, 'POCH-020', NOW() + INTERVAL 4 DAY, @ADMIN_ID, NOW() - INTERVAL 38 DAY
FROM donneurs d WHERE d.cin = 'CIN029' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-020');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 40 DAY, 450, 'POCH-021', NOW() + INTERVAL 2 DAY, @ADMIN_ID, NOW() - INTERVAL 40 DAY
FROM donneurs d WHERE d.cin = 'CIN030' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-021');

-- Older donations for monthly charts
INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 2 MONTH, 450, 'POCH-022', NOW() - INTERVAL 1 MONTH + INTERVAL 42 DAY, @ADMIN_ID, NOW() - INTERVAL 2 MONTH
FROM donneurs d WHERE d.cin = 'CIN001' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-022');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 2 MONTH + INTERVAL 5 DAY, 450, 'POCH-023', NOW() - INTERVAL 1 MONTH + INTERVAL 37 DAY, @ADMIN_ID, NOW() - INTERVAL 2 MONTH + INTERVAL 5 DAY
FROM donneurs d WHERE d.cin = 'CIN002' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-023');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 2 MONTH + INTERVAL 10 DAY, 450, 'POCH-024', NOW() - INTERVAL 1 MONTH + INTERVAL 32 DAY, @ADMIN_ID, NOW() - INTERVAL 2 MONTH + INTERVAL 10 DAY
FROM donneurs d WHERE d.cin = 'CIN003' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-024');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 3 MONTH, 450, 'POCH-025', NOW() - INTERVAL 2 MONTH + INTERVAL 42 DAY, @ADMIN_ID, NOW() - INTERVAL 3 MONTH
FROM donneurs d WHERE d.cin = 'CIN004' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-025');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche, date_peremption, valide_par_id, date_validation)
SELECT d.id, @HOPITAL_ID, 'VALIDE', NOW() - INTERVAL 3 MONTH + INTERVAL 7 DAY, 450, 'POCH-026', NOW() - INTERVAL 2 MONTH + INTERVAL 35 DAY, @ADMIN_ID, NOW() - INTERVAL 3 MONTH + INTERVAL 7 DAY
FROM donneurs d WHERE d.cin = 'CIN005' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-026');

-- Pending donations (awaiting validation)
INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche)
SELECT d.id, @HOPITAL_ID, 'EN_ATTENTE', NOW() - INTERVAL 2 HOUR, 450, 'POCH-PEND-001'
FROM donneurs d WHERE d.cin = 'CIN006' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-PEND-001');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche)
SELECT d.id, @HOPITAL_ID, 'EN_ATTENTE', NOW() - INTERVAL 4 HOUR, 450, 'POCH-PEND-002'
FROM donneurs d WHERE d.cin = 'CIN007' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-PEND-002');

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, numero_poche)
SELECT d.id, @HOPITAL_ID, 'EN_ATTENTE', NOW() - INTERVAL 6 HOUR, 450, 'POCH-PEND-003'
FROM donneurs d WHERE d.cin = 'CIN008' AND NOT EXISTS (SELECT 1 FROM dons WHERE numero_poche = 'POCH-PEND-003');

-- Scheduled donations (PROGRAMME)
INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, notes)
SELECT d.id, @HOPITAL_ID, 'PROGRAMME', NOW() + INTERVAL 2 DAY, 450, 'Don programmé - rappel envoyé'
FROM donneurs d WHERE d.cin = 'CIN023' AND NOT EXISTS (SELECT 1 FROM dons WHERE donneur_id = d.id AND statut = 'PROGRAMME' AND date_don > NOW());

INSERT INTO dons (donneur_id, hopital_id, statut, date_don, quantite_ml, notes)
SELECT d.id, @HOPITAL_ID, 'PROGRAMME', NOW() + INTERVAL 5 DAY, 450, 'Don programmé - confirmation requise'
FROM donneurs d WHERE d.cin = 'CIN024' AND NOT EXISTS (SELECT 1 FROM dons WHERE donneur_id = d.id AND statut = 'PROGRAMME' AND date_don > NOW());


-- ============================================
-- 7. CREATE BLOOD DONATION CAMPAIGNS (8 campaigns)
-- ============================================
INSERT IGNORE INTO campagnes (titre, description, date_debut, date_fin, lieu, objectif_poches, poches_collectees, hopital_id, etat, date_creation)
VALUES
('Grande collecte de printemps', 'Venez nombreux pour sauver des vies! Collecte organisée au centre commercial.', NOW() + INTERVAL 1 DAY, NOW() + INTERVAL 3 DAY, 'Centre Commercial Paris Nord', 100, 0, @HOPITAL_ID, 'PLANIFIEE', NOW()),
('Marathon du sang', '24h de don continu avec animations et rafraîchissements.', NOW() + INTERVAL 5 DAY, NOW() + INTERVAL 6 DAY, 'Stade de France', 200, 0, @HOPITAL_ID, 'PLANIFIEE', NOW()),
('Campagne urgente O-', 'Alerte rouge sur les stocks O négatif - votre sang est précieux.', NOW() - INTERVAL 1 DAY, NOW() + INTERVAL 7 DAY, 'Hôpital Principal - Hall A', 50, 12, @HOPITAL_ID, 'EN_COURS', NOW()),
('Don du sang entre collègues', 'Collecte interne pour les entreprises partenaires.', NOW() + INTERVAL 10 DAY, NOW() + INTERVAL 10 DAY, 'Tour Eiffel - Salle des fêtes', 75, 0, @HOPITAL_ID, 'PLANIFIEE', NOW()),
('Été solidaire', 'Collecte estivale - les besoins augmentent pendant les vacances.', NOW() + INTERVAL 14 DAY, NOW() + INTERVAL 16 DAY, 'Plage de Marseille', 150, 0, @HOPITAL_ID, 'PLANIFIEE', NOW()),
('Collecte universitaire', 'Campagne de sensibilisation dans les universités.', NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 2 DAY, 'Université Paris-Saclay', 80, 67, @HOPITAL_ID, 'TERMINEE', NOW()),
('Weekend du don', 'Collecte le samedi et dimanche pour plus d accessibilité.', NOW() + INTERVAL 21 DAY, NOW() + INTERVAL 22 DAY, 'Mairie de Lyon', 120, 0, @HOPITAL_ID, 'PLANIFIEE', NOW()),
('Urgence AB-', 'Appel aux donneurs AB négatif - stocks critiques.', NOW() - INTERVAL 3 DAY, NOW() + INTERVAL 4 DAY, 'CHU Principal - Bâtiment B', 25, 18, @HOPITAL_ID, 'EN_COURS', NOW());

-- ============================================
-- 8. CREATE CANDIDATURES (applications to demands)
-- ============================================
INSERT INTO candidatures_demande (demande_id, donneur_id, statut, date_candidature, date_traitement)
SELECT ds.id, d.id, 'EN_ATTENTE', NOW() - INTERVAL 30 MINUTE, NULL
FROM demandes_sang ds, donneurs d
WHERE ds.urgence = 'CRITIQUE' AND ds.statut = 'EN_ATTENTE' AND d.groupe_sanguin = ds.groupe_sanguin_demande
AND NOT EXISTS (SELECT 1 FROM candidatures_demande cd WHERE cd.demande_id = ds.id AND cd.donneur_id = d.id)
LIMIT 5;

INSERT INTO candidatures_demande (demande_id, donneur_id, statut, date_candidature, date_traitement)
SELECT ds.id, d.id, 'ACCEPTEE', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 DAY
FROM demandes_sang ds, donneurs d
WHERE ds.statut = 'VALIDEE' AND d.groupe_sanguin = ds.groupe_sanguin_demande
AND NOT EXISTS (SELECT 1 FROM candidatures_demande cd WHERE cd.demande_id = ds.id AND cd.donneur_id = d.id)
LIMIT 4;

INSERT INTO candidatures_demande (demande_id, donneur_id, statut, date_candidature, date_traitement)
SELECT ds.id, d.id, 'REFUSEE', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 2 DAY
FROM demandes_sang ds, donneurs d
WHERE ds.statut = 'REFUSEE' AND d.groupe_sanguin = ds.groupe_sanguin_demande
AND NOT EXISTS (SELECT 1 FROM candidatures_demande cd WHERE cd.demande_id = ds.id AND cd.donneur_id = d.id)
LIMIT 2;

-- ============================================
-- 9. CREATE NOTIFICATIONS (20+ notifications)
-- ============================================
INSERT INTO notifications (utilisateur_id, hopital_id, titre, message, type, priorite, date_creation, lue)
VALUES
-- Critical stock alerts for hospital
(@ADMIN_ID, @HOPITAL_ID, 'Alerte Stock Critique', 'Stock O- descendu sous seuil critique (12 poches restantes)', 'ALERTE', 'HAUTE', NOW() - INTERVAL 30 MINUTE, false),
(@ADMIN_ID, @HOPITAL_ID, 'Alerte Stock Critique', 'Stock AB- en état critique - demandes en attente', 'ALERTE', 'CRITIQUE', NOW() - INTERVAL 1 HOUR, false),
(@ADMIN_ID, @HOPITAL_ID, 'Alerte Stock Bas', 'Stock A- approche du seuil d alerte', 'ALERTE', 'NORMALE', NOW() - INTERVAL 2 HOUR, false),
-- New donations notifications
(@ADMIN_ID, @HOPITAL_ID, 'Nouveau don validé', 'Don de Jean Martin validé - 450ml O+ ajouté au stock', 'INFO', 'NORMALE', NOW() - INTERVAL 1 DAY, true),
(@ADMIN_ID, @HOPITAL_ID, 'Nouveau don validé', 'Don de Pierre Petit validé - 450ml B+ ajouté au stock', 'INFO', 'NORMALE', NOW() - INTERVAL 3 DAY, true),
(@ADMIN_ID, @HOPITAL_ID, 'Dons en attente', '3 dons sont en attente de validation', 'ALERTE', 'HAUTE', NOW() - INTERVAL 4 HOUR, false),
-- Demand notifications
(@ADMIN_ID, @HOPITAL_ID, 'Nouvelle demande urgente', 'Demande O- critique pour Alain Dubois', 'ALERTE', 'CRITIQUE', NOW() - INTERVAL 2 HOUR, false),
(@ADMIN_ID, @HOPITAL_ID, 'Demande validée', 'Demande A- validée et servie', 'INFO', 'NORMALE', NOW() - INTERVAL 8 HOUR, true),
(@ADMIN_ID, @HOPITAL_ID, 'Demande traitée', 'Demande O- urgente satisfaite', 'INFO', 'HAUTE', NOW() - INTERVAL 1 DAY, true),
-- Campaign notifications
(@ADMIN_ID, @HOPITAL_ID, 'Campagne terminée', 'Collecte universitaire: 67/80 poches collectées', 'INFO', 'NORMALE', NOW() - INTERVAL 2 DAY, true),
(@ADMIN_ID, @HOPITAL_ID, 'Campagne en cours', 'Campagne O-: 12/50 poches - objectif en retard', 'ALERTE', 'HAUTE', NOW() - INTERVAL 6 HOUR, false),
(@ADMIN_ID, @HOPITAL_ID, 'Rappel campagne', 'Marathon du sang dans 5 jours - préparatifs à vérifier', 'RAPPEL', 'NORMALE', NOW() - INTERVAL 12 HOUR, false),
-- System notifications
(@ADMIN_ID, @HOPITAL_ID, 'Poches à perimer', '5 poches O+ arrivent à expiration dans 7 jours', 'ALERTE', 'HAUTE', NOW() - INTERVAL 3 HOUR, false),
(@ADMIN_ID, @HOPITAL_ID, 'Maintenance système', 'Maintenance prévue ce soir à 20h - interruption de 30min', 'INFO', 'NORMALE', NOW() - INTERVAL 1 DAY, true),
(@ADMIN_ID, @HOPITAL_ID, 'Nouveau donneur', '3 nouveaux donneurs enregistrés cette semaine', 'INFO', 'BASSE', NOW() - INTERVAL 2 DAY, true),
(@ADMIN_ID, @HOPITAL_ID, 'Statistiques mensuelles', 'Rapport de juin disponible - +15% de dons vs mai', 'INFO', 'NORMALE', NOW() - INTERVAL 5 DAY, true),
(@ADMIN_ID, @HOPITAL_ID, 'Urgence non satisfaite', 'Demande AB- critique toujours en attente de donneurs', 'ALERTE', 'CRITIQUE', NOW() - INTERVAL 4 HOUR, false),
(@ADMIN_ID, @HOPITAL_ID, 'Don programmé', 'Rappel: 2 dons programmés demain', 'RAPPEL', 'NORMALE', NOW() - INTERVAL 10 HOUR, false),
(@ADMIN_ID, @HOPITAL_ID, 'Transfert de stock', 'Demande de transfert O- reçue de l hôpital de Lyon', 'INFO', 'HAUTE', NOW() - INTERVAL 6 HOUR, false);

-- ============================================
-- 10. CREATE BADGES (gamification)
-- ============================================
-- Insert badges for donors based on their donation count
INSERT INTO badges (donneur_id, type_badge, nom, description, date_attribution, icone)
SELECT d.id, 'PREMIER_DON', 'Premier Pas', 'Vous avez fait votre premier don de sang', d.dernier_don_valide, 'award'
FROM donneurs d WHERE d.nombre_dons_total >= 1 AND NOT EXISTS (SELECT 1 FROM badges b WHERE b.donneur_id = d.id AND b.type_badge = 'PREMIER_DON');

INSERT INTO badges (donneur_id, type_badge, nom, description, date_attribution, icone)
SELECT d.id, 'DONNEUR_REGULIER', 'Donneur Régulier', '3 dons validés - Merci pour votre régularité', d.dernier_don_valide, 'star'
FROM donneurs d WHERE d.nombre_dons_total >= 3 AND NOT EXISTS (SELECT 1 FROM badges b WHERE b.donneur_id = d.id AND b.type_badge = 'DONNEUR_REGULIER');

INSERT INTO badges (donneur_id, type_badge, nom, description, date_attribution, icone)
SELECT d.id, 'DONNEUR_EXPERIMENTE', 'Donneur Expérimenté', '5 dons validés - Vous sauvez des vies', d.dernier_don_valide, 'shield'
FROM donneurs d WHERE d.nombre_dons_total >= 5 AND NOT EXISTS (SELECT 1 FROM badges b WHERE b.donneur_id = d.id AND b.type_badge = 'DONNEUR_EXPERIMENTE');

INSERT INTO badges (donneur_id, type_badge, nom, description, date_attribution, icone)
SELECT d.id, 'HEROS_DU_SANG', 'Héros du Sang', '10 dons validés - Vous êtes un héros!', d.dernier_don_valide, 'trophy'
FROM donneurs d WHERE d.nombre_dons_total >= 10 AND NOT EXISTS (SELECT 1 FROM badges b WHERE b.donneur_id = d.id AND b.type_badge = 'HEROS_DU_SANG');

INSERT INTO badges (donneur_id, type_badge, nom, description, date_attribution, icone)
SELECT d.id, 'SAUVEUR_URGENCE', 'Sauveur d Urgence', 'Vous avez répondu à une demande critique', d.dernier_don_valide, 'heart-pulse'
FROM donneurs d WHERE d.nombre_dons_total >= 1 AND NOT EXISTS (SELECT 1 FROM badges b WHERE b.donneur_id = d.id AND b.type_badge = 'SAUVEUR_URGENCE');

-- ============================================
-- 11. CAMPAIGN REGISTRATIONS (inscriptions)
-- ============================================
INSERT INTO inscriptions_campagne (campagne_id, donneur_id, statut, date_inscription, notes)
SELECT c.id, d.id, 'CONFIRME', NOW() - INTERVAL 2 DAY, 'Inscription confirmée'
FROM campagnes c, donneurs d
WHERE c.etat IN ('PLANIFIEE', 'EN_COURS') AND d.nombre_dons_total > 0
AND NOT EXISTS (SELECT 1 FROM inscriptions_campagne i WHERE i.campagne_id = c.id AND i.donneur_id = d.id)
LIMIT 25;

-- ============================================
-- 12. POINTS TRANSACTIONS (gamification history)
-- ============================================
INSERT INTO points_transactions (donneur_id, points, type_transaction, description, date_transaction)
SELECT d.id, 10, 'DON', 'Points gagnés pour don validé', d.dernier_don_valide
FROM donneurs d WHERE d.nombre_dons_total > 0 AND d.dernier_don_valide IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM points_transactions pt WHERE pt.donneur_id = d.id LIMIT 1)
LIMIT 20;

INSERT INTO points_transactions (donneur_id, points, type_transaction, description, date_transaction)
SELECT d.id, 50, 'BONUS_FIDELITE', 'Bonus de fidélité - 5 dons atteints', d.dernier_don_valide
FROM donneurs d WHERE d.nombre_dons_total >= 5 AND NOT EXISTS (SELECT 1 FROM points_transactions pt WHERE pt.donneur_id = d.id AND pt.type_transaction = 'BONUS_FIDELITE')
LIMIT 5;

INSERT INTO points_transactions (donneur_id, points, type_transaction, description, date_transaction)
SELECT d.id, 100, 'BONUS_ANNIVERSAIRE', 'Bonus anniversaire de don', d.date_naissance
FROM donneurs d WHERE MONTH(d.date_naissance) = MONTH(NOW()) AND NOT EXISTS (SELECT 1 FROM points_transactions pt WHERE pt.donneur_id = d.id AND pt.type_transaction = 'BONUS_ANNIVERSAIRE')
LIMIT 3;

-- ============================================
-- END OF SCRIPT
-- ============================================
SELECT 'Test data initialization complete for Hospital ID ' AS message, @HOPITAL_ID AS hospital_id;
