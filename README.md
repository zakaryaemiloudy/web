# 🏥 Système de Gestion Banque de Sang

Plateforme complète de gestion de banque de sang qui connecte patients, hôpitaux, donneurs et administrateurs pour optimiser les processus de don et distribution de sang.

## 🩸 À Propos de Cette Application

Le Système de Gestion Banque de Sang est une application web complète conçue pour :
- **Gérer les dons de sang** et l'inventaire dans plusieurs hôpitaux
- **Connecter les patients** avec les banques de sang pour leurs besoins urgents
- **Coordonner les demandes de sang** entre patients et hôpitaux
- **Suivre les informations des donneurs** et l'historique des dons
- **Fournir des analytics en temps réel** et rapports pour les administrateurs
- **Offrir une assistance IA** via un chatbot intelligent

## 🎯 Fonctionnalités Clés

### 👤 Portail Patient
- **Gestion des Demandes de Sang**: Soumettre et suivre les demandes de don de sang
- **Sélection d'Hôpital**: Choisir parmi les hôpitaux enregistrés
- **Suivi du Statut des Demandes**: Surveiller l'avancement des demandes en temps réel
- **Demandes d'Urgence**: Traitement prioritaire pour les besoins médicaux urgents
- **Historique des Dons**: Voir les demandes passées et leurs résultats

### 🏥 Gestion Hospitalière
- **Traitement des Demandes**: Examiner et approuver/rejeter les demandes de sang
- **Gestion des Stocks**: Surveiller les niveaux d'inventaire de sang par type
- **Alertes Critiques**: Être notifié lorsque les stocks de sang sont bas
- **Gestion de Profil**: Mettre à jour les informations hospitalières et coordonnées
- **Analytics des Demandes**: Suivre les tendances des demandes et distribution des groupes sanguins

### 🩸 Système Donneur
- **Inscription Donneur**: Création complète de profil donneur
- **Vérification d'Éligibilité**: Dépistage automatisé basé sur critères médicaux
- **Historique des Dons**: Suivre tous les dons et leur impact
- **Planification de Rendez-vous**: Réserver des créneaux de don aux emplacements préférés
- **Suivi d'Impact**: Voir comment les dons ont aidé les patients

### 📊 Tableau de Bord Admin
- **Analytics Système**: Statistiques et insights complets
- **Gestion des Utilisateurs**: Gérer tous les rôles et permissions utilisateurs
- **Supervision Hospitalière**: Surveiller tous les hôpitaux enregistrés
- **Gestion de Campagnes**: Créer et gérer les campagnes de don
- **Coordination d'Urgence**: Gérer les situations critiques de pénurie de sang

### 🤖 Assistant Chatbot IA
- **Support 24/7**: Assistant intelligent pour les questions courantes
- **Informations sur Groupes Sanguins**: Contenu éducatif sur les groupes sanguins et compatibilité
- **Guide de Don**: Assistance étape par étape du processus de don
- **Informations d'Urgence**: Contacts et procédures critiques
- **Support Multilingue**: Accessible en plusieurs langues

## 🏗️ Architecture Système

### Frontend (Angular 17+)
- **Framework**: Angular 17 avec composants standalone
- **Bibliothèque UI**: Tailwind CSS avec icônes Material Design
- **Gestion d'État**: Signaux Angular pour état réactif
- **Routing**: Contrôle d'accès par rôle avec guards
- **Formulaires**: Formulaires réactifs avec validation complète
- **Client HTTP**: Intégration API RESTful

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x avec Java 17
- **Base de Données**: MySQL avec ORM JPA/Hibernate
- **Sécurité**: Spring Security avec authentification JWT
- **Documentation API**: Intégration OpenAPI/Swagger
- **Validation**: Validation complète des entrées et gestion d'erreurs

### Schéma Base de Données
- **Utilisateurs**: Comptes patient, donneur, hôpital et admin
- **Demandes de Sang**: Suivi des demandes de sang des patients
- **Dons**: Enregistrements des dons de sang des donneurs
- **Inventaire**: Gestion des stocks de sang hospitaliers
- **Hôpitaux**: Établissements médicaux enregistrés
- **Campagnes**: Campagnes et événements de don de sang

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** 18+ et npm/yarn
- **Java** 17+ et Maven
- **MySQL** 8.0+
- **Git** pour contrôle de version

### Installation

#### 1. Cloner le Dépôt
```bash
git clone <url-dépôt>
cd blood-bank-system
```

