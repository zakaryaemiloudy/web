import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import type { AuthResponse, Role } from '../models/types';
import { AuthApiService } from '../services/api/auth-api.service';

const TOKEN_KEY = 'lifeflow_token';
const USER_KEY = 'lifeflow_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(this.getStoredToken());
  private readonly userSignal = signal<AuthResponse | null>(this.getStoredUser());

  readonly token = this.tokenSignal.asReadonly();
  readonly currentUser = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.tokenSignal());
  readonly pointsTotal = computed(
    () => this.userSignal()?.pointsTotal ?? 0
  );

  constructor(
    private authApi: AuthApiService,
    private router: Router
  ) {}

  private getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private getStoredUser(): AuthResponse | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthResponse;
    } catch {
      return null;
    }
  }

  login(email: string, motDePasse: string): Observable<AuthResponse> {
    return this.authApi.login({ email, motDePasse }).pipe(
      tap((res) => {
        if (!res?.token || typeof res.token !== 'string') {
          throw new Error('Réponse serveur invalide : token manquant');
        }
        this.setSession(res);
      })
    );
  }

  register(data: {
    email: string;
    motDePasse: string;
    nom: string;
    prenom: string;
    telephone: string;
    role: Role;
    hopitalId?: number;
  }): Observable<AuthResponse> {
    return this.authApi.register(data).pipe(
      tap((res) => {
        if (!res?.token || typeof res.token !== 'string') {
          throw new Error('Réponse serveur invalide : token manquant');
        }
        this.setSession(res);
      })
    );
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res));
    this.tokenSignal.set(res.token);
    this.userSignal.set(res);

    if (res.role === 'SUPER_ADMIN') this.router.navigate(['/superadmin/dashboard']);
    else if (res.role === 'ADMIN') this.router.navigate(['/admin/dashboard']);
    else this.router.navigate(['/donneur/profil']);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  getCurrentUser(): AuthResponse | null {
    return this.userSignal();
  }

  hasRole(role: Role): boolean {
    return this.userSignal()?.role === role;
  }

  hasAnyRole(roles: Role[]): boolean {
    const current = this.userSignal()?.role;
    return current ? roles.includes(current) : false;
  }

  refreshUser(user: AuthResponse): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSignal.set(user);
  }
}
