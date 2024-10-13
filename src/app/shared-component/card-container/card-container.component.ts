import { Component, Input } from '@angular/core';
import { cilMic, cilVolumeHigh } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-card-container',
  standalone: true,
  imports: [IconDirective],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss',
})
export class CardContainerComponent {
  @Input() letter: string = '';
  icons = { cilMic, cilVolumeHigh };
}
