// ENUMS
export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'HOSPITAL';
export type Sexe = 'HOMME' | 'FEMME';
export type GroupeSanguin =
  | 'A_POSITIF'
  | 'A_NEGATIF'
  | 'B_POSITIF'
  | 'B_NEGATIF'
  | 'AB_POSITIF'
  | 'AB_NEGATIF'
  | 'O_POSITIF'
  | 'O_NEGATIF';
export type Urgence = 'BASSE' | 'NORMALE' | 'HAUTE' | 'CRITIQUE';
export type StatutDon =
  | 'EN_ATTENTE'
  | 'VALIDE'
  | 'REJETE'
  | 'UTILISE'
  | 'PERIME';
export type StatutDemande =
  | 'EN_ATTENTE'
  | 'EN_COURS'
  | 'SATISFAITE'
  | 'ANNULEE'
  | 'REJETEE';
export type StatutCampagne = 'PLANIFIEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEA';
export type StatutHopital = 'EN_ATTENTE' | 'VALIDE' | 'SUSPENDU' | 'REJETE';
export type StatutCandidature = 'EN_ATTENTE' | 'ACCEPTEE' | 'REJETEE';
export type NiveauBadge = 'BRONZE' | 'ARGENT' | 'OR' | 'PLATINE' | 'DIAMANT' | 'HERO' | 'LEGENDE' | 'CHAMPION';
export type TypeNotification =
  | 'INFO'
  | 'ALERTE'
  | 'URGENCE'
  | 'SUCCES'
  | 'RAPPEL'
  | 'SYSTEME'
  | 'DON'
  | 'DEMANDE'
  | 'ALERTES_STOCK'
  | 'CAMPAGNE';
export type PrioriteNotification = 'BASSE' | 'NORMALE' | 'HAUTE' | 'CRITIQUE';
export type NiveauStock = 'CRITIQUE' | 'ALERTE' | 'NORMAL' | 'OPTIMAL';

export interface RoleToggleRequest {
  isDonneurActif: boolean;
  isPatientActif: boolean;
}

export interface HopitalResponse {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  region: string;
  telephone: string;
  email: string;
  statut: string;
  capaciteStockage: number;
  stockActuel: number;
  certifie: boolean;
  scorePerformance: number;
  description: string;
}

// REQUESTS
export interface InscriptionRequest {
  email: string;
  motDePasse: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: Role;
  hopitalId?: number;
}

export interface ConnexionRequest {
  email: string;
  motDePasse: string;
}

export interface DonRequest {
  hopitalId?: number;
  campagneId?: number;
  quantiteMl: number;
  dateDon?: string;
  notes?: string;
}

export interface DemandeSangRequest {
  groupeSanguinDemande: GroupeSanguin;
  quantiteDemandee: number;
  hopitalId: number;
  urgence: Urgence;
  nomPatient: string;
  prenomPatient: string;
  diagnostic: string;
  medecinPrescripteur?: string;
  dateBesoin?: string;
  notes?: string;
}

export interface HopitalRequest {
  nom: string;
  adresse: string;
  ville: string;
  region: string;
  telephone: string;
  email: string;
  capaciteStockage: number;
  description?: string;
}

export interface NotificationRequest {
  titre: string;
  message: string;
  type: TypeNotification;
  priorite: PrioriteNotification;
  destinataireId?: number;
  hopitalId?: number;
  roleCible?: Role;
  globale?: boolean;
  dateExpiration?: string;
  lienAction?: string;
}

export interface CampagneRequest {
  titre: string;
  description?: string;
  hopitalId?: number;
  ville: string;
  region: string;
  dateDebut: string;
  dateFin: string;
  objectifDonneurs: number;
  groupeSanguinCible?: GroupeSanguin;
  nationale: boolean;
  lieuCollecte?: string;
  contactInfo?: string;
  imageUrl?: string;
}

export interface DonneurProfileRequest {
  cin: string;
  dateNaissance: string;
  sexe: Sexe;
  groupeSanguin: GroupeSanguin;
  poids: number;
  adresse: string;
  ville: string;
  antecedentsMedicaux?: string;
  notes?: string;
}

export interface ChatMessageRequest {
  message: string;
  sessionId?: string;
}

// RESPONSES
export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
  hopitalId?: number;
  hopitalNom?: string;
  actif: boolean;
  pointsTotal?: number;
  isDonneurActif?: boolean;
  isPatientActif?: boolean;
}

export interface UtilisateurResponse {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: Role;
  hopitalId?: number;
  hopitalNom?: string;
  actif: boolean;
  dateCreation: string;
  derniereConnexion?: string;
  pointsTotal: number;
}

export interface DonneurResponse {
  id: number;
  utilisateurId: number;
  nom: string;
  prenom: string;
  email: string;
  cin: string;
  dateNaissance: string;
  groupeSanguin: GroupeSanguin;
  sexe: Sexe;
  adresse: string;
  ville: string;
  telephone: string;
  eligible: boolean;
  dateDernierDon?: string;
  nombreDonsTotal: number;
  dateProchaineEligibilite?: string;
  pointsTotal: number;
  badges: BadgeResponse[];
}

