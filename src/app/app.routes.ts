import { Routes } from '@angular/router';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { LoginComponent } from './account/login/login.component';
import { AboutComponent } from './home/about/about.component';
import { ContactComponent } from './home/contact/contact.component';
import { AlphabetsComponent } from './components/pre-test/alphabets/alphabets.component';
import { WelcomeScreenComponent } from './home/welcome-screen/welcome-screen.component';
import { SignupComponent } from './account/signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'welcome', component: WelcomeScreenComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/:mode', component: DashboardComponent },
  { path: 'dashboard/:mode/alphabets', component: AlphabetsComponent },
  { path: 'dashboard/:mode/sentence-filter', component: AlphabetsComponent },
  { path: 'dashboard/:mode/word-list', component: AlphabetsComponent },
  {
    path: 'dashboard/:mode/oral-reading-passages',
    component: AlphabetsComponent,
  },
  { path: 'dashboard/:mode/interest-inventory', component: AlphabetsComponent },
  {
    path: 'dashboard/:mode/multiple-intelligence-test',
    component: AlphabetsComponent,
  },
  { path: 'dashboard/:mode/alphabets', component: AlphabetsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
];
