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

@Component({
  selector: 'app-sentence-filter',
  standalone: true,
  imports: [
    HeaderComponent,
    CardContainerComponent,
    IconDirective,
    FormsModule,
    CommonModule,
    ResultTableComponent,
  ],
  templateUrl: './sentence-filter.component.html',
  styleUrl: './sentence-filter.component.scss',
})
export class SentenceFilterComponent implements OnInit {
  @ViewChild(CardContainerComponent) childComponent!: CardContainerComponent;

  icons = { cilArrowLeft };
  mode = '';
  sentenceList: string[] = [];
  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    public accuracyService: SpeechDetectService
  ) {}

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params) => {
      {
        this.mode = params['mode'];
      }
    });
    this.onLoadInitialData();
  }
  onLoadInitialData() {
    this.accuracyService.resultList = [];
    this.accuracyService.accuracyScore = 0;
    this.accuracyService.transcription = '';
    this.sentenceList = [
      'I can play with the bat and ball here.',
      'The three boys like to walk to the bus stop.',
      'We are sleeping. We woke up late and we are very tired.',
      'Mother and father work from home. They help people and tell them what to do. Some of them left their houses very early.',
      'Sometimes we need to place animals into groups of same and different. Together, we must write the important ones on the same list.',
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
