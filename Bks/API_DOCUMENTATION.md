# Blood Bank System (BKS) - Documentation API

## Configuration
- **Base URL**: `http://localhost:8080/api`
- **Port**: 8080
- **Authentication**: JWT Bearer Token

---

## Comment Tester

### 1. Importer dans Postman
1. Ouvrir Postman
2. Cliquer sur **Import**
3. Selectionner le fichier `Blood_Bank_System_Postman_Collection.json`
4. La collection sera importee avec toutes les requetes

### 2. Configuration importante dans Postman
**Pour les endpoints d'authentification (inscription/connexion):**
- Pas besoin d'Authorization header
- Content-Type: application/json

**Pour tous les autres endpoints (protected):**
- Authorization header: `Bearer <votre_token>`
- ⚠️ **IMPORTANT**: Il doit y avoir un ESPACE entre "Bearer" et le token
- Exemple: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjE...`

### 3. Ordre de Test Recommande

#### Etape 1: Inscription Super Admin (PAS D'AUTH REQUISE)
```
POST http://localhost:8080/api/auth/inscription
Content-Type: application/json

{
    "email": "superadmin@bks.com",
    "motDePasse": "admin123",
    "nom": "Admin",
    "prenom": "Super",
    "telephone": "0600000000",
    "role": "SUPER_ADMIN"
}
```
**Reponse**: Copier le `token` de la reponse

#### Etape 2: Utiliser le token pour les autres requetes
Ajouter dans Headers:
```
Authorization: Bearer <token_copie>
```

#### Etape 3: Creer un hopital (AUTH REQUISE - Super Admin)
```
POST http://localhost:8080/api/superadmin/hopitaux
Authorization: Bearer <token>
Content-Type: application/json
```

#### Etape 4: Valider l'hopital
```
PUT http://localhost:8080/api/superadmin/hopitaux/1/valider
Authorization: Bearer <token>
```

#### Etape 5: Inscription Admin Hopital (PAS D'AUTH REQUISE)
```
POST http://localhost:8080/api/auth/inscription
Content-Type: application/json

{
    "email": "admin@hopital.com",
    "motDePasse": "admin123",
    "nom": "Admin",
    "prenom": "Hopital",
    "telephone": "0611111111",
    "role": "ADMIN",
    "hopitalId": 1
}
```

#### Etape 6: Inscription Donneur (PAS D'AUTH REQUISE)
```
POST http://localhost:8080/api/auth/inscription
Content-Type: application/json

