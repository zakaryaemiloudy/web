import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type { DemandeSangResponse, StatutDemande, StockResponse } from '../../models/types';

@Injectable({ providedIn: 'root' })
export class HospitalApiService {
  private readonly base = `${environment.apiUrl}/hospital`;

  constructor(private http: HttpClient) {}

  // ===== DEMANDES MANAGEMENT =====
  
  getHospitalDemands(hospitalId: number): Observable<DemandeSangResponse[]> {
    return this.http.get<DemandeSangResponse[]>(`${this.base}/demandes/${hospitalId}`);
  }

  updateDemandStatus(demandId: number, status: StatutDemande): Observable<DemandeSangResponse> {
    return this.http.put<DemandeSangResponse>(
      `${this.base}/demandes/${demandId}/status`,
      { status }
    );
  }

  getDemandDetails(demandId: number): Observable<DemandeSangResponse> {
    return this.http.get<DemandeSangResponse>(`${this.base}/demandes/${demandId}`);
  }

  // ===== STOCK MANAGEMENT =====
  
  getHospitalStocks(hospitalId: number): Observable<StockResponse[]> {
    return this.http.get<StockResponse[]>(`${this.base}/stocks/${hospitalId}`);
  }

  updateStock(hospitalId: number, bloodType: string, quantity: number): Observable<StockResponse> {
    return this.http.put<StockResponse>(
      `${this.base}/stocks/${hospitalId}/${bloodType}`,
      { quantity }
    );
  }

  // ===== HOSPITAL PROFILE =====
  
  getHospitalProfile(hospitalId: number): Observable<any> {
    return this.http.get<any>(`${this.base}/profile/${hospitalId}`);
  }

  updateHospitalProfile(hospitalId: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/profile/${hospitalId}`, data);
  }

  // ===== STATISTICS =====
  
  getHospitalStats(hospitalId: number): Observable<any> {
    return this.http.get<any>(`${this.base}/stats/${hospitalId}`);
  }

  getDemandStats(hospitalId: number): Observable<any> {
    return this.http.get<any>(`${this.base}/demandes/${hospitalId}/stats`);
  }
}
