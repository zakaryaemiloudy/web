import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

// Simple error interceptor; can be extended to show toast/snackbar via a service
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message =
        err.error?.message ?? err.message ?? 'Une erreur est survenue.';
      console.error('[HTTP Error]', message, err);
      // TODO: inject a ToastService and show message
      return throwError(() => err);
    })
  );
};
