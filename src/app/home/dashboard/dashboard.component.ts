import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { cilArrowLeft } from '@coreui/icons';

import { HeaderComponent } from '../header/header.component';
import { SharedService } from '../../services/sharedServices/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    ButtonDirective,
    IconDirective,
    MatIconModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  icons = { cilArrowLeft };
  isDashboardPreview = true;
  isPreTestPreview = false;
  isPostTestPreview = false;

  constructor(
    public sharedService: SharedService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.setActiveLink();
    this.activatedRoute.params.subscribe((params) => {
      const mode = params['mode'];
      this.isDashboardPreview = mode !== 'pre-test' && mode !== 'post-test';
      this.isPreTestPreview = mode === 'pre-test';
      this.isPostTestPreview = mode === 'post-test';
    });
  }

  setActiveLink() {
    this.sharedService.activeLink = 'home';
  }
  onChangePreviewMode(mode: string) {
    const routes: any = {
      dashboard: ['dashboard'],
      preTest: ['dashboard/pre-test'],
      postTest: ['dashboard/post-test'],
    };

    this.router.navigate(routes[mode]);
  }
  onNavigate(mode: string, type: string) {
    this.router.navigate([`dashboard/${mode}/${type}`]);
  }
}
