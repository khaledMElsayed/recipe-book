import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseDate, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const name = form.value.name;
    const email = form.value.email;
    const password = form.value.password;
    const age = form.value.age;

    this.isLoading = true;

    let authObs: Observable<AuthResponseDate>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signUp(name, email, password, age);
    }

    authObs.subscribe(
      (response) => {
        this.isLoading = false;
        console.log(response);
        this.router.navigate(['/recipes']);
      },
      (error) => {
        console.log(error);
        this.error = error;
        this.isLoading = false;
      }
    );
    form.reset();
  }

  onHndleError() {
    this.error = null;
  }
}
