import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  loading = false;
  error = '';

  /** More permissive email: anything with @ and a domain (e.g. user@bks.com). Angular's Validators.email rejects some valid addresses. */
  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Veuillez remplir correctement l’email et le mot de passe (min. 6 caractères).';
      return;
    }
    this.loading = true;
    this.error = '';
    const { email, motDePasse } = this.form.getRawValue();
    this.auth
      .login(email, motDePasse)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {},
        error: (err) => {
          this.error =
            err.error?.message ??
            err.message ??
            'Identifiants incorrects ou serveur indisponible';
        },
      });
  }
}
