import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { SuperAdminApiService } from '../../../core/services/api/super-admin-api.service';
import type { Role } from '../../../core/models/types';
import type { HopitalResponse } from '../../../core/models/types';

/** Same permissive email pattern as login - accepts user@domain.tld */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private superAdminApi = inject(SuperAdminApiService);

  loading = false;
  error = '';
  hopitaux = signal<HopitalResponse[]>([]);

  form = this.fb.nonNullable.group({
    prenom: ['', Validators.required],
    nom: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    telephone: ['', Validators.required],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    role: ['USER' as Role, Validators.required],
    hopitalId: [null as number | null],
  });

  ngOnInit(): void {
    this.superAdminApi.getHopitaux().subscribe({
      next: (list) => this.hopitaux.set(list),
      error: () => {},
    });
  }

  get isAdmin(): boolean {
    return this.form.get('role')?.value === 'ADMIN';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Veuillez remplir tous les champs correctement (email valide, mot de passe min. 6 caractères).';
      return;
    }
    this.loading = true;
    this.error = '';
    const raw = this.form.getRawValue();
    const payload = {
      email: raw.email,
      motDePasse: raw.motDePasse,
      nom: raw.nom,
      prenom: raw.prenom,
      telephone: raw.telephone,
      role: raw.role,
      hopitalId: raw.role === 'ADMIN' ? raw.hopitalId ?? undefined : undefined,
    };
    this.auth
      .register(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {},
        error: (err) => {
          this.error =
            err.error?.message ??
            err.message ??
            "Erreur d'inscription";
        },
      });
  }
}
