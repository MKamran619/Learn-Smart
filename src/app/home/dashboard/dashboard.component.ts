import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonDirective } from '@coreui/angular';

import { HeaderComponent } from '../header/header.component';
import { SharedService } from '../../services/sharedServices/shared.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ButtonDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(public sharedService: SharedService) {}
  ngOnInit(): void {
    this.setActiveLink();
  }

  setActiveLink() {
    this.sharedService.activeLink = 'home';
  }
}
