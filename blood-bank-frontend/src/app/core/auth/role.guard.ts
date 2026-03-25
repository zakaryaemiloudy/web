import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import type { Role } from '../models/types';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data['roles'] as Role[] | undefined) ?? [];
  if (!auth.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }
  if (roles.length && !auth.hasAnyRole(roles)) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
