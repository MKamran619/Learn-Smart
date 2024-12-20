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
import { SpeechDetectService } from '../../../../../services/speechDetect/speech-detect.service';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../../../services/sharedServices/shared.service';
import { Constants } from '../../../../../constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-container',
  standalone: true,
  imports: [CommonModule, IconDirective, IconModule, MatIcon],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss',
})
export class CardContainerComponent implements OnInit, OnDestroy {
  @Input() wordList: string[] = [];

  @Input() totalCount = 10;
  word = '';
  icons = { cilMic, cilVolumeHigh, cilVolumeLow, cilVolumeOff };
  private intervalId: any;
  totalLength = 0;
  startFrom = 1;
  showVolumIcon = false;

  showCircle = false;
  showQuaterCircle = true;
  currentIndex = 0;
  itemsCopy: any[] = [];
  timeoutIds: number[] = [];

  transcription: string = '';
  referenceText: string = '';
  accuracyScore: number = 0;
  isLoading = false;
  retryLimitCount = 1;

  constructor(
    public accuracyService: SpeechDetectService,
    public sharedService: SharedService,
    public router: Router
  ) {}
  ngOnInit(): void {
    console.log('Component initialized, inn ', this.wordList[0]);
    this.clearAllTimers();
    this.startRandomSelection();
  }

  onClickMicIcon() {
    this.showQuaterCircle = false;

    const timeoutId3 = setTimeout(() => {
      this.showCircleAnimation();
    }, 1500) as unknown as number;
    this.timeoutIds.push(timeoutId3);

    this.accuracyService.startRecording(1);

    const timeoutId = setTimeout(() => {
      this.showCircle = false;
      // this.accuracyService.stopRecording();
    }, 1100) as unknown as number;
    this.timeoutIds.push(timeoutId);
    const timeoutId2 = setTimeout(() => {
      this.onCallAccuracyFunction();
    }, 7000) as unknown as number;
    this.timeoutIds.push(timeoutId2);
  }
  private shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  showQuaterCircleAnimation() {
    this.showQuaterCircle = true;
  }
  showCircleAnimation() {
    this.showCircle = true;
  }

  startRandomSelection() {
    this.accuracyService.resultList = [];
    this.transcription = '';
    this.accuracyScore = 0;
    this.totalLength = this.wordList[0].length;
    this.itemsCopy = [...this.wordList[0]];
    this.shuffleArray(this.itemsCopy);

    this.onCallAccuracyFunction();
  }

  onCallAccuracyFunction() {
    this.word = '';
    this.transcription = '';
    this.referenceText = '';
    // this.accuracyService.stopRecording();
    this.showQuaterCircleAnimation();
    this.showCircle = false;

    if (this.currentIndex >= this.totalCount) {
      // this.clearInterval();
      this.clearAllTimers();
      this.accuracyService.onShowResult = true;
      console.log('All items have been selected. Stopping random selection.');
      return;
    }

    this.word = this.itemsCopy[this.currentIndex];
    this.referenceText = this.word;
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
    }, 1000) as unknown as number;
    this.timeoutIds.push(timeoutId3);

    const timeoutId4 = setTimeout(() => {
      this.accuracyService
        .startRecording(1)
        .then((audioBlob) => {
          this.handleRecordedAudio(audioBlob);
        })
        .catch((error) => {
          console.error('Error during recording:', error);
        });
    }, 700) as unknown as number;
    this.timeoutIds.push(timeoutId4);
  }
  handleRecordedAudio(audioBlob: Blob) {
    this.showCircle = false;
    this.isLoading = true;
    this.accuracyService.transcribeAudio(audioBlob).subscribe({
      next: (res) => {
        this.accuracyService.transcription = '';
        this.transcription = res.results.channels[0].alternatives[0].transcript;
        if (this.transcription) {
          this.accuracyScore = this.accuracyService.calculateAccuracy(
            this.referenceText,
            this.transcription
          );

          this.isLoading = false;
          this.onCalculateResultTable();
        } else {
          this.onCallRetryLimit();
        }
      },
      error: (err) => {
        if (this.retryLimitCount <= Constants.totalRetryLimit) {
          this.retryLimitCount++;
          this.isLoading = false;
          const message = 'Network error detected. Please repeat the word.';
          this.sharedService.openCustomSnackBar(message, 'alert');
          this.onCallAccuracyFunction();
        } else {
          this.onCallRetryLimit();
        }
      },
    });
  }

  onCalculateResultTable() {
    if (this.word) {
      const result = {
        word: this.word,
        noResponse: this.transcription ? '' : 'noResponse',
        userSpoke: this.transcription,
        accuracy: this.accuracyScore.toFixed(0),
        level: this.currentIndex,
      };

      this.retryLimitCount = 1;
      this.accuracyService.resultList.push(result);
    }
    this.currentIndex++;
    this.startFrom += 1;

    this.onCallAccuracyFunction();
  }
  onCallRetryLimit() {
    if (this.retryLimitCount <= Constants.totalRetryLimit) {
      this.retryLimitCount++;
      const message = 'No detection found. Please repeat the word.';
      this.sharedService.openCustomSnackBar(message, 'warning');
      this.onCallAccuracyFunction();
      this.isLoading = false;
    } else {
      const message =
        'Try limit exceeded. Please restart the level to continue.';
      this.sharedService.openCustomSnackBar(message, 'alert');
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate([`dashboard/post-test/post-word-list`]);
      }, 2000);
    }
  }
  ngOnDestroy(): void {
    console.log('Component destroyed, clearing intervals and timeouts');
    this.clearAllTimers();
    this.accuracyService.stopPreviousRecording();
  }
  clearAllTimers(): void {
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds = [];
  }
}
