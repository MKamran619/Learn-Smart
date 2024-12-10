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
export class CardContainerComponent implements OnInit, OnDestroy {
  @Input() charOrWordList: string[] = [];
  letter = '';
  icons = { cilMic, cilVolumeHigh, cilVolumeLow, cilVolumeOff };
  private intervalId: any;
  totalLength = 0;
  startFrom = 0;
  showVolumIcon = false;

  showCircle = false;
  showQuaterCircle = true;
  currentIndex: any = 0;
  itemsCopy: any = [];
  estimatedTime: any = 1;
  timeoutIds: number[] = [];

  constructor(public accuracyService: SpeechDetectService) {}
  ngOnInit(): void {
    console.log('Component initialized');
    this.startRandomSelection();
  }
  showQuaterCircleAnimation() {
    this.showQuaterCircle = true;
    setTimeout(() => {
      this.showQuaterCircle = false;
    }, 3000);
  }
  showCircleAnimation() {
    this.showCircle = false;
    setTimeout(() => {
      this.showCircle = true;
    }, 0);
  }

  startRandomSelection() {
    this.accuracyService.resultList = [];
    this.accuracyService.transcription = '';
    this.accuracyService.accuracyScore = 0;
    this.totalLength = this.charOrWordList.length;
    this.itemsCopy = [...this.charOrWordList];
    this.shuffleArray(this.itemsCopy);

    this.onCallAccuracyFunction();
  }

  onCallAccuracyFunction() {
    // this.accuracyService.stopRecording();
    this.showQuaterCircleAnimation();
    this.showCircle = false;

    if (this.letter) {
      const result = {
        letter: 'Letter ' + this.letter,
        noResponse: this.accuracyService.transcription ? '' : 'noResponse',
        userSpoke: this.accuracyService.transcription,
        accuracy: this.accuracyService.accuracyScore.toFixed(0),
      };
      this.letter = '';
      console.log('sing;e result = ', result);

      this.accuracyService.resultList.push(result);
    }
    if (this.currentIndex >= this.itemsCopy.length) {
      this.clearInterval();
      console.log('result = ', this.accuracyService.resultList);
      this.accuracyService.onShowResult = true;
      console.log('All items have been selected. Stopping random selection.');
      return;
    }
    this.startFrom = this.startFrom + 1;
    this.letter = this.itemsCopy[this.currentIndex];
    this.accuracyService.referenceText = `letter ${this.letter}`;
    if (this.showVolumIcon) {
      this.showQuaterCircle = true;
      this.accuracyService.speakText(this.accuracyService.referenceText);
    }

    // this.estimatedTime = this.accuracyService.calculateSpeakingTime(
    //   this.accuracyService.referenceText
    // );
    // const timeoutId = setTimeout(() => {
    this.onClickMicIcon();
    // }, this.estimatedTime * 1000) as unknown as number;
    // this.timeoutIds.push(timeoutId);

    this.currentIndex++;
  }
  onClickMicIcon() {
    this.showQuaterCircle = false;

    const timeoutId3 = setTimeout(() => {
      this.showCircleAnimation();
    }, 1000) as unknown as number;
    this.timeoutIds.push(timeoutId3);

    // this.accuracyService.startRecording(this.estimatedTime);
    // this.accuracyService.startSpeechRecognition();
    setTimeout(() => {
      this.accuracyService.startRecording(1);
    }, 700);

    const timeoutId = setTimeout(() => {
      // this.showCircle = false;
      // this.accuracyService.stopRecording();
    }, 1100) as unknown as number;
    this.timeoutIds.push(timeoutId);
    const timeoutId2 = setTimeout(() => {
      this.onCallAccuracyFunction();
    }, this.estimatedTime * 7000) as unknown as number;
    this.timeoutIds.push(timeoutId2);
  }

  private shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Clear all intervals
    this.clearInterval();

    // Clear timeouts
    this.timeoutIds.forEach((id) => clearTimeout(id));

    // Stop service operations
    // this.accuracyService.stopSpeechRecognition();

    // Prevent further recursive calls
    // this.isComponentActive = false;
  }
}
