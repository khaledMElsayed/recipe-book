import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseDate {
  user: UserResponse;
  token: string;
}

interface UserResponse {
  _id: string;
  name: string;
  email: string;
  age: number;
  password?: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  userSubject = new BehaviorSubject<User>(null);

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(name: string, email: string, password: string, age: number) {
    return this.http
      .post<AuthResponseDate>('http://localhost:3000/users', {
        name: name,
        email: email,
        password: password,
        age: age,
      })
      .pipe(
        catchError(this.handleError),
        tap(this.handleAuthentication.bind(this))
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseDate>('http://localhost:3000/users/login', {
        email: email,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap(this.handleAuthentication.bind(this))
      );
  }

  autoLogin() {
    const userData: User = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadeduser: User = new User(
      userData._id,
      userData.name,
      userData.email,
      userData.age,
      userData._token
    );
    if (loadeduser.token) {
      this.userSubject.next(loadeduser);
      this.autoLogout(User.getTokenExpirationDuration(loadeduser._token));
    }
  }

  logout() {
    return this.http.post('http://localhost:3000/users/logout', {}).pipe(
      catchError(this.handleError),
      tap(() => {
        this.userSubject.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
          clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
      })
    );
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout().subscribe();
    }, expirationDuration);
  }

  private handleAuthentication(resData: AuthResponseDate) {
    const user = new User(
      resData.user._id,
      resData.user.name,
      resData.user.email,
      resData.user.age,
      resData.token
    );
    this.userSubject.next(user);
    this.autoLogout(User.getTokenExpirationDuration(user._token));
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An error occured!';
    console.log(errorResponse);
    if (errorResponse.url.includes('login')) {
      errorMessage = 'The email or password incorrect';
    }
    if (errorResponse.error.keyPattern) {
      for (let key in errorResponse.error.keyPattern) {
        if (key == 'email') {
          errorMessage = 'This email already exists.';
        }
      }
    }
    return throwError(errorMessage);
  }
}
