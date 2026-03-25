import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

const TOKEN_KEY = 'lifeflow_token';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if ((err.status === 401 || err.status === 403) && token) {
        inject(AuthService).logout();
        inject(Router).navigate(['/auth/login']);
      }
      return throwError(() => err);
    })
  );
};
