import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
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
import { SpeechDetectService } from '../../../../services/speechDetect/speech-detect.service';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../home/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultTableComponent } from '../result-table/result-table.component';
import { SharedService } from '../../../../services/sharedServices/shared.service';
import { Constants } from '../../../../constants';

@Component({
  selector: 'app-card-container',
  standalone: true,
  imports: [
    CommonModule,
    IconDirective,
    IconModule,
    MatIcon,
    HeaderComponent,
    ResultTableComponent,
  ],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss',
})
export class CardContainerComponent implements OnInit, OnDestroy {
  letterList: string[] = [];
  letter = '';
  icons = { cilMic, cilArrowLeft, cilVolumeHigh, cilVolumeLow, cilVolumeOff };
  private intervalId: any;
  totalLength = 0;
  startFrom = 1;
  showVolumIcon = false;
  title = '';

  showCircle = false;
  showQuaterCircle = true;
  currentIndex: any = 0;
  itemsCopy: any = [];
  estimatedTime: any = 1;
  timeoutIds: number[] = [];
  isLoading = false;

  transcription: string = '';
  referenceText: string = '';
  accuracyScore: number = 0;
  retryLimitCount = 1;

  constructor(
    public accuracyService: SpeechDetectService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.accuracyService.stopPreviousRecording();
      const type = params.get('type');
      if (type == 'capital-letters') {
        this.onClickCapitalLetter();
      } else {
        this.onClickCommonLetter();
      }

      // You can now use the 'mode' and 'type' values as needed
    });
    console.log('Component initialized');
    this.clearAllTimers();
    this.startRandomSelection();
  }
  onChangePreviewMode() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([`dashboard/post-test/post-alphabets`]);
    }, 2000);
  }
  onClickCapitalLetter() {
    this.accuracyService.stopPreviousRecording();
    this.accuracyService.resultList = [];
    this.accuracyService.accuracyScore = 0;
    this.accuracyService.transcription = '';
    // this.btnCapitalActive = true;
    this.title = 'Capital Letter';
    this.letterList = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i)
    );
  }
  onClickCommonLetter() {
    this.accuracyService.stopPreviousRecording();
    this.accuracyService.resultList = [];
    this.accuracyService.accuracyScore = 0;
    this.accuracyService.transcription = '';
    // this.btnCapitalActive = false;
    this.title = 'Common Letter';
    this.letterList = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(97 + i)
    );
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
    this.totalLength = this.letterList.length;
    this.itemsCopy = [...this.letterList];
    this.shuffleArray(this.itemsCopy);

    this.onCallAccuracyFunction();
  }

  onCallAccuracyFunction() {
    this.letter = '';
    this.transcription = '';
    this.referenceText = '';
    // this.accuracyService.stopRecording();
    this.showQuaterCircleAnimation();
    this.showCircle = false;

    if (this.currentIndex >= this.itemsCopy.length) {
      // this.clearInterval();
      this.clearAllTimers();
      this.accuracyService.onShowResult = true;
      console.log('All items have been selected. Stopping random selection.');
      return;
    }

    this.letter = this.itemsCopy[this.currentIndex];
    this.referenceText = `letter ${this.letter}`;
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
    }, 1500) as unknown as number;
    this.timeoutIds.push(timeoutId3);

    const timeoutId4 = setTimeout(() => {
      this.accuracyService
        .startRecording(1.2)
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
        this.transcription = '';
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
          const message = 'Network error detected. Please repeat the letter.';
          this.sharedService.openCustomSnackBar(message, 'alert');
          this.onCallAccuracyFunction();
        } else {
          this.onCallRetryLimit();
        }
      },
    });
  }
  onCalculateResultTable() {
    if (this.letter) {
      if ((this.title = 'Capital Letter')) {
        this.letter = 'LETTER ' + this.letter;
        this.transcription = this.transcription.toUpperCase();
      } else {
        this.letter = 'letter ' + this.letter;
        this.transcription = this.transcription.toLowerCase();
      }
      const result = {
        letter: this.letter,
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

  onCallRetryLimit() {
    if (this.retryLimitCount <= Constants.totalRetryLimit) {
      this.retryLimitCount++;
      const message = 'No detection found. Please repeat the letter.';
      this.sharedService.openCustomSnackBar(message, 'warning');
      this.onCallAccuracyFunction();
      this.isLoading = false;
    } else {
      const message =
        'Try limit exceeded. Please restart the level to continue.';
      this.sharedService.openCustomSnackBar(message, 'alert');
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate([`dashboard/post-test/post-alphabets`]);
      }, 2000);
    }
  }

  private shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
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
