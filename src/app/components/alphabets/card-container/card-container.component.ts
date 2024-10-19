import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { cilMic, cilVolumeHigh } from '@coreui/icons';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { SpeechDetectService } from '../../../services/speechDetect/speech-detect.service';
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
  icons = { cilMic, cilVolumeHigh };
  private intervalId: any;
  totalLength = 0;
  startFrom = 0;

  constructor(public accuracyService: SpeechDetectService) {}
  ngOnInit(): void {
    console.log('Component initialized');
    this.startRandomSelection();
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
      if (this.letter) {
        const result = {
          letter: this.letter,
          noResponse: this.accuracyService.transcription ? '' : 'noResponse',
          letterSubstituted: this.accuracyService.transcription,
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

      this.accuracyService.speakText(this.accuracyService.referenceText);
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

  startRandomSelection12() {
    this.totalLength = this.charOrWordList.length;

    const itemsCopy = [...this.charOrWordList];

    this.intervalId = setInterval(() => {
      if (itemsCopy.length === 0) {
        // All items have been used, stop the selection process
        this.clearInterval();
        console.log('All items have been selected. Stopping random selection.');
        return; // Exit the function
      }
      this.startFrom = this.startFrom + 1;
      // Randomly select an index from the remaining items
      const randomIndex = Math.floor(Math.random() * itemsCopy.length);
      this.letter = itemsCopy[randomIndex]; // Assign the random item
      this.accuracyService.referenceText = `letter ${this.letter}`; // Update reference text

      // Speak the reference text
      this.accuracyService.speakText(this.accuracyService.referenceText);

      // Remove the selected item from the array to prevent repetition
      itemsCopy.splice(randomIndex, 1);
    }, 3500); // Change every 5 seconds
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
