import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  cilMic,
  cilVolumeHigh,
  cilVolumeLow,
  cilVolumeOff,
  cilArrowLeft,
} from '@coreui/icons';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {
  ButtonDirective,
  InputGroupComponent,
  FormModule,
} from '@coreui/angular';
import { SpeechDetectService } from '../../../../../services/speechDetect/speech-detect.service';
import { storyList, answerList, questionList } from '../storyList';
import { finalize } from 'rxjs';
import { SharedService } from '../../../../../services/sharedServices/shared.service';
import { ApiService } from '../../../../../services/apiServices/api.service';
import { HeaderComponent } from '../../../../../home/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultTableComponent } from '../result-table/result-table.component';

@Component({
  selector: 'app-card-container',
  standalone: true,
  imports: [
    CommonModule,
    IconDirective,
    IconModule,
    ButtonDirective,
    FormModule,
    HeaderComponent,
    ResultTableComponent,
    MatIconModule,
  ],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss',
})
export class CardContainerComponent implements OnInit {
  @Input() storyIndex: number = 0;

  // storyQuestions: { questionList: string[] }[] = questionList;
  story: string[] = [];
  icons = { cilMic, cilVolumeHigh, cilArrowLeft, cilVolumeLow, cilVolumeOff };
  private intervalId: any;
  totalCountOfStory = 0;
  totalCountOfQuestions = 0;
  startFrom = 0;
  showVolumIcon = false;
  storyTitle = '';

  showCircle = false;
  showQuaterCircle = true;
  currentIndex = 0;
  itemsCopy: any = [];
  answerCopy: any = [];
  showQuestions = false;
  question = '';
  expectedAnswer = '';

  questionsList!: string[];
  expectedAnswersList!: string[];
  voiceAnswer = '';

  transcription: string = '';
  referenceText: string = '';
  accuracyScore: number = 0;
  isLoading = false;

  onShowResult = false;

  timeoutIds: number[] = [];
  type = '';
  title = '';

