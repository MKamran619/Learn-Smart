import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';
import { IconDirective } from '@coreui/icons-angular';
import { cilArrowLeft } from '@coreui/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { CardContainerComponent } from './card-container/card-container.component';
import { SpeechDetectService } from '../../../services/speechDetect/speech-detect.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/sharedServices/shared.service';
@Component({
  selector: 'app-alphabets',
  standalone: true,
  imports: [HeaderComponent, IconDirective, FormsModule, CommonModule],
  templateUrl: './alphabets.component.html',
  styleUrl: './alphabets.component.scss',
})
export class AlphabetsComponent implements OnInit {
  @ViewChild(CardContainerComponent) childComponent!: CardContainerComponent;

  icons = { cilArrowLeft };
  mode = '';
  btnCapitalActive = true;
  selectedTab = 'Capital Letter';
  CapitalLetters: string[] = [];
  CommonLetters: string[] = [];
  isLoading = false;
  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    public accuracyService: SpeechDetectService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.accuracyService.onShowResult = false;
    this.sharedService.isLoading = false;
    this.activeRouter.params.subscribe((params) => {
      {
        this.mode = params['mode'];
      }
    });
  }

  onChangePreviewMode(mode: string) {
    if (this.accuracyService.onShowResult) {
      this.accuracyService.onShowResult = false;
    } else {
      this.router.navigate([`dashboard/${mode}`]);
    }
  }
  onNavigate(type: string) {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = true;
      this.router.navigate([`dashboard/pre-test/pre-alphabets/${type}`]);
    }, 2000);
  }
}
