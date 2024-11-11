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
  levelsConfig: any;
  userConfig: any;

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

  hasAuthentication(levelId: number) {
    // if (!this.userConfig) {
    //   const data = localStorage.getItem('userConfig') || '';
    //   this.userConfig = JSON.parse(data);
    // }
    if (!this.levelsConfig) {
      const data = localStorage.getItem('levelConfig') || '';
      this.levelsConfig = JSON.parse(data);
    }

    const result = this.levelsConfig.userLevelEntries.find(
      (item: any) => item.level_name.level_ID == levelId
    )?.isActive;
    console.log('result = ', result);

    return result;
  }
}
