import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

export function authorizationInterceptor(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> {
  const router = inject(Router);
  const userService = inject(UserService);
  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        userService.resetSecurityHeaders();
        if (router.url !== '/login') {
          router.navigate(['/login']);
        }
      }
      return throwError(() => err);
    }),
  );
}