export interface HopitalResponse {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  region: string;
  telephone: string;
  email: string;
  statut: string;
  capaciteStockage: number;
  stockActuel: number;
  dateCreation: string;
  dateValidation?: string;
  certifie: boolean;
  scorePerformance: number;
  description: string;
}

export interface DonResponse {
  id: number;
  donneurId: number;
  donneurNom: string;
  donneurPrenom: string;
  groupeSanguin: GroupeSanguin;
  hopitalId: number;
  hopitalNom: string;
  campagneId?: number;
  campagneTitre?: string;
  dateDon: string;
  quantiteMl: number;
  statut: StatutDon;
  numeroPoche?: string;
  datePeremption?: string;
  notes?: string;
  testsEffectues: boolean;
  pointsAttribues: number;
}

export interface DemandeSangResponse {
  id: number;
  patientId: number;
  patientEmail: string;
  hopitalId: number;
  hopitalNom: string;
  groupeSanguinDemande: GroupeSanguin;
  quantiteDemandee: number;
  dateDemande: string;
  urgence: Urgence;
  statut: StatutDemande;
  nomPatient: string;
  prenomPatient: string;
  diagnostic: string;
  medecinPrescripteur: string;
  dateBesoin?: string;
  notes?: string;
  dateTraitement?: string;
}

export interface StockResponse {
  id: number;
  hopitalId: number;
  hopitalNom: string;
  groupeSanguin: GroupeSanguin;
  quantiteDisponible: number;
  nombrePoches: number;
  seuilAlerte: number;
  seuilCritique: number;
  derniereMiseAJour: string;
  niveauStock: NiveauStock;
  quantiteReservee: number;
  pourcentageDisponible: number;
}

export interface BadgeResponse {
  id: number;
  nom: string;
  description: string;
  niveau: NiveauBadge;
  iconeUrl?: string;
  nombreDonsRequis: number;
  pointsAttribues: number;
  dateObtention?: string;
  obtenu: boolean;
}

export interface CampagneResponse {
  id: number;
  titre: string;
  description: string;
  hopitalId?: number;
  hopitalNom?: string;
  ville: string;
  region: string;
  dateDebut: string;
  dateFin: string;
  objectifDonneurs: number;
  nombreParticipants: number;
  groupeSanguinCible?: GroupeSanguin;
  statut: StatutCampagne;
  nationale: boolean;
  dateCreation: string;
  lieuCollecte: string;
  contactInfo: string;
  imageUrl?: string;
  nombreDonsCollectes: number;
  quantiteCollectee: number;
  progressionPourcentage: number;
}

export interface CandidatureResponse {
  id: number;
  demandeId: number;
  donneurId: number;
  donneurNom: string;
  donneurPrenom: string;
  donneurEmail: string;
  donneurGroupeSanguin: string;
  groupeSanguinDemande: string;
  statut: StatutCandidature;
  dateCandidature: string;
  dateTraitement?: string;
  notes?: string;
  peutDonner?: boolean;
}

export interface NotificationResponse {
  id: number;
  titre: string;
  message: string;
  type: TypeNotification;
  priorite: PrioriteNotification;
  lue: boolean;
  dateCreation: string;
  dateLecture?: string;
  lienAction?: string;
}

export interface ChatMessageResponse {
  reponse: string;
  type: 'TEXT' | 'ACTION' | 'LISTE';
  donnees?: unknown;
  suggestions: string[];
}

export interface ChatSuggestionsResponse {
  suggestions: string[];
  quickActions: {
    [key: string]: string[];
  };
}

export interface DashboardAnalytics {
  stats: {
    totalDonneurs: number;
    totalDons: number;
    totalDemandes: number;
    demandesPendantes: number;
    stocksCritiques: number;
    nouveauxDonneursAujourdHui: number;
    donsAujourdHui: number;
    demandesAujourdHui: number;
    tauxSatisfaction: number;
  };
  donsParGroupe: { [key in GroupeSanguin]?: number };
  demandesParGroupe: { [key in GroupeSanguin]?: number };
  stocksCritiques: StockResponse[];
  demandesUrgentes: DemandeSangResponse[];
  topDonneurs: DonneurResponse[];
  evolutionDons: { [key: string]: number };
  performanceHopitaux: { [key: string]: number };
}

export interface StatistiquesGlobales {
  totalHopitaux: number;
  hopitauxActifs: number;
  hopitauxEnAttente: number;
  totalDonneurs: number;
  totalAdmins: number;
  totalUtilisateurs: number;
  totalDons: number;
  totalDemandes: number;
  campagnesActives: number;
  hopitauxParRegion: { [key: string]: number };
  donsParMois: { [key: string]: number };
  donneursParVille: { [key: string]: number };
  tauxSatisfactionGlobal: number;
}
