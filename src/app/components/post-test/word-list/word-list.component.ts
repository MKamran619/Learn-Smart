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
  selector: 'app-word-list',
  standalone: true,
  imports: [HeaderComponent, IconDirective, CommonModule, MatIconModule],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.scss',
})
export class WordListComponent {
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
      this.isLoading = true;
      this.router.navigate([`dashboard/${mode}`]);
    }, 3500);
  }
  onNavigate(type: string) {
    this.sharedService.isLoading = true;
    setTimeout(() => {
      this.router.navigate([`dashboard/post-test/post-word-list/${type}`]);
    }, 2500);
  }
}
