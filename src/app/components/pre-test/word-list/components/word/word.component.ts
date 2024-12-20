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
import { finalize } from 'rxjs';
import { ApiService } from '../../../../../services/apiServices/api.service';
import { SharedService } from '../../../../../services/sharedServices/shared.service';

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
  wordsList: string[] = [];
  title = '';
  totalCount = 10;
  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    public accuracyService: SpeechDetectService,
    public apiService: ApiService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.accuracyService.onShowResult = false;
    this.activeRouter.params.subscribe((params) => {
      {
        this.mode = params['mode'];
        this.type = params['type'];
      }
    });
    this.setTotalCountByType();
    this.onLoadInitialData();
    this.title = this.sharedService.transformValue(this.type);
  }
  setTotalCountByType() {
    const type = this.type.toLowerCase();
    if (type == 'pre-primer' || type == 'primer') {
      this.totalCount = 10;
    } else if (type == 'level-1' || type == 'level-2' || type == 'level-3') {
      this.totalCount = 15;
    } else {
      this.totalCount = 20;
    }
  }
  onLoadInitialData() {
    this.accuracyService.resultList = [];
    this.accuracyService.accuracyScore = 0;
    this.accuracyService.transcription = '';
    this.btnCapitalActive = false;
    this.onGetWordList();
  }
  onChangePreviewMode(mode: string) {
    this.accuracyService.stopPreviousRecording();
    this.sharedService.isLoading = true;
    // if (this.accuracyService.onShowResult) {
    //   this.accuracyService.onShowResult = false;
    // } else {
    setTimeout(() => {
      this.sharedService.isLoading = false;
      this.router.navigate([`dashboard/${mode}/pre-word-list`]);
    }, 2000);

    // }
  }
  onGetWordList() {
    this.accuracyService.resultList = [];
    this.accuracyService.accuracyScore = 0;
    this.accuracyService.transcription = '';
    this.sharedService.isLoading = true;
    this.apiService
      .GetWordLists()
      .pipe(
        finalize(() => {
          // this.sharedService.isLoading = false;
        })
      )
      .subscribe((res) => {
        console.log({ res });
        this.wordsList = res.data
          .filter(
            (item: any) => item.level.toLowerCase() == this.type.toLowerCase()
          )
          .map((item: any) => item.Words);
        this.sharedService.isLoading = false;
        console.log('this.wordsList  = ', this.wordsList);
      });
  }
}
