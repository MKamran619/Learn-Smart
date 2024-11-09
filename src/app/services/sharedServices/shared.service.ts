import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  isLoading = false;
  activeLink = 'home';
  preWordListActive = false;
  preOralActive = false;
  preInventoryActive = false;
  preMultipleActive = false;

  postWordListActive = false;
  postOralActive = false;
  postInventoryActive = false;
  postMultipleActive = false;

  storiesConfig: any;

  constructor() {}

  transformSentence(value: string, chunkSize: number = 10): string[] {
    if (!value) return [];
    const words = value.split(' ');
    const chunks = [];

    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }

    return chunks;
  }
}
