import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export const AUTHORIZATION_HEADER = 'authorization-header';

export interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  login(username: string, password: string): Observable<boolean> {
    localStorage.setItem(
      AUTHORIZATION_HEADER,
      'Basic ' + btoa(username + ':' + password),
    );
    return of(true);
  }

  getSecurityHeaders(): HttpHeaders {
    const authorizationHeader = localStorage.getItem(AUTHORIZATION_HEADER);
    if (authorizationHeader) {
      return new HttpHeaders({
        Authorization: authorizationHeader,
      });
    } else {
      return new HttpHeaders();
    }
  }
}
