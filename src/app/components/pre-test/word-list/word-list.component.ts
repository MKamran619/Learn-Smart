import { Component } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';

@Component({
  selector: 'app-word-list',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.scss',
})
export class WordListComponent {}
