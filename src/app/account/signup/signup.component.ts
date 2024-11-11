import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertModule } from '@coreui/angular';
import { FormModule } from '@coreui/angular';
import { ButtonDirective } from '@coreui/angular';
import { AuthService } from '../../services/auth/auth.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SharedService } from '../../services/sharedServices/shared.service';
import { ApiService } from '../../services/apiServices/api.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AlertModule,
    ButtonDirective,
    FormModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  passwordValue = '';
  serverError = '';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public authService: AuthService,
    public sharedService: SharedService,
    public apiService: ApiService
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', [Validators.required, this.passwordStrengthValidator()]],
      reEnteredPassword: [
        '',
        [Validators.required, this.passwordsMatchValidator()],
      ],
    });
  }
  ngOnInit(): void {
    this.signupForm.get('password')?.valueChanges.subscribe((value) => {
      this.passwordValue = value;
    });
  }

  onRegisterUser() {
    this.sharedService.isLoading = true;
    const params = {
      username: this.signupForm.get('username')?.value,
      email: this.signupForm.get('email')?.value,
      password: this.signupForm.get('password')?.value,
    };
    this.authService
      .onRegisterUser(params)
      .pipe(
        finalize(() => {
          this.sharedService.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          console.log('res ', res);
          if (res.jwt) {
            this.router.navigate(['welcome']);
            localStorage.setItem('userConfig', JSON.stringify(res));
          }
        },
        error: (err) => {
          console.error('Registration', err);
          alert(err.error.error.message);
        },
      });
  }
  onDisableBtn() {
    return;
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      // Form is invalid, but we can handle this in the template.
      return;
    }
    this.onRegisterUser();
    // console.log('username = ', this.username);
    // this.router.navigate(['welcome']);
  }
  getErrorMessage(controlName: string): string | null {
    const control = this.signupForm.get(controlName);

    if (control?.hasError('required')) {
      return `${controlName} is required.`;
    }

    if (control?.hasError('email')) {
      return 'Please enter a valid email address.';
    }

    if (controlName === 'password' && control?.hasError('weakPassword')) {
      return 'Password must be medium strength: include uppercase, lowercase, and numbers.';
    }

    if (
      controlName === 'reEnteredPassword' &&
      control?.hasError('passwordMismatch')
    ) {
      return 'Passwords do not match.';
    }

    if (control?.hasError('minlength')) {
      return `${controlName} must be at least ${
        control?.getError('minlength').requiredLength
      } characters long.`;
    }

    return null; // Return null if no error
  }
  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const password = control.value;
      if (password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = /[!@#$%^&*]/.test(password);

        const mediumStrength =
          (hasUpperCase && hasLowerCase && hasNumbers) ||
          (hasUpperCase && hasSymbols) ||
          (hasLowerCase && hasSymbols);

        return mediumStrength ? null : { weakPassword: true };
      }
      return null; // Return null if no password is entered
    };
  }

  passwordsMatchValidator(): ValidatorFn {
    console.log(' iam in');
    return (control: AbstractControl) => {
      // const password = group.get('password')?.value;
      // const password2 = this.signupForm.get('password')?.value;
      const reEnteredPassword = control.value;
      console.log(' password  = ', this.passwordValue);
      console.log(' reEnteredPassword ,', reEnteredPassword);
      return this.passwordValue === reEnteredPassword
        ? null
        : { passwordMismatch: true };
    };
  }

  onClickLogin() {
    this.router.navigate(['login']);
  }
}
