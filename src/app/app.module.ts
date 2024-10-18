import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { AlertModule } from '@coreui/angular';
import { FormModule as coruUIform } from '@coreui/angular';
import { ButtonDirective } from '@coreui/angular';

import { AppComponent } from './app.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';

@NgModule({
  declarations: [],
  imports: [
    AppComponent,
    CommonModule,
    RouterModule,
    BrowserModule,
    MatIconModule,
    FormsModule,

    AlertModule,
    coruUIform,
    ButtonDirective,
  ],
  bootstrap: [],
})
export class AppModule {}
