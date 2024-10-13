import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonDirective } from '@coreui/angular';

import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ButtonDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
