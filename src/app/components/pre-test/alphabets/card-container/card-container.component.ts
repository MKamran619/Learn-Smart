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

  transcription: string = '';
  referenceText: string = '';
  accuracyScore: number = 0;

  constructor(
    public accuracyService: SpeechDetectService,
    public router: Router,
    private activatedRoute: ActivatedRoute
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
    // if (this.accuracyService.onShowResult) {
    //   this.accuracyService.onShowResult = false;
    // } else {
    this.router.navigate([`dashboard/pre-test/pre-alphabets`]);
    // }
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
    this.letterList = ['E', 'T', 'A', 'O', 'I', 'N', 'S', 'H', 'R', 'D'];
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
    this.currentIndex++;
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
    this.accuracyService.transcribeAudio(audioBlob).subscribe({
      next: (res) => {
        this.accuracyService.transcription = '';
        this.transcription = res.results.channels[0].alternatives[0].transcript;

        console.log('origonal = ', this.referenceText);
        console.log('spoken = ', this.transcription);

        this.accuracyScore = this.accuracyService.calculateAccuracy(
          this.referenceText,
          this.transcription
        );
        this.onCalculateResultTable();
      },
      error: (err) => {},
    });
  }
  onCalculateResultTable() {
    if (this.letter) {
      const result = {
        letter: 'Letter ' + this.letter,
        noResponse: this.transcription ? '' : 'noResponse',
        userSpoke: this.transcription,
        accuracy: this.accuracyScore.toFixed(0),
      };
      console.log('sing;e result = ', result);

      this.accuracyService.resultList.push(result);
    }
    this.startFrom += 1;

    this.onCallAccuracyFunction();
  }

  private shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // clearInterval() {
  //   if (this.intervalId) {
  //     clearInterval(this.intervalId);
  //     this.intervalId = null;
  //   }
  // }

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
