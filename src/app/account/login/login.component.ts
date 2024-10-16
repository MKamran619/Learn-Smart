import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertModule } from '@coreui/angular';
import { FormModule } from '@coreui/angular';
import { ButtonDirective } from '@coreui/angular';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AlertModule, ButtonDirective, FormModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}
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

  onSubmit() {
    this.router.navigate(['dashboard']);
  }
  onClickSignup() {
    this.router.navigate(['signup']);
  }
}
