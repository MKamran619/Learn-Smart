import { Component } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';

@Component({
  selector: 'app-post-sentence-filter',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './sentence-filter.component.html',
  styleUrl: './sentence-filter.component.scss',
})
export class SentenceFilterComponent {}
