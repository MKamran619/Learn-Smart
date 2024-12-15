// import { Component, OnInit } from '@angular/core';
// import { HeaderComponent } from '../../../home/header/header.component';
// import { SharedService } from '../../../services/sharedServices/shared.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { cilArrowLeft } from '@coreui/icons';
// import { IconDirective } from '@coreui/icons-angular';
// import { SpeechDetectService } from '../../../services/speechDetect/speech-detect.service';
// import { storyList, questionList } from './components/storyList';
// import { CardContainerComponent } from './components/card-container/card-container.component';
// import { CommonModule } from '@angular/common';
// import { ResultTableComponent } from './components/result-table/result-table.component';
// import { ButtonDirective } from '@coreui/angular';

// @Component({
//   selector: 'app-oral-reading-passages',
//   standalone: true,
//   imports: [
//     HeaderComponent,
//     IconDirective,
//     CardContainerComponent,
//     CommonModule,
//     ResultTableComponent,
//     ButtonDirective,
//   ],
//   templateUrl: './oral-reading-passages.component.html',
//   styleUrl: './oral-reading-passages.component.scss',
// })
// export class OralReadingPassagesComponent implements OnInit {
//   icons = { cilArrowLeft };
//   mode = '';
//   selectedIndex = 0;

//   constructor(
//     public sharedService: SharedService,
//     public router: Router,
//     public activatedRoute: ActivatedRoute,
//     public accuracyService: SpeechDetectService,
//     public activeRouter: ActivatedRoute
//   ) {}
//   ngOnInit(): void {
//     this.activeRouter.params.subscribe((params) => {
//       {
//         this.mode = params['mode'];
//       }
//     });
//     this.onLoadInitialData();
//   }

//   onLoadInitialData() {
//     this.accuracyService.resultList = [];
//     this.accuracyService.accuracyScore = 0;
//     this.accuracyService.transcription = '';
//   }
//   onChangePreviewMode(mode: string) {
//     if (this.accuracyService.onShowResult) {
//       this.accuracyService.onShowResult = false;
//     } else {
//       this.router.navigate([`dashboard/${mode}`]);
//     }
//   }
//   onMoveToNextStory() {
//     // this.sharedService.isLoading = true;
//     this.accuracyService.onShowResult = false;
//     this.selectedIndex += 1;
//   }
// }

import { Component } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';
import { SharedService } from '../../../services/sharedServices/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { cilArrowLeft } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { Constants } from '../../../constants';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-oral-reading-passages',
  standalone: true,
  imports: [HeaderComponent, IconDirective, CommonModule, MatIconModule],
  templateUrl: './oral-reading-passages.component.html',
  styleUrl: './oral-reading-passages.component.scss',
})
export class OralReadingPassagesComponent {
  Constants = Constants;
  icons = { cilArrowLeft };
  isLoading = false;
  constructor(
    public sharedService: SharedService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    this.sharedService.isLoading = false;
  }
  onChangePreviewMode(mode: string) {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([`dashboard/${mode}`]);
    }, 3500);
  }
  onNavigate(type: string) {
    this.sharedService.isLoading = true;
    setTimeout(() => {
      this.sharedService.isLoading = false;
      this.router.navigate([
        `dashboard/pre-test/pre-oral-reading-passages/${type}`,
      ]);
    }, 2500);
  }
}
