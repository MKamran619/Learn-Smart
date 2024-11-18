import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertModule } from '@coreui/angular';
import { FormModule } from '@coreui/angular';
import { ButtonDirective } from '@coreui/angular';
import { finalize, forkJoin } from 'rxjs';
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
import { ApiService } from '../../services/apiServices/api.service';
import { UrlWithStringQuery } from 'node:url';

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
    public fb: FormBuilder,
    public apiService: ApiService
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
        next: (loginRes) => {
          if (loginRes.jwt) {
            localStorage.setItem('userConfig', JSON.stringify(loginRes));
            // localStorage.setItem('levelConfig', JSON.stringify(levelsRes));

            this.sharedService.userConfig = loginRes;
            // this.sharedService.levelsConfig = levelsRes;
            // this.apiService.getUserLevelsByUsernameOrEmail(identifier)
            this.getUserLevels(identifier);

            this.router.navigate(['dashboard']);
          }
        },
        error: (err) => {
          console.error('Error occurred', err);
          alert(err.error.error.message); // Show the error message
          // Optionally, handle specific error cases if necessary
        },
      });
  }
  getUserLevels(identifier: UrlWithStringQuery) {
    this.apiService
      .getUserLevelsByUsernameOrEmail(identifier)
      .pipe(finalize(() => {}))
      .subscribe((res) => {
        localStorage.setItem('levelConfig', JSON.stringify(res));
        this.sharedService.levelsConfig = res;
      });
  }

  // onLogin() {
  //   if (this.loginForm.invalid) {
  //     return;
  //   }
  //   this.sharedService.isLoading = true;
  //   const { identifier, password } = this.loginForm.value;
  //   const params = { identifier, password };

  //   this.authService
  //     .onLogin(params)
  //     .pipe(
  //       finalize(() => {
  //         this.sharedService.isLoading = false;
  //       })
  //     )
  //     .subscribe({
  //       next: (res) => {
  //         console.log('Login successful', res);
  //         if (res.jwt) {
  //           localStorage.setItem('jwt', res.jwt);
  //           this.router.navigate(['dashboard']);
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Login failed', err);
  //         alert(err.error.error.message);
  //         // Handle error, like showing an error message to the user
  //       },
  //     });
  // }
  // getUserLevels() {
  //   this.apiService
  //     .getUserLevels()
  //     .pipe(
  //       finalize(() => {
  //         this.sharedService.isLoading = false;
  //       })
  //     )
  //     .subscribe({
  //       next: (res) => {
  //         console.log('Login successful', res);
  //         this.sharedService.levelsConfig = res;
  //         // localStorage.setItem('jwt', res.jwt);
  //       },
  //       error: (err) => {
  //         console.error('Login failed', err);
  //         alert(err.error.error.message);
  //         // Handle error, like showing an error message to the user
  //       },
  //     });
  // }
}
