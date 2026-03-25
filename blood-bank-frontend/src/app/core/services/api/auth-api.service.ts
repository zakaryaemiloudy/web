import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import type {
  ConnexionRequest,
  InscriptionRequest,
  AuthResponse,
  Role,
} from '../../models/types';

/** Normalize backend response to AuthResponse (handles token / accessToken / jwt and nested user) */
function toAuthResponse(body: unknown): AuthResponse {
  const obj = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const token =
    (obj['token'] as string) ??
    (obj['accessToken'] as string) ??
    (obj['jwt'] as string) ??
    (obj['access_token'] as string);
  const user = obj['user'] as Record<string, unknown> | undefined;
  const id = (obj['id'] ?? user?.['id']) as number;
  const email = (obj['email'] ?? user?.['email']) as string;
  const nom = (obj['nom'] ?? user?.['nom']) as string;
  const prenom = (obj['prenom'] ?? user?.['prenom']) as string;
  const role = (obj['role'] ?? user?.['role']) as Role;
  const pointsTotal = (obj['pointsTotal'] ?? user?.['pointsTotal']) as number | undefined;
  const hopitalId = (obj['hopitalId'] ?? user?.['hopitalId']) as number | undefined;
  const type = (obj['type'] as string) ?? 'Bearer';
  const actif = (obj['actif'] as boolean) ?? true;
  const hopitalNom = (obj['hopitalNom'] ?? user?.['hopitalNom']) as string | undefined;
  return {
    token: token ?? '',
    type,
    id: id ?? 0,
    email: email ?? '',
    nom: nom ?? '',
    prenom: prenom ?? '',
    role: role ?? 'USER',
    hopitalId,
    hopitalNom,
    actif,
    pointsTotal,
  };
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly base = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(data: ConnexionRequest): Observable<AuthResponse> {
    return this.http
      .post<unknown>(`${this.base}/connexion`, data)
      .pipe(timeout(15000), map(toAuthResponse));
  }

  register(data: InscriptionRequest): Observable<AuthResponse> {
    return this.http
      .post<unknown>(`${this.base}/inscription`, data)
      .pipe(map(toAuthResponse));
  }

  validateToken(): Observable<boolean> {
    return this.http.get<boolean>(`${this.base}/valider-token`);
  }
}