#### 2. Configuration Backend (Spring Boot)
```bash
cd Bks

# Configurer la Base de Données
# Mettre à jour src/main/resources/application.properties avec vos identifiants MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/blood_bank
spring.datasource.username=votre_nom_utilisateur
spring.datasource.password=votre_mot_de_passe

# Installer Dépendances et Exécuter
mvn clean install
mvn spring-boot:run
```

Le backend sera disponible à: `http://localhost:8080`

#### 3. Configuration Frontend (Angular)
```bash
cd blood-bank-frontend

# Installer Dépendances
npm install

# Démarrer Serveur de Développement
npm start
```

Le frontend sera disponible à: `http://localhost:4200`

#### 4. Configuration Base de Données
```sql
# Créer Base de Données MySQL
CREATE DATABASE blood_bank;

# Exécuter Scripts de Migration (si disponibles)
# Localisé dans: Bks/src/main/resources/db/migration/
```

## 📱 Points d'Accès

### URLs Application
- **Application Frontend**: http://localhost:4200
- **API Backend**: http://localhost:8080/api
- **Documentation API**: http://localhost:8080/swagger-ui.html

### Identifiants de Connexion par Défaut
```
Utilisateur Admin:
- Email: admin@bloodbank.com
- Mot de passe: admin123

Utilisateur Hôpital:
- Email: hospital@bloodbank.com  
- Mot de passe: hospital123

Utilisateur Patient:
- Email: patient@bloodbank.com
- Mot de passe: patient123
```

## 🎮 Comment Utiliser l'Application

### Pour les Patients
1. **S'inscrire/Se connecter**: Créer un compte ou se connecter
2. **Soumettre Demande**: Naviguer vers "Demandes" → "Nouvelle demande"
3. **Remplir Formulaire**: Compléter les détails de la demande de sang
4. **Sélectionner Hôpital**: Choisir l'hôpital préféré dans la liste déroulante
5. **Suivre Statut**: Surveiller l'avancement de la demande dans le tableau de bord

### Pour le Personnel Hospitalier
1. **Connexion**: Accéder au portail hospitalier avec identifiants
2. **Voir Demandes**: Naviguer vers "Demandes de sang"
3. **Traiter Demandes**: Examiner, approuver ou rejeter les demandes
4. **Gérer Stocks**: Vérifier les niveaux d'inventaire dans "Stocks"
5. **Mettre à Jour Profil**: Éditer les informations hospitalières dans "Profil"

### Pour les Administrateurs
1. **Accès Tableau de Bord**: Voir aperçu système et statistiques
2. **Gestion Utilisateurs**: Gérer tous les comptes et rôles utilisateurs
3. **Supervision Hospitalière**: Surveiller les activités hospitalières
4. **Création Campagnes**: Lancer des campagnes de don
5. **Réponse d'Urgence**: Gérer les situations critiques

### Utilisation Chatbot IA
1. **Accès**: Cliquer sur l'icône chatbot ou naviguer vers `/chatbot`
2. **Poser Questions**: Taper des requêtes sur le don de sang, hôpitaux, etc.
3. **Actions Rapides**: Utiliser les boutons prédéfinis pour les questions courantes
4. **Obtenir de l'Aide**: Recevoir une assistance instantanée 24/7

## 🔧 Guide de Développement

### Structure Projet
```
blood-bank-system/
├── Bks/                          # Backend Spring Boot
│   ├── src/main/java/com/bks/    # Code source Java
│   ├── src/main/resources/       # Fichiers configuration
│   └── pom.xml                   # Dépendances Maven
├── blood-bank-frontend/          # Frontend Angular
│   ├── src/app/                  # Code application Angular
│   ├── src/assets/               # Assets statiques
│   ├── package.json              # Dépendances Node
│   └── angular.json              # Configuration Angular
├── .gitignore                    # Fichier Git ignore
└── README.md                     # Cette documentation
```

### Développement Frontend
```bash
# Installer nouvelles dépendances
npm install <nom-package>

# Exécuter tests
ng test

# Construire pour production
ng build

# Générer nouveau composant
ng generate component nom-composant
```

