import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private snackbar: MatSnackBar) {}

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

    const result = this.levelsConfig?.userLevelEntries?.find(
      (item: any) => item?.level_name?.level_ID == levelId
    )?.isActive;

    return result;
  }
  getUserConfig() {
    if (!this.userConfig) {
      const data = localStorage.getItem('userConfig') || '';
      this.userConfig = JSON.parse(data);
      return this.userConfig;
    } else {
      return this.userConfig;
    }
  }
  openCustomSnackBar(message: string, type: 'success' | 'alert' | 'warning') {
    const snackBarRef = this.snackbar.open(message, 'X', {
      duration: 8000,
      panelClass: [
        type == 'success'
          ? 'success-snackbar'
          : type == 'alert'
          ? 'alert-snackbar'
          : 'warning-snackbar',
      ],
    });

    snackBarRef.afterOpened().subscribe(() => {
      const actionButton = document.querySelector('.mat-mdc-snack-bar-action');
      if (actionButton) {
        actionButton.innerHTML = `<span class="material-icons">close</span>`;
      }
    });
  }
  transformValue(value: string): string {
    if (!value) {
      return value;
    }

    // Split the sentence into words
    const words = value.split(' ');

    // Transform each word: replace hyphens and capitalize first letters
    const transformedWords = words.map((word) => {
      return word
        .replace(/-/g, ' ') // Replace hyphens with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
    });

    // Join the transformed words back into a sentence
    return transformedWords.join(' ');
  }
}
