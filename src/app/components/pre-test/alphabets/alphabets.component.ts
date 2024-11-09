import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';
import { IconDirective } from '@coreui/icons-angular';
import { cilArrowLeft } from '@coreui/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { CardContainerComponent } from './card-container/card-container.component';
import { SpeechDetectService } from '../../../services/speechDetect/speech-detect.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ResultTableComponent } from './result-table/result-table.component';
import { SharedService } from '../../../services/sharedServices/shared.service';

@Component({
  selector: 'app-alphabets',
  standalone: true,
  imports: [
    HeaderComponent,
    CardContainerComponent,
    IconDirective,
    FormsModule,
    CommonModule,
    ResultTableComponent,
  ],
  templateUrl: './alphabets.component.html',
  styleUrl: './alphabets.component.scss',
})
export class AlphabetsComponent implements OnInit {
  @ViewChild(CardContainerComponent) childComponent!: CardContainerComponent;

  icons = { cilArrowLeft };
  mode = '';
  btnCapitalActive = true;
  selectedTab = 'Capital Letter';
  letters: string[] = [];
  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    public accuracyService: SpeechDetectService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.sharedService.isLoading = false;
    this.activeRouter.params.subscribe((params) => {
      {
        this.mode = params['mode'];
      }
    });
    this.onClickCapitalLetter();
  }

  onClickCapitalLetter() {
    this.accuracyService.resultList = [];
    this.accuracyService.accuracyScore = 0;
    this.accuracyService.transcription = '';
    this.btnCapitalActive = true;
    this.selectedTab = 'Capital Letter';
    this.letters = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i)
    );
  }
  onClickCommonLetter() {
    this.accuracyService.resultList = [];
    this.accuracyService.accuracyScore = 0;
    this.accuracyService.transcription = '';
    this.btnCapitalActive = false;
    this.selectedTab = 'Common Letter';
    this.letters = ['E', 'T', 'A', 'O', 'I', 'N', 'S', 'H', 'R', 'D'];
  }
  onChangePreviewMode(mode: string) {
    if (this.accuracyService.onShowResult) {
      this.accuracyService.onShowResult = false;
    } else {
      this.router.navigate([`dashboard/${mode}`]);
    }
  }
}
