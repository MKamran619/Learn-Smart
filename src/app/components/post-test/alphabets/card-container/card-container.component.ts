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
import { SpeechDetectService } from '../../../../services/speechDetect/speech-detect.service';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-container',
  standalone: true,
  imports: [CommonModule, IconDirective, IconModule, MatIcon],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss',
})
export class CardContainerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() charOrWordList: string[] = [];
  letter = '';
  icons = { cilMic, cilVolumeHigh, cilVolumeLow, cilVolumeOff };
  private intervalId: any;
  totalLength = 0;
  startFrom = 0;
  showVolumIcon = true;

  showCircle = false;
  showQuaterCircle = true;

  constructor(public accuracyService: SpeechDetectService) {}
  ngOnInit(): void {
    console.log('Component initialized');
    this.startRandomSelection();
  }
  showQuaterCircleAnimation() {
    this.showQuaterCircle = true;
    setTimeout(() => {
      this.showQuaterCircle = false;
    }, 1500);
  }
  showCircleAnimation() {
    this.showCircle = false;
    setTimeout(() => {
      this.showCircle = true;
    }, 50);
  }
  ngAfterViewInit(): void {
    // this.startRandomSelection();
  }
  startRandomSelection() {
    this.accuracyService.resultList = [];
    this.accuracyService.transcription = '';
    this.accuracyService.accuracyScore = 0;
    this.totalLength = this.charOrWordList.length;

    // Create a copy of the original array and shuffle it
    const itemsCopy = [...this.charOrWordList];
    this.shuffleArray(itemsCopy);

    let currentIndex = 0;

    this.intervalId = setInterval(() => {
      this.showCircleAnimation();
      this.showQuaterCircleAnimation();

      if (this.letter) {
        const result = {
          letter: this.letter,
          noResponse: this.accuracyService.transcription ? '' : 'noResponse',
          userSpoke: this.accuracyService.transcription,
          accuracy: this.accuracyService.accuracyScore.toFixed(0),
        };

        this.accuracyService.resultList.push(result);
      }
      if (currentIndex >= itemsCopy.length) {
        this.clearInterval();
        console.log('result = ', this.accuracyService.resultList);
        this.accuracyService.onShowResult = true;
        console.log('All items have been selected. Stopping random selection.');
        return;
      }
      this.startFrom = this.startFrom + 1;
      this.letter = itemsCopy[currentIndex];
      this.accuracyService.referenceText = `letter ${this.letter}`;
      if (this.showVolumIcon) {
        this.showQuaterCircle = true;
        // this.showQuaterCircleAnimation();
        this.accuracyService.speakText(this.accuracyService.referenceText);
      }

      this.accuracyService.startSpeechRecognition();

      currentIndex++;
    }, 5000);
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
  ngOnDestroy() {
    // Clear interval on component destruction to prevent memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
// <button (click)="accuracyService.startSpeechRecognition()">
//   Start Speech Recognition
// </button>

// <p><strong>Transcribed Text:</strong> {{ accuracyService.transcription }}</p>
// <p><strong>Accuracy Score:</strong> {{ accuracyService.accuracyScore }}%</p>
