import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type {
  DonneurProfileRequest,
  DonRequest,
  DonResponse,
  BadgeResponse,
  CampagneResponse,
  DonneurResponse,
  DemandeSangResponse,
  RoleToggleRequest,
} from '../../models/types';

@Injectable({ providedIn: 'root' })
export class DonorApiService {
  private readonly base = `${environment.apiUrl}/donneur`;

  constructor(private http: HttpClient) {}

  createProfile(data: DonneurProfileRequest): Observable<DonneurResponse> {
    return this.http.post<DonneurResponse>(`${this.base}/profil`, data);
  }

  getProfile(): Observable<DonneurResponse> {
    return this.http.get<DonneurResponse>(`${this.base}/profil`);
  }

  updateProfile(data: any): Observable<DonneurResponse> {
    return this.http.put<DonneurResponse>(`${this.base}/profil`, data);
  }

  declarerDon(data: DonRequest): Observable<DonResponse> {
    return this.http.post<DonResponse>(`${this.base}/dons`, data);
  }

  getHistorique(): Observable<DonResponse[]> {
    return this.http.get<DonResponse[]>(`${this.base}/dons/historique`);
  }

  getDonations(): Observable<DonResponse[]> {
    return this.http.get<DonResponse[]>(`${this.base}/dons/historique`);
  }

  submitDonation(data: any): Observable<DonResponse> {
    return this.http.post<DonResponse>(`${this.base}/dons`, data);
  }

  getBadges(): Observable<BadgeResponse[]> {
    return this.http.get<BadgeResponse[]>(`${this.base}/badges`);
  }

  getUserBadges(): Observable<BadgeResponse[]> {
    return this.http.get<BadgeResponse[]>(`${this.base}/badges`);
  }

  getPoints(): Observable<number> {
    return this.http.get<number>(`${this.base}/points`);
  }

  getClassement(): Observable<DonneurResponse[]> {
    return this.http.get<DonneurResponse[]>(`${this.base}/classement`);
  }

  getLeaderboard(): Observable<DonneurResponse[]> {
    return this.getClassement();
  }

  getCampagnes(): Observable<CampagneResponse[]> {
    return this.http.get<CampagneResponse[]>(`${this.base}/campagnes`);
  }

  participerCampagne(id: number): Observable<CampagneResponse> {
    return this.http.post<CampagneResponse>(`${this.base}/campagnes/${id}/participer`, {});
  }

  // Blood Requests
  getDemandesDisponibles(): Observable<DemandeSangResponse[]> {
    return this.http.get<DemandeSangResponse[]>(`${this.base}/demandes-disponibles`);
  }

  postulerDemande(demandeId: number): Observable<any> {
    return this.http.post<any>(`${this.base}/demandes/${demandeId}/postuler`, {});
  }

  getMesCandidatures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/mes-candidatures`);
  }

  // Role Toggle
  toggleRole(data: RoleToggleRequest): Observable<any> {
    return this.http.put<any>(`${this.base}/role-toggle`, data);
  }
}


