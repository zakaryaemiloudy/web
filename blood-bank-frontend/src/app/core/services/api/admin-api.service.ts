import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type {
  DashboardAnalytics,
  DonResponse,
  DemandeSangResponse,
  StockResponse,
  DonneurResponse,
  CampagneRequest,
  CampagneResponse,
  StatutDemande,
  CandidatureResponse,
  StatutCandidature,
} from '../../models/types';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardAnalytics> {
    return this.http.get<DashboardAnalytics>(`${this.base}/dashboard`);
  }

  getDons(): Observable<DonResponse[]> {
    return this.http.get<DonResponse[]>(`${this.base}/dons`);
  }

  validerDon(id: number): Observable<DonResponse> {
    return this.http.put<DonResponse>(`${this.base}/dons/${id}/valider`, {});
  }

  rejeterDon(id: number, raison: string): Observable<DonResponse> {
    return this.http.put<DonResponse>(`${this.base}/dons/${id}/rejeter`, raison, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  getDemandes(): Observable<DemandeSangResponse[]> {
    return this.http.get<DemandeSangResponse[]>(`${this.base}/demandes`);
  }

  creerDemande(data: any): Observable<DemandeSangResponse> {
    return this.http.post<DemandeSangResponse>(`${this.base}/demandes`, data);
  }

  getDemandesUrgentes(): Observable<DemandeSangResponse[]> {
    return this.http.get<DemandeSangResponse[]>(`${this.base}/demandes/urgentes`);
  }

  traiterDemande(id: number, statut: StatutDemande): Observable<DemandeSangResponse> {
    return this.http.put<DemandeSangResponse>(
      `${this.base}/demandes/${id}/traiter`,
      {},
      { params: { statut } }
    );
  }

  getStocks(): Observable<StockResponse[]> {
    return this.http.get<StockResponse[]>(`${this.base}/stocks`);
  }

  getStocksCritiques(): Observable<StockResponse[]> {
    return this.http.get<StockResponse[]>(`${this.base}/stocks/critiques`);
  }

  getDonneurs(): Observable<DonneurResponse[]> {
    return this.http.get<DonneurResponse[]>(`${this.base}/donneurs`);
  }

  getTopDonneurs(): Observable<DonneurResponse[]> {
    return this.http.get<DonneurResponse[]>(`${this.base}/donneurs/top`);
  }

  createCampagne(data: CampagneRequest): Observable<CampagneResponse> {
    return this.http.post<CampagneResponse>(`${this.base}/campagnes`, data);
  }

  getCampagnes(): Observable<CampagneResponse[]> {
    return this.http.get<CampagneResponse[]>(`${this.base}/campagnes`);
  }

  getCampagnesActives(): Observable<CampagneResponse[]> {
    return this.http.get<CampagneResponse[]>(`${this.base}/campagnes/actives`);
  }

  // ===== STOCKS =====

  updateStock(stockId: number, nouvelleQuantite: number): Observable<StockResponse> {
    return this.http.put<StockResponse>(
      `${this.base}/stocks/${stockId}`,
      {},
      { params: { nouvelleQuantite: nouvelleQuantite.toString() } }
    );
  }

  updateStockSeuils(stockId: number, seuilAlerte: number, seuilCritique: number): Observable<StockResponse> {
    return this.http.put<StockResponse>(
      `${this.base}/stocks/${stockId}/seuils`,
      {},
      { params: { seuilAlerte: seuilAlerte.toString(), seuilCritique: seuilCritique.toString() } }
    );
  }

  // ===== CANDIDATURES =====

  getCandidaturesByDemande(demandeId: number): Observable<CandidatureResponse[]> {
    return this.http.get<CandidatureResponse[]>(`${this.base}/demandes/${demandeId}/candidatures`);
  }

  traiterCandidature(candidatureId: number, statut: StatutCandidature): Observable<CandidatureResponse> {
    return this.http.put<CandidatureResponse>(
      `${this.base}/candidatures/${candidatureId}/traiter`,
      {},
      { params: { statut } }
    );
  }
}
