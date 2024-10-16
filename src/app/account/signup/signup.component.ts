import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertModule } from '@coreui/angular';
import { FormModule } from '@coreui/angular';
import { ButtonDirective } from '@coreui/angular';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [AlertModule, ButtonDirective, FormModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  constructor(private router: Router) {}

  onSubmit() {
    this.router.navigate(['welcome']);
  }
  onClickLogin() {
    this.router.navigate(['login']);
  }
}
