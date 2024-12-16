import { Component } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';
import { SharedService } from '../../../services/sharedServices/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { cilArrowLeft } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { Constants } from '../../../constants';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-oral-reading-passages',
  standalone: true,
  imports: [HeaderComponent, IconDirective, CommonModule, MatIconModule],
  templateUrl: './oral-reading-passages.component.html',
  styleUrl: './oral-reading-passages.component.scss',
})
export class OralReadingPassagesComponent {
  Constants = Constants;
  icons = { cilArrowLeft };
  isLoading = false;
  constructor(
    public sharedService: SharedService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    this.sharedService.isLoading = false;
  }
  onChangePreviewMode(mode: string) {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([`dashboard/${mode}`]);
    }, 3500);
  }
  onNavigate(type: string) {
    this.sharedService.isLoading = true;
    setTimeout(() => {
      this.sharedService.isLoading = false;
      this.router.navigate([
        `dashboard/post-test/post-oral-reading-passages/${type}`,
      ]);
    }, 2500);
  }
}
