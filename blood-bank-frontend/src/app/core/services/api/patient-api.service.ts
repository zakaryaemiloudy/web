import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type {
  DemandeSangRequest,
  DemandeSangResponse,
  StockResponse,
  RoleToggleRequest,
  HopitalResponse,
} from '../../models/types';

@Injectable({ providedIn: 'root' })
export class PatientApiService {
  private readonly base = `${environment.apiUrl}/patient`;

  constructor(private http: HttpClient) {}

  createDemande(data: DemandeSangRequest): Observable<DemandeSangResponse> {
    return this.http.post<DemandeSangResponse>(`${this.base}/demandes`, data);
  }

  getDemandes(): Observable<DemandeSangResponse[]> {
    return this.http.get<DemandeSangResponse[]>(`${this.base}/demandes`);
  }

  getDemande(id: number): Observable<DemandeSangResponse> {
    return this.http.get<DemandeSangResponse>(`${this.base}/demandes/${id}`);
  }

  getStocks(hopitalId: number): Observable<StockResponse[]> {
    return this.http.get<StockResponse[]>(`${this.base}/stocks/${hopitalId}`);
  }

  getMesDemandes(): Observable<DemandeSangResponse[]> {
    return this.http.get<DemandeSangResponse[]>(`${this.base}/demandes`);
  }

  toggleRole(data: RoleToggleRequest): Observable<any> {
    return this.http.put<any>(`${this.base}/role-toggle`, data);
  }

  getHospitals(): Observable<HopitalResponse[]> {
    return this.http.get<HopitalResponse[]>(`${this.base}/hopitaux`);
  }

  getHospital(id: number): Observable<HopitalResponse> {
    return this.http.get<HopitalResponse>(`${this.base}/hopitaux/${id}`);
  }

  updateBloodType(groupeSanguin: string): Observable<any> {
    return this.http.put<any>(`${this.base}/blood-type`, { groupeSanguin });
  }
}
