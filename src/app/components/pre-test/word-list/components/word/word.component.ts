import { Component, OnInit, ViewChild } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { cilArrowLeft } from '@coreui/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../../home/header/header.component';
import { CardContainerComponent } from '../card-container/card-container.component';
import { SpeechDetectService } from '../../../../../services/speechDetect/speech-detect.service';
import { ResultTableComponent } from '../result-table/result-table.component';

@Component({
  selector: 'app-word',
  standalone: true,
  imports: [
    HeaderComponent,
    CardContainerComponent,
    IconDirective,
    FormsModule,
    CommonModule,
    ResultTableComponent,
  ],
  templateUrl: './word.component.html',
  styleUrl: './word.component.scss',
})
export class WordComponent implements OnInit {
  @ViewChild(CardContainerComponent) childComponent!: CardContainerComponent;

  icons = { cilArrowLeft };
  mode = '';
  type = '';
  btnCapitalActive = true;
  selectedTab = 'Capital Letter';
  word: string[] = [];
  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    public accuracyService: SpeechDetectService
  ) {}

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params) => {
      {
        this.mode = params['mode'];
        this.type = params['type'];
      }
    });
    this.onClickCapitalLetter();
  }

  onClickCapitalLetter() {
    this.accuracyService.resultList = [];
    this.accuracyService.accuracyScore = 0;
    this.accuracyService.transcription = '';
    this.btnCapitalActive = false;
    this.selectedTab = 'Common Letter';
    this.word = [
      'A',
      'AND',
      'AWAY',
      'BIG',
      'BLUE',
      'CAN',
      'COME',
      'DOWN',
      'FIND',
      'FOR',
      'FUNNY',
      'GO',
      'HELP',
      'HERE',
      'I',
      'IN',
      'IS',
      'IT',
      'JUMP',
      'LITTLE',
      'LOOK',
      'MAKE',
      'ME',
      'MY',
      'NOT',
      'ONE',
      'PLAY',
      'RED',
      'RUN',
      'SAID',
      'SEE',
      'THE',
      'THREE',
      'TO',
      'TWO',
      'UP',
      'WE',
      'WHERE',
      'YELLOW',
      'YOU',
    ];
  }
  onChangePreviewMode(mode: string) {
    if (this.accuracyService.onShowResult) {
      this.accuracyService.onShowResult = false;
    } else {
      this.router.navigate([`dashboard/${mode}`]);
    }
  }
}
