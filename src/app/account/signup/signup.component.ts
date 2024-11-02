import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertModule } from '@coreui/angular';
import { FormModule } from '@coreui/angular';
import { ButtonDirective } from '@coreui/angular';
import { AuthService } from '../../services/auth/auth.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
export class SignupComponent {
  signupForm: FormGroup;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', Validators.required],
      reEnteredPassword: ['', Validators.required],
    });
  }

  onRegisterUser() {
    const params = {
      username: 'Test34',
      email: 'test34@example.com',
      password: 'password12332',
    };
    this.authService
      .onRegisterUser(params)
      .pipe(
        finalize(() => {
          console.log('asdad');
        })
      )
      .subscribe((res: any) => {
        console.log('res ', res);
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

    if (control?.hasError('minlength')) {
      return `${controlName} must be at least ${
        control?.getError('minlength').requiredLength
      } characters long.`;
    }

    return null; // Return null if no error
  }
  onClickLogin() {
    this.router.navigate(['login']);
  }
}
