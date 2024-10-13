import { Routes } from '@angular/router';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './home/about/about.component';
import { ContactComponent } from './home/contact/contact.component';
import { AlphabetsComponent } from './components/alphabets/alphabets.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
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
