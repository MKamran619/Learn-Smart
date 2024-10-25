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
import { ButtonDirective } from '@coreui/angular';
import { SpeechDetectService } from '../../../../../services/speechDetect/speech-detect.service';

@Component({
  selector: 'app-card-container',
  standalone: true,
  imports: [CommonModule, IconDirective, IconModule, MatIcon, ButtonDirective],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss',
})
export class CardContainerComponent implements OnInit {
  @Input() storyList: { story: string[] }[] = [];
  story: string[] = [];
  icons = { cilMic, cilVolumeHigh, cilVolumeLow, cilVolumeOff };
  private intervalId: any;
  totalLength = 0;
  startFrom = 1;
  showVolumIcon = false;

  showCircle = false;
  showQuaterCircle = true;
  currentIndex = 0;
  itemsCopy: any = [];

  constructor(public accuracyService: SpeechDetectService) {}
  ngOnInit(): void {
    this.story = this.storyList[this.startFrom].story;
    this.totalLength = this.storyList.length;
  }
  onClickReadyBtn() {
    this.startFrom = this.startFrom + 1;
    this.story = this.storyList[this.startFrom].story;
  }
}