{
    "email": "donneur@test.com",
    "motDePasse": "donneur123",
    "nom": "Martin",
    "prenom": "Pierre",
    "telephone": "0622222222",
    "role": "USER"
}
```

### 4. Depannage - Erreur 403 Forbidden
Si vous recevez une erreur 403:

1. **Verifiez le format du header Authorization:**
   - ✅ Correct: `Bearer eyJhbGciOiJIUzI1NiJ9...`
   - ❌ Incorrect: `BearereyJhbGciOiJIUzI1NiJ9...` (pas d'espace)
   - ❌ Incorrect: `bearer eyJhbGciOiJIUzI1NiJ9...` (minuscule)

2. **Verifiez que le token n'est pas expire** (valide 24h)

3. **Verifiez que vous utilisez le bon role:**
   - `/api/superadmin/**` -> Requiert SUPER_ADMIN
   - `/api/admin/**` -> Requiert ADMIN ou SUPER_ADMIN
   - `/api/donneur/**` -> Requiert USER, ADMIN ou SUPER_ADMIN
   - `/api/patient/**` -> Requiert USER, ADMIN ou SUPER_ADMIN

4. **Pour les endpoints d'auth**, NE PAS envoyer d'Authorization header

---

## Endpoints API

### 1. AUTHENTIFICATION `/api/auth`

| Methode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/inscription` | Creer un compte | Non |
| POST | `/connexion` | Se connecter | Non |
| GET | `/valider-token` | Verifier token | Oui |

#### Inscription - Body
```json
{
    "email": "user@example.com",
    "motDePasse": "password123",
    "nom": "Dupont",
    "prenom": "Jean",
    "telephone": "0612345678",
    "role": "USER|ADMIN|SUPER_ADMIN",
    "hopitalId": 1  // Requis pour ADMIN
}
```

#### Connexion - Body
```json
{
    "email": "user@example.com",
    "motDePasse": "password123"
}
```

---

### 2. SUPER ADMIN `/api/superadmin`
*Requiert: Role SUPER_ADMIN*

| Methode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/hopitaux` | Creer un hopital |
| GET | `/hopitaux` | Liste des hopitaux |
| GET | `/hopitaux/en-attente` | Hopitaux en attente |
| PUT | `/hopitaux/{id}/valider` | Valider un hopital |
| PUT | `/hopitaux/{id}/suspendre` | Suspendre un hopital |
| GET | `/stats` | Statistiques globales |
| GET | `/dashboard` | Dashboard complet |
| POST | `/notifications/globale` | Envoyer notification globale |
| POST | `/campagnes` | Creer campagne nationale |
| GET | `/campagnes/nationales` | Liste campagnes nationales |

#### Creer Hopital - Body
```json
{
    "nom": "CHU Mohammed VI",
    "adresse": "Avenue Hassan II",
    "ville": "Casablanca",
    "region": "Casablanca-Settat",
    "telephone": "0522123456",
    "email": "contact@chu.ma",
    "capaciteStockage": 5000,
    "description": "Centre Hospitalier"
}
```

---

### 3. ADMIN HOPITAL `/api/admin`
*Requiert: Role ADMIN ou SUPER_ADMIN*

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/dashboard` | Dashboard admin |
| GET | `/dons` | Liste des dons |
| PUT | `/dons/{id}/valider` | Valider un don |
| PUT | `/dons/{id}/rejeter` | Rejeter un don |
| GET | `/demandes` | Liste des demandes |
| GET | `/demandes/urgentes` | Demandes urgentes |
| PUT | `/demandes/{id}/traiter?statut=X` | Traiter demande |
| GET | `/stocks` | Stocks de sang |
| GET | `/stocks/critiques` | Stocks critiques |
| GET | `/donneurs` | Liste donneurs eligibles |
| GET | `/donneurs/top` | Top 10 donneurs |
| POST | `/campagnes` | Creer campagne locale |
| GET | `/campagnes/actives` | Campagnes actives |

#### Statuts Demande
- `EN_ATTENTE`
- `EN_COURS`
- `SATISFAITE`
- `ANNULEE`
- `REJETEE`

---

### 4. DONNEUR `/api/donneur`
*Requiert: Role USER, ADMIN ou SUPER_ADMIN*

| Methode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/profil` | Creer profil donneur |
| GET | `/profil` | Mon profil |
| POST | `/dons` | Declarer un don |
| GET | `/dons/historique` | Historique des dons |
| GET | `/badges` | Mes badges |
| GET | `/points` | Mes points |
| GET | `/classement` | Classement donneurs |
| GET | `/campagnes` | Campagnes disponibles |
| POST | `/campagnes/{id}/participer` | Participer a campagne |

#### Creer Profil Donneur - Body
```json
{
    "cin": "AB123456",
    "dateNaissance": "1990-05-15",
    "sexe": "HOMME|FEMME",
    "groupeSanguin": "O_POSITIF",
    "poids": 75.0,
    "adresse": "123 Rue Example",
    "ville": "Casablanca",
    "antecedentsMedicaux": "Aucun"
}
```

#### Declarer Don - Body
```json
{
    "hopitalId": 1,
    "quantiteMl": 450,
    "notes": "Don volontaire"
}
```

#### Groupes Sanguins
- `A_POSITIF`, `A_NEGATIF`
- `B_POSITIF`, `B_NEGATIF`
- `AB_POSITIF`, `AB_NEGATIF`
- `O_POSITIF`, `O_NEGATIF`

---

### 5. PATIENT `/api/patient`
*Requiert: Authentification*

| Methode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/demandes` | Creer demande de sang |
| GET | `/demandes` | Mes demandes |
| GET | `/demandes/{id}` | Details demande |
| GET | `/stocks/{hopitalId}` | Consulter stocks |

#### Creer Demande - Body
```json
{
    "groupeSanguinDemande": "O_POSITIF",
    "quantiteDemandee": 500,
    "hopitalId": 1,
    "urgence": "NORMALE|HAUTE|CRITIQUE",
    "nomPatient": "Alami",
    "prenomPatient": "Mohammed",
    "diagnostic": "Operation chirurgicale",
    "medecinPrescripteur": "Dr. Benani",
    "dateBesoin": "2024-05-20T10:00:00",
    "notes": "Notes optionnelles"
}
```

---

### 6. NOTIFICATIONS `/api/notifications`
*Requiert: Authentification*

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Mes notifications |
| GET | `/non-lues` | Notifications non lues |
| GET | `/count` | Nombre non lues |
| PUT | `/{id}/lire` | Marquer comme lue |
| PUT | `/tout-lire` | Tout marquer lu |

---

## Enumerations

### Roles
| Valeur | Description |
|--------|-------------|
| `USER` | Donneur/Patient |
| `ADMIN` | Admin Hopital |
| `SUPER_ADMIN` | Super Administrateur |

### Groupes Sanguins
| Valeur | Description |
|--------|-------------|
| `A_POSITIF` | A+ |
| `A_NEGATIF` | A- |
| `B_POSITIF` | B+ |
| `B_NEGATIF` | B- |
| `AB_POSITIF` | AB+ |
| `AB_NEGATIF` | AB- |
| `O_POSITIF` | O+ |
| `O_NEGATIF` | O- |

### Urgence
| Valeur | Description |
|--------|-------------|
| `NORMALE` | Urgence normale |
| `HAUTE` | Urgence haute |
| `CRITIQUE` | Urgence critique |

### Statut Don
| Valeur | Description |
|--------|-------------|
| `EN_ATTENTE` | En attente de validation |
| `VALIDE` | Don valide |
| `REJETE` | Don rejete |
| `UTILISE` | Sang utilise |
| `PERIME` | Sang perime |

### Statut Hopital
| Valeur | Description |
|--------|-------------|
| `EN_ATTENTE` | En attente de validation |
| `VALIDE` | Hopital actif |
| `SUSPENDU` | Hopital suspendu |
| `REJETE` | Hopital rejete |

### Type Notification
| Valeur | Description |
|--------|-------------|
| `INFO` | Information |
| `ALERTE` | Alerte |
| `URGENCE` | Urgence |
| `SUCCES` | Succes |
| `RAPPEL` | Rappel |
| `SYSTEME` | Systeme |

### Priorite Notification
| Valeur | Description |
|--------|-------------|
| `BASSE` | Priorite basse |
| `NORMALE` | Priorite normale |
| `HAUTE` | Priorite haute |
| `CRITIQUE` | Priorite critique |

---

## Codes de Reponse HTTP

| Code | Description |
|------|-------------|
| 200 | Succes |
| 201 | Cree avec succes |
| 400 | Requete invalide |
| 401 | Non authentifie |
| 403 | Acces interdit |
| 404 | Ressource non trouvee |
| 500 | Erreur serveur |

---

## Exemple Headers

```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Notes Importantes

1. **Token JWT**: Le token expire apres 24h (configurable)
2. **Validation**: Tous les champs marques `@NotNull` ou `@NotBlank` sont obligatoires
3. **Telephone**: Format 10 chiffres (ex: 0612345678)
4. **Dates**: Format ISO 8601 (ex: 2024-05-15T10:00:00)
5. **Poids minimum**: 50 kg pour etre eligible au don
