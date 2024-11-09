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
import { ApiService } from '../../../services/apiServices/api.service';
import { finalize } from 'rxjs';
import { SharedService } from '../../../services/sharedServices/shared.service';

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
    public accuracyService: SpeechDetectService,
    public apiService: ApiService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params) => {
      {
        this.mode = params['mode'];
      }
    });
    this.onGetFilterSentence();
  }
  onGetFilterSentence() {
    this.accuracyService.resultList = [];
    this.accuracyService.accuracyScore = 0;
    this.accuracyService.transcription = '';
    this.sharedService.isLoading = true;
    this.apiService
      .GetFilterSentence()
      .pipe(
        finalize(() => {
          this.sharedService.isLoading = false;
        })
      )
      .subscribe((res) => {
        console.log({ res });
        this.sentenceList = res.data.map((items: any) => items.Sentence);
        console.log('this.sentenceList = ', this.sentenceList);
      });
  }
  onChangePreviewMode(mode: string) {
    if (this.accuracyService.onShowResult) {
      this.accuracyService.onShowResult = false;
    } else {
      this.router.navigate([`dashboard/${mode}`]);
    }
  }
}
