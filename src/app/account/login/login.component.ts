import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertModule } from '@coreui/angular';
import { FormModule } from '@coreui/angular';
import { ButtonDirective } from '@coreui/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AlertModule, ButtonDirective, FormModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private router: Router) {}

  onSubmit() {
    this.router.navigate(['dashboard']);
  }
  onClickSignup() {
    this.router.navigate(['signup']);
  }
}
