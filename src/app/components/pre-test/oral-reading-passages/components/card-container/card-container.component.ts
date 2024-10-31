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

@Component({
  selector: 'app-card-container',
  standalone: true,
  imports: [
    CommonModule,
    IconDirective,
    IconModule,
    MatIcon,
    ButtonDirective,
    InputGroupComponent,
    FormModule,
  ],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss',
})
export class CardContainerComponent implements OnInit {
  @Input() storyIndex: number = 0;

  storyQuestions: { questionList: string[] }[] = questionList;
  story: string[] = [];
  icons = { cilMic, cilVolumeHigh, cilVolumeLow, cilVolumeOff };
  private intervalId: any;
  totalLength = 0;
  startFrom = 0;
  showVolumIcon = false;

  showCircle = false;
  showQuaterCircle = true;
  currentIndex = 0;
  itemsCopy: any = [];
  answerCopy: any = [];
  showQuestions = false;
  question = '';
  expectedAnswer = '';
  voiceAnswer = '';
  // qestionList = [
  //   'Who is the story about?',
  //   'What can Roy do?',
  //   'What do they have?',
  //   'Where can he play with the bat and the ball? ',
  // ];

  constructor(public accuracyService: SpeechDetectService) {}
  ngOnInit(): void {
    this.story = storyList[this.storyIndex].story;
    this.totalLength = storyList.length;
    this.startFrom = this.storyIndex;
  }
  onClickReadyBtn() {
    this.showQuestions = true;
    this.startFrom = this.startFrom + 1;
    this.story = storyList[this.storyIndex].story;
    // this.showCircleAnimation();
    this.startRandomSelection();
  }
  showCircleAnimation() {
    this.showCircle = false;
    setTimeout(() => {
      this.showCircle = true;
    }, 50);
  }
  startRandomSelection() {
    // this.accuracyService.transcription = '';
    this.startFrom = 0;

    this.accuracyService.resultList = [];
    this.accuracyService.transcription = '';
    this.accuracyService.accuracyScore = 0;
    this.totalLength = this.storyQuestions[this.storyIndex].questionList.length;

    // Create a copy of the original array and shuffle it
    this.itemsCopy = this.storyQuestions[this.storyIndex].questionList;
    this.answerCopy = answerList[this.storyIndex].answerList;
    // this.shuffleArray(this.itemsCopy);

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
