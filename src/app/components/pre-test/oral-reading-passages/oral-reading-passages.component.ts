import { Component } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';

@Component({
  selector: 'app-oral-reading-passages',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './oral-reading-passages.component.html',
  styleUrl: './oral-reading-passages.component.scss',
})
export class OralReadingPassagesComponent {}
