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

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'welcome', component: WelcomeScreenComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/:mode', component: DashboardComponent },

  //  Pre Test components

  { path: 'dashboard/pre-test/alphabets', component: AlphabetsComponent },
  {
    path: 'dashboard/pre-test/sentence-filter',
    component: SentenceFilterComponent,
  },
  { path: 'dashboard/pre-test/word-list', component: WordListComponent },
  {
    path: 'dashboard/pre-test/oral-reading-passages',
    component: OralReadingPassagesComponent,
  },
  {
    path: 'dashboard/pre-test/interest-inventory',
    component: InterestInventoryComponent,
  },
  {
    path: 'dashboard/pre-test/multiple-intelligence-test',
    component: MultipleIntelligenceTestComponent,
  },

  //  Post Test components

  { path: 'dashboard/post-test/alphabets', component: postAlphabets },
  {
    path: 'dashboard/post-test/sentence-filter',
    component: PostSentenceFilter,
  },
  { path: 'dashboard/post-test/word-list', component: PostWordList },
  {
    path: 'dashboard/post-test/oral-reading-passages',
    component: PostOralReadingPassages,
  },

  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
];
