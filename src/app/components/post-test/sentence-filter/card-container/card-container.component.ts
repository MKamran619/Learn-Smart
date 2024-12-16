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
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SpeechDetectService } from '../../../../services/speechDetect/speech-detect.service';
import { SharedService } from '../../../../services/sharedServices/shared.service';

@Component({
  selector: 'app-card-container',
  standalone: true,
  imports: [CommonModule, MatIconModule, IconModule],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss',
})
export class CardContainerComponent implements OnInit, OnDestroy {
  @Input() sentenceList: string[] = [];
  sentence = '';
  icons = { cilMic, cilVolumeHigh, cilVolumeLow, cilVolumeOff };
  private intervalId: any;
  totalLength = 0;
  startFrom = 1;
  showVolumIcon = false;

  showCircle = false;
  showQuaterCircle = true;
  currentIndex = 0;
  itemsCopy: any = [];

  transcription: string = '';
  referenceText: string = '';
  accuracyScore: number = 0;
  timeoutIds: number[] = [];
  isLoading = false;

  // levelList = [
  //   'pre-primer',
  //   'primer',
  //   'level-1',
  //   'level-2',
  //   'level-3',
  //   'level-4',
  //   'level-5',
  //   'level-6',
  // ];

  constructor(
    public accuracyService: SpeechDetectService,
    public sharedService: SharedService
  ) {}
  ngOnInit(): void {
    console.log('Component initialized');
    this.startRandomSelection();
  }

  startRandomSelection23() {
    this.accuracyService.resultList = [];
    this.accuracyService.transcription = '';
    this.accuracyService.accuracyScore = 0;
    this.totalLength = this.sentenceList.length;

    // Create a copy of the original array and shuffle it
    this.itemsCopy = [...this.sentenceList];
    // this.shuffleArray(itemsCopy);

    this.currentIndex = 0;

    this.onCallAccuracyFunction();

    this.intervalId = setInterval(() => {
      this.onCallAccuracyFunction();
    }, 10000);
  }

  showQuaterCircleAnimation() {
    this.showQuaterCircle = true;
  }
  showCircleAnimation() {
    this.showCircle = true;
  }

  startRandomSelection() {
    this.transcription = '';
    this.accuracyScore = 0;
    this.accuracyService.resultList = [];
    this.totalLength = this.sentenceList.length;
    this.itemsCopy = [...this.sentenceList];

    this.onCallAccuracyFunction();
  }

  onCallAccuracyFunction() {
    this.sentence = '';
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

    this.sentence = this.itemsCopy[this.currentIndex];
    this.referenceText = this.sentence;
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
        .startRecording(2)
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
    this.isLoading = true;
    this.showCircle = false;
    this.accuracyService.transcribeAudio(audioBlob).subscribe({
      next: (res) => {
        this.transcription = '';
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
    if (this.sentence) {
      const result = {
        sentence: this.sentence,
        noResponse: this.transcription ? '' : 'noResponse',
        userSpoke: this.transcription,
        accuracy: this.accuracyScore.toFixed(0),
        level: this.currentIndex,
      };
      console.log('sing;e result = ', result);

      this.accuracyService.resultList.push(result);

      this.currentIndex++;
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

  clearInterval() {
    // Clear the interval if it exists
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null; // Reset the intervalId to null
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
