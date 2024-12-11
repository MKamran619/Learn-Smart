import { Routes } from '@angular/router';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { LoginComponent } from './account/login/login.component';
import { AboutComponent } from './home/about/about.component';
import { ContactComponent } from './home/contact/contact.component';
import { WelcomeScreenComponent } from './home/welcome-screen/welcome-screen.component';
import { SignupComponent } from './account/signup/signup.component';

import { AlphabetsComponent } from './components/pre-test/alphabets/alphabets.component';
import { SentenceFilterComponent } from './components/pre-test/sentence-filter/sentence-filter.component';
import { WordListComponent } from './components/pre-test/word-list/word-list.component';
import { OralReadingPassagesComponent } from './components/pre-test/oral-reading-passages/oral-reading-passages.component';
import { InterestInventoryComponent } from './components/pre-test/interest-inventory/interest-inventory.component';
import { MultipleIntelligenceTestComponent } from './components/pre-test/multiple-intelligence-test/multiple-intelligence-test.component';

import { AlphabetsComponent as postAlphabets } from './components/post-test/alphabets/alphabets.component';
import { SentenceFilterComponent as PostSentenceFilter } from './components/post-test/sentence-filter/sentence-filter.component';
import { WordListComponent as PostWordList } from './components/post-test/word-list/word-list.component';
import { OralReadingPassagesComponent as PostOralReadingPassages } from './components/post-test/oral-reading-passages/oral-reading-passages.component';

import { multicast } from 'rxjs';
import { WordComponent } from './components/pre-test/word-list/components/word/word.component';
import { CardContainerComponent } from './components/pre-test/alphabets/card-container/card-container.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'welcome', component: WelcomeScreenComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/:mode', component: DashboardComponent },

  //  Pre Test components

  { path: 'dashboard/:mode/pre-alphabets', component: AlphabetsComponent },
  {
    path: 'dashboard/:mode/pre-alphabets/:type',
    component: CardContainerComponent,
  },
  {
    path: 'dashboard/:mode/pre-sentence-filter',
    component: SentenceFilterComponent,
  },
  { path: 'dashboard/:mode/pre-word-list', component: WordListComponent },

  { path: 'dashboard/:mode/pre-word-list/:type', component: WordComponent },
  {
    path: 'dashboard/:mode/pre-oral-reading-passages',
    component: OralReadingPassagesComponent,
  },
  {
    path: 'dashboard/:mode/pre-interest-inventory',
    component: InterestInventoryComponent,
  },
  {
    path: 'dashboard/:mode/pre-multiple-intelligence-test',
    component: MultipleIntelligenceTestComponent,
  },

  //  Post Test components

  { path: 'dashboard/:mode/post-alphabets', component: postAlphabets },
  {
    path: 'dashboard/:mode/post-sentence-filter',
    component: PostSentenceFilter,
  },
  { path: 'dashboard/:mode/post-word-list', component: PostWordList },
  {
    path: 'dashboard/:mode/post-oral-reading-passages',
    component: PostOralReadingPassages,
  },

  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
];
