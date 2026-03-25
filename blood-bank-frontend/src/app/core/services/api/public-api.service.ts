import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type { HopitalResponse } from '../../models/types';

@Injectable({ providedIn: 'root' })
export class PublicApiService {
  private readonly base = `${environment.apiUrl}/public`;

  constructor(private http: HttpClient) {}

  /**
   * Returns all hospitals that are visible to public/donors.
   */
  getHopitaux(): Observable<HopitalResponse[]> {
    return this.http.get<HopitalResponse[]>(`${this.base}/hopitaux`);
  }
}
