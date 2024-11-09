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
} from '@coreui/icons';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { MatIcon } from '@angular/material/icon';
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

@Component({
  selector: 'app-card-container',
  standalone: true,
  imports: [
    CommonModule,
    IconDirective,
    IconModule,
    ButtonDirective,
    FormModule,
  ],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss',
})
export class CardContainerComponent implements OnInit {
  @Input() storyIndex: number = 0;

  // storyQuestions: { questionList: string[] }[] = questionList;
  story: string[] = [];
  icons = { cilMic, cilVolumeHigh, cilVolumeLow, cilVolumeOff };
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

  constructor(
    public accuracyService: SpeechDetectService,
    public apiService: ApiService,
    public sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.onGetFilterSentence();
  }
  onGetFilterSentence() {
    this.accuracyService.resultList = [];
    this.accuracyService.accuracyScore = 0;
    this.accuracyService.transcription = '';

    if (this.sharedService.storiesConfig) {
      console.log('i am in', this.sharedService.storiesConfig);
      // this.sharedService.isLoading = false;
      this.setStoryData(this.sharedService.storiesConfig);
    } else {
      this.sharedService.isLoading = true;
      this.apiService
        .GetOralReadingPassagesList()
        .pipe(
          finalize(() => {
            this.sharedService.isLoading = false;
          })
        )
        .subscribe((res) => {
          console.log({ res });
          this.sharedService.storiesConfig = res;
          this.setStoryData(res);
        });
    }
  }
  setStoryData(res: any) {
    // this.sharedService.isLoading = false;
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
    this.startFrom = this.startFrom + 1;
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
    this.startFrom = 0;

    this.accuracyService.resultList = [];
    this.accuracyService.transcription = '';
    this.accuracyService.accuracyScore = 0;
    this.itemsCopy = this.questionsList;
    this.answerCopy = this.expectedAnswersList;

    this.onCallAccuracyFunction();

    this.intervalId = setInterval(() => {
      this.onCallAccuracyFunction();
    }, 5000);
  }
  onCallAccuracyFunction() {
    this.showCircleAnimation();

    if (this.question) {
      const result = {
        expectedAnswer: this.expectedAnswer,
        noResponse: this.accuracyService.transcription ? '' : 'noResponse',
        userSpoke: this.accuracyService.transcription,
        accuracy: this.accuracyService.accuracyScore.toFixed(0),
      };

      this.accuracyService.resultList.push(result);
    }
    if (this.currentIndex >= this.itemsCopy.length) {
      this.clearInterval();
      this.showCircle = false;
      console.log('result = ', this.accuracyService.resultList);
      this.accuracyService.onShowResult = true;
      console.log('All items have been selected. Stopping random selection.');
      return;
    }
    this.startFrom = this.startFrom + 1;
    this.question = this.itemsCopy[this.currentIndex];
    this.expectedAnswer = this.answerCopy[this.currentIndex];
    this.accuracyService.referenceText = this.question;
    if (this.showVolumIcon) {
      this.showQuaterCircle = true;
      // this.showQuaterCircleAnimation();
      this.accuracyService.speakText(this.accuracyService.referenceText);
    }

    this.accuracyService.startSpeechRecognition();

    this.currentIndex++;
  }

  clearInterval() {
    // Clear the interval if it exists
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null; // Reset the intervalId to null
    }
  }
  ngOnDestroy() {
    // Clear interval on component destruction to prevent memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
