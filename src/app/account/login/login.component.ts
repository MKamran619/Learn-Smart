import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertModule } from '@coreui/angular';
import { FormModule } from '@coreui/angular';
import { ButtonDirective } from '@coreui/angular';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedService } from '../../services/sharedServices/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    ButtonDirective,
    FormModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private router: Router,
    private authService: AuthService,
    public sharedService: SharedService,
    public fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      identifier: ['testuser@gmail.com', Validators.required],
      password: ['Example12', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.router.navigate(['dashboard']);
  }
  onClickSignup() {
    this.router.navigate(['signup']);
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.sharedService.isLoading = true;
    const { identifier, password } = this.loginForm.value;
    const params = { identifier, password };

    this.authService
      .onLogin(params)
      .pipe(
        finalize(() => {
          this.sharedService.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          console.log('Login successful', res);
          if (res.jwt) {
            localStorage.setItem('jwt', res.jwt);
            this.router.navigate(['dashboard']);
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          alert(err.error.error.message);
          // Handle error, like showing an error message to the user
        },
      });
  }
}
