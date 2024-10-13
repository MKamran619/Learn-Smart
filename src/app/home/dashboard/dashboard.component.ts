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
  isDashboardPreview = true;
  isPreTestPreview = false;
  isPostTestPreview = false;

  constructor(public sharedService: SharedService) {}
  ngOnInit(): void {
    this.setActiveLink();
  }

  setActiveLink() {
    this.sharedService.activeLink = 'home';
  }
  onChangePreviewMode(mode: string) {
    if (mode == 'dashboard') {
      this.isDashboardPreview = true;
      this.isPreTestPreview = false;
      this.isPostTestPreview = false;
    } else if (mode == 'preTest') {
      this.isDashboardPreview = false;
      this.isPreTestPreview = true;
      this.isPostTestPreview = false;
    } else if (mode == 'postTest') {
      this.isDashboardPreview = false;
      this.isPreTestPreview = false;
      this.isPostTestPreview = true;
    }
  }
}