### Développement Backend
```bash
# Compiler et exécuter tests
mvn test

# Packager application
mvn package

# Exécuter avec profil spécifique
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Points d'Accès API
- **Authentification**: `/api/auth/*`
- **Opérations Patient**: `/api/patient/*`
- **Opérations Hôpital**: `/api/hospital/*`
- **Opérations Admin**: `/api/admin/*`
- **Demandes de Sang**: `/api/demandes/*`
- **Dons**: `/api/dons/*`

## 🛡️ Fonctionnalités de Sécurité

### Authentification & Autorisation
- **Tokens JWT**: Authentification sécurisée par token
- **Accès par Rôle**: Permissions différentes pour chaque type d'utilisateur
- **Chiffrement Mot de Passe**: Hachage Bcrypt pour sécurité des mots de passe
- **Gestion Session**: Gestion sécurisée des sessions

### Protection des Données
- **Validation des Entrées**: Validation complète sur toutes les entrées
- **Prévention Injection SQL**: Requêtes paramétrées
- **Protection XSS**: Encodage des sorties et en-têtes CSP
- **Configuration CORS**: Partage approprié des ressources cross-origin

## 📊 Aperçu Fonctionnalités Système

### Compatibilité Groupes Sanguins
- **Donneurs Universels**: O- (peut donner à tous les types)
- **Receveurs Universels**: AB+ (peut recevoir de tous les types)
- **Correspondance des Types**: Vérification automatique de compatibilité
- **Protocoles d'Urgence**: Traitement spécial pour les situations critiques

### Workflow des Demandes
1. **Soumission Patient** → **Examen Hôpital** → **Mise à Jour Statut** → **Notification Donneur** → **Exécution**
2. **Mises à Jour Temps Réel**: Changements de statut communiqués instantanément
3. **Traitement Prioritaire**: Demandes d'urgence traitées en premier
4 **Contrôle Qualité**: Toutes les demandes validées avant traitement

### Gestion d'Inventaire
- **Suivi Temps Réel**: Surveillance continue des niveaux de stock
- **Alertes Critiques**: Notifications automatiques pour stocks bas
- **Suivi d'Expiration**: Surveiller les dates d'expiration des produits sanguins
- **Planification Distribution**: Optimiser l'allocation du sang

## 🤝 Directives de Contribution

### Standards de Code
- **Frontend**: Suivre le guide de style Angular et meilleures pratiques TypeScript
- **Backend**: Suivre les conventions de codage Java et patterns Spring Boot
- **Documentation**: Mettre à jour README et commentaires de code pour nouvelles fonctionnalités
- **Tests**: Écrire des tests unitaires pour toute nouvelle fonctionnalité

### Workflow Git
1. **Créer Branche de Fonctionnalité**: `git checkout -b feature/nom-fonctionnalité`
2. **Apporter Modifications**: Implémenter votre fonctionnalité avec tests appropriés
3. **Valider Modifications**: `git commit -m "feat: ajouter nouvelle fonctionnalité"`
4. **Pousser Branche**: `git push origin feature/nom-fonctionnalité`
5. **Créer Pull Request**: Soumettre pour revue de code

## 🐛 Dépannage

### Problèmes Communs

#### Problèmes Backend
- **Connexion Base de Données**: Vérifier identifiants MySQL et existence base de données
- **Conflits de Ports**: S'assurer que le port 8080 est disponible
- **Version Java**: Confirmer que Java 17+ est installé

#### Problèmes Frontend
- **Version Node**: S'assurer que Node.js 18+ est installé
- **Conflits de Ports**: Vérifier si le port 4200 est disponible
- **Problèmes de Dépendances**: Exécuter `npm install` pour rafraîchir les dépendances

#### Problèmes Base de Données
- **Échecs de Migration**: Vérifier la syntaxe SQL et permissions
- **Timeouts de Connexion**: Vérifier que le serveur de base de données fonctionne
- **Erreurs de Permission**: S'assurer que l'utilisateur de base de données a les privilèges appropriés

### Obtenir de l'Aide
1. **Vérifier Logs**: Examiner les logs d'application pour détails d'erreur
2. **Documentation**: Référer à la documentation API à `/swagger-ui.html`
3. **Communauté**: Poster des issues dans les discussions du dépôt projet
4. **Support**: Contacter l'équipe de développement pour les problèmes critiques

## 📈 Améliorations Futures

### Fonctionnalités Planifiées
- **Application Mobile**: Applications natives iOS et Android
- **Localisateur Banque de Sang**: Recherche GPS de banques de sang à proximité
- **Correspondance Donneur**: Système de correspondance donneur-patient par IA
- **Notifications Temps Réel**: Alertes SMS et email
- **Intégration Blockchain**: Sécurité et transparence améliorées
- **Machine Learning**: Analytics prédictifs pour prévision de la demande

### Améliorations Techniques
- **Architecture Microservices**: Diviser en services plus petits et focalisés
- **Conteneurisation Docker**: Déploiement et scalabilité simplifiés
- **Intégration Cloud**: Options de déploiement AWS/Azure
- **Optimisation Performance**: Mise en cache et optimisation base de données
- **Analytics Avancés**: Business intelligence et rapports

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour détails.

---

**Merci d'utiliser le Système de Gestion Banque de Sang! Ensemble, nous sauvons des vies grâce à la technologie et l'innovation.** 🩸❤️
