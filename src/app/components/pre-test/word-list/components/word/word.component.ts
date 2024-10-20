import { Component, OnInit, ViewChild } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { cilArrowLeft } from '@coreui/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../../home/header/header.component';
import { CardContainerComponent } from '../card-container/card-container.component';
import { SpeechDetectService } from '../../../../../services/speechDetect/speech-detect.service';
import { ResultTableComponent } from '../result-table/result-table.component';

@Component({
  selector: 'app-word',
  standalone: true,
  imports: [
    HeaderComponent,
    CardContainerComponent,
    IconDirective,
    FormsModule,
    CommonModule,
    ResultTableComponent,
  ],
  templateUrl: './word.component.html',
  styleUrl: './word.component.scss',
})
export class WordComponent implements OnInit {
  @ViewChild(CardContainerComponent) childComponent!: CardContainerComponent;

  icons = { cilArrowLeft };
  mode = '';
  type = '';
  btnCapitalActive = true;
  selectedTab = 'Capital Letter';
  wordsList: string[] = [];
  title = '';
  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    public accuracyService: SpeechDetectService
  ) {}

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params) => {
      {
        this.mode = params['mode'];
        this.type = params['type'];
      }
    });
    this.onLoadInitialData();
    this.title = this.transformValue(this.type);
  }

  onLoadInitialData() {
    this.accuracyService.resultList = [];
    this.accuracyService.accuracyScore = 0;
    this.accuracyService.transcription = '';
    this.btnCapitalActive = false;
    this.selectedTab = 'Common Letter';
    this.setWordList();
  }
  onChangePreviewMode(mode: string) {
    if (this.accuracyService.onShowResult) {
      this.accuracyService.onShowResult = false;
    } else {
      this.router.navigate([`dashboard/${mode}/pre-word-list`]);
    }
  }
  setWordList() {
    if (this.type == 'pre-primer') {
      this.wordsList = [
        'A',
        'AND',
        'AWAY',
        'BIG',
        'BLUE',
        'CAN',
        'COME',
        'DOWN',
        'FIND',
        'FOR',
        'FUNNY',
        'GO',
        'HELP',
        'HERE',
        'I',
        'IN',
        'IS',
        'IT',
        'JUMP',
        'LITTLE',
        'LOOK',
        'MAKE',
        'ME',
        'MY',
        'NOT',
        'ONE',
        'PLAY',
        'RED',
        'RUN',
        'SAID',
        'SEE',
        'THE',
        'THREE',
        'TO',
        'TWO',
        'UP',
        'WE',
        'WHERE',
        'YELLOW',
        'YOU',
      ];
    } else if (this.type == 'primer') {
      this.wordsList = [
        'all',
        'am',
        'are',
        'at',
        'ate',
        'be',
        'black',
        'brown',
        'but',
        'came',
        'did',
        'do',
        'eat',
        'four',
        'get',
        'good',
        'have',
        'he',
        'into',
        'like',
        'must',
        'new',
        'no',
        'now',
        'on',
        'our',
        'out',
        'please',
        'pretty',
        'ran',
        'ride',
        'saw',
        'say',
        'she',
        'so',
        'soon',
        'that',
        'there',
        'they',
        'this',
        'Too',
        'under',
        'want',
        'was',
        'well',
        'went',
        'what',
        'white',
        'who',
        'will',
        'yes',
      ];
    } else if (this.type == 'level-1') {
      this.wordsList = [
        'after',
        'again',
        'an',
        'any',
        'ask',
        'as',
        'by',
        'could',
        'every',
        'fly',
        'from',
        'give',
        'going',
        'had',
        'has',
        'her',
        'him',
        'his',
        'how',
        'just',
        'know',
        'let',
        'live',
        'may',
        'of',
        'old',
        'once',
        'open',
        'over',
        'put',
        'round',
        'some',
        'stop',
        'take',
        'thank',
        'them',
        'then',
        'think',
        'walk',
        'were',
        'When',
      ];
    } else if (this.type == 'level-2') {
      this.wordsList = [
        'always',
        'around',
        'because',
        'been',
        'before',
        'best',
        'both',
        'buy',
        'call',
        'cold',
        'does',
        'don’t',
        'fast',
        'first',
        'five',
        'found',
        'gave',
        'goes',
        'green',
        'its',
        'made',
        'many',
        'off',
        'or',
        'pull',
        'read',
        'right',
        'sing',
        'sit',
        'sleep',
        'tell',
        'their',
        'these',
        'those',
        'upon',
        'us',
        'use',
        'very',
        'wash',
        'Which',
        'why',
        'wish',
        'work',
        'would',
        'write',
        'your',
      ];
    } else if (this.type == 'level-3') {
      this.wordsList = [
        'about',
        'better',
        'bring',
        'carry',
        'clean',
        'cut',
        'done',
        'draw',
        'drink',
        'eight',
        'fall',
        'far',
        'full',
        'got',
        'grow',
        'hold',
        'hot',
        'hurt',
        'if',
        'keep',
        'kind',
        'laugh',
        'light',
        'long',
        'much',
        'myself',
        'never',
        'only',
        'own',
        'pick',
        'seven',
        'shall',
        'show',
        'six',
        'small',
        'start',
        'ten',
        'today',
        'together',
        'try',
      ];
    } else if (this.type == 'level-4') {
      this.wordsList = [
        'listen',
        'important',
        'event',
        'towards',
        'notice',
        'problems',
        'favourite',
        'information',
        'hundred',
        'continue',
        'pleaded',
        'complete',
        'Coaches',
        'however',
        'excitement',
        'several',
        'perfect',
        'culture',
        'voice',
        'Products',
        'ply',
        'prepare',
        'return',
        'distance',
        'certain',
        'travel',
        'thought',
        'laugh',
        'provision',
        'gathered',
        'transport',
        'known',
        'health',
        'produce',
        'video',
        'written',
        'enough',
        'brought',
        'instant',
      ];
    } else if (this.type == 'level-5') {
      this.wordsList = [
        'wonderful',
        'holiday',
        'cope',
        'variety',
        'surface',
        'purchase',
        'decided',
        'finally',
        'challenge',
        'machine',
        'scientist',
        'carefully',
        'equation',
        'laptop',
        'improve',
        'happening',
        'borrowed',
        'remembered',
        'pattern',
        'quite',
        'furthermore',
        'compare',
        'thousands',
        'though',
        'surrounding',
        'laughter',
        'explore',
        'special',
        'built',
        'understand',
        'increase',
        'known',
        'machine',
        'virus',
        'preparations',
        'inches',
        'practical',
        'infected',
        'renowned',
      ];
    } else if (this.type == 'level-6') {
      this.wordsList = [
        'technology',
        'results',
        'influenced',
        'popular',
        'complex',
        'transportation',
        'development',
        'access',
        'manipulate',
        'available',
        'respectful',
        'leverage',
        'Medicine',
        'Opportunities',
        'computer',
        'education',
        'especially',
        'location',
        'Virtual',
        'through',
        'physical',
        'hygiene',
        'Pneumonia',
        'industry',
        'customs',
        'production',
        'business',
        'volunteer',
        'classified',
        'globalized',
        'transparent',
        'respiratory',
        'environment',
        'various',
        'mental',
        'beneath',
        'resources',
        'photography',
        'fascinate',
      ];
    }
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