  constructor(
    public accuracyService: SpeechDetectService,
    public apiService: ApiService,
    public sharedService: SharedService,
    public router: Router,
    public activeRouter: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.sharedService.isLoading = false;
    this.checkIndexAndGetLevelRecord();
  }
  checkIndexAndGetLevelRecord() {
    this.activeRouter.params.subscribe((params) => {
      {
        this.type = params['type'];
      }
    });
    this.title = this.sharedService.transformValue(this.type);

    if (this.type == 'pre-primer') {
      // this.currentIndex = 0;
      this.storyIndex = 0;
    }
    if (this.type == 'primer') {
      // this.currentIndex = 1;
      this.storyIndex = 1;
    }
    if (this.type == 'level-1') {
      // this.currentIndex = 2;
      this.storyIndex = 2;
    }
    if (this.type == 'level-2') {
      // this.currentIndex = 3;
      this.storyIndex = 3;
    }
    if (this.type == 'level-3') {
      // this.currentIndex = 4;
      this.storyIndex = 4;
    }
    if (this.type == 'level-4') {
      // this.currentIndex = 5;
      this.storyIndex = 5;
    }
    if (this.type == 'level-5') {
      // this.currentIndex = 6;
      this.storyIndex = 6;
    }
    if (this.type == 'level-6') {
      // this.currentIndex = 7;
      this.storyIndex = 7;
    }

    this.onGetFilterSentence();
  }
  onGetFilterSentence() {
    this.accuracyService.resultList = [];
    this.accuracyService.accuracyScore = 0;
    this.accuracyService.transcription = '';

    if (this.sharedService.storiesConfig) {
      this.sharedService.isLoading = false;

      this.isLoading = false;
      this.setStoryData(this.sharedService.storiesConfig);
    } else {
      // this.sharedService.isLoading = true;

      this.isLoading = true;
      this.apiService
        .GetOralReadingPassagesList()
        .pipe(
          finalize(() => {
            // this.sharedService.isLoading = false;

            this.isLoading = false;
          })
        )
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            console.log({ res });
            this.sharedService.storiesConfig = res;
            this.setStoryData(res);
          },
          error: (err) => {
            const errMessage = 'Some Error. Please try again!';
            this.sharedService.openCustomSnackBar(errMessage, 'alert');
          },
        });
    }
  }

  setStoryData(res: any) {
    // this.sharedService.isLoading = false;
    this.isLoading = false;
    this.startFrom = this.storyIndex + 1;
    this.totalCountOfStory = res.meta.pagination.total;

    const storyData = res.data.find(
      (item: any, index: number) => index === this.storyIndex
    );
    this.story = storyData.story
      .replace(/\n/g, ' ')
      .split(/\. +|\. *$/)
      .filter((sentence: string) => sentence.trim())
      .map((sentence: string) => sentence.trim() + '.');

    this.storyTitle = storyData.title;
    this.questionsList = storyData.QuestionAnswer.map(
      (item: any) => item.question
    );
    this.expectedAnswersList = storyData.QuestionAnswer.map(
      (item: any) => item.expectedAnswer
    );
    this.totalCountOfQuestions = this.questionsList.length;
  }
  onClickReadyBtn() {
    this.showQuestions = true;
    this.startFrom = 1;
    this.story = storyList[this.storyIndex].story;
    this.startQuestionSession();
  }
  showCircleAnimation() {
    this.showCircle = false;
    setTimeout(() => {
      this.showCircle = true;
    }, 50);
  }

  startQuestionSession() {
    // this.startFrom = 0;

    this.accuracyService.resultList = [];
    this.accuracyService.transcription = '';
    this.accuracyService.accuracyScore = 0;
    this.itemsCopy = this.questionsList;
    this.answerCopy = this.expectedAnswersList;

    this.onCallAccuracyFunction();

    // this.intervalId = setInterval(() => {
    //   this.onCallAccuracyFunction();
    // }, 5000);
  }
  // onCallAccuracyFunction12() {
  //   this.showCircleAnimation();
  //   if (this.currentIndex >= this.itemsCopy.length) {
  //     this.clearInterval();
  //     this.showCircle = false;
  //     console.log('result = ', this.accuracyService.resultList);
  //     this.onShowResult = true;
  //     console.log('All items have been selected. Stopping selection.');
  //     return;
  //   }
  //   this.startFrom = this.startFrom + 1;
  //   this.question = this.itemsCopy[this.currentIndex];
  //   this.expectedAnswer = this.answerCopy[this.currentIndex];
  //   this.accuracyService.referenceText = this.question;
  //   if (this.showVolumIcon) {
  //     this.showQuaterCircle = true;
  //     // this.showQuaterCircleAnimation();
  //     this.accuracyService.speakText(this.accuracyService.referenceText);
  //   }

  //   this.accuracyService.startSpeechRecognition();

  //   // this.currentIndex++;
  // }
  onCallAccuracyFunction() {
    this.expectedAnswer = '';
    this.transcription = '';
    this.referenceText = '';
    // this.accuracyService.stopRecording();
    // this.showQuaterCircleAnimation();
    this.showCircle = false;

    if (this.currentIndex >= this.itemsCopy.length) {
      // this.clearInterval();

      this.clearAllTimers();
      this.onShowResult = true;
      console.log('All items have been selected. Stopping random selection.');
      return;
    }
    // this.startFrom = this.startFrom + 1;
    this.question = this.itemsCopy[this.currentIndex];
    this.expectedAnswer = this.answerCopy[this.currentIndex];
    // this.accuracyService.referenceText = this.question;
    this.referenceText = this.answerCopy[this.currentIndex];

    if (this.showVolumIcon) {
      this.showQuaterCircle = true;
      this.accuracyService.speakText(this.referenceText);
    }
    // this.currentIndex++;
    this.onCallRecorderFunction();
  }

  onCallRecorderFunction() {
    this.showQuaterCircle = false;

    const timeoutId3 = setTimeout(() => {
      this.showCircleAnimation();
    }, 3500) as unknown as number;
    this.timeoutIds.push(timeoutId3);

    const timeoutId4 = setTimeout(() => {
      this.accuracyService
        .startRecording(1.5)
        .then((audioBlob) => {
          this.handleRecordedAudio(audioBlob);
        })
        .catch((error) => {
          console.error('Error during recording:', error);
        });
    }, 3000) as unknown as number;
    this.timeoutIds.push(timeoutId4);
  }
  handleRecordedAudio(audioBlob: Blob) {
    this.showCircle = false;
    this.isLoading = true;
    this.accuracyService.transcribeAudio(audioBlob).subscribe({
      next: (res) => {
        // this.accuracyService.transcription = '';
        this.transcription = res.results.channels[0].alternatives[0].transcript;

        this.accuracyScore = this.accuracyService.calculateAccuracy(
          this.referenceText,
          this.transcription
        );

        this.isLoading = false;
        this.onCalculateResultTable();
      },
      error: (err) => {
        this.isLoading = false;
        const message = 'please try again';
        this.sharedService.openCustomSnackBar(message, 'alert');
        this.onCallAccuracyFunction();
      },
    });
  }
  onCalculateResultTable() {
    if (this.question) {
      const result = {
        question: this.question,
        expectedAnswer: this.expectedAnswer,
        noResponse: this.transcription ? '' : 'noResponse',
        userSpoke: this.transcription,
        accuracy: this.accuracyScore.toFixed(0),
      };

      this.accuracyService.resultList.push(result);
    }
    this.currentIndex++;
    this.startFrom += 1;

    this.onCallAccuracyFunction();
  }

  onChangePreviewMode() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([`dashboard/post-test/post-oral-reading-passages`]);
    }, 3500);
  }

  clearInterval() {
    // Clear the interval if it exists
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null; // Reset the intervalId to null
    }
  }
  clearAllTimers(): void {
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds = [];
  }
  ngOnDestroy() {
    // Clear interval on component destruction to prevent memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
