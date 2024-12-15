import { Component, Input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { SpeechDetectService } from '../../../../../services/speechDetect/speech-detect.service';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../../../services/sharedServices/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonDirective } from '@coreui/angular';
import { ApiService } from '../../../../../services/apiServices/api.service';
import { finalize } from 'rxjs';
import { constants } from 'buffer';
import { Constants } from '../../../../../constants';

@Component({
  selector: 'app-result-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, ButtonDirective],
  templateUrl: './result-table.component.html',
  styleUrl: './result-table.component.scss',
})
export class ResultTableComponent implements OnInit {
  displayedColumns: string[] = [
    'position',
    'letter',
    'letterSubstituted',
    'accuracy',
    'noResponse',
  ];
  totalScore = 0;
  dataSource: any[] = [{ letter: 'A' }, { letter: 'B' }];

  IslevelUnlocked = false;
  type = '';
  isLoading = false;
  currentUser = '';

  constructor(
    public accuracyService: SpeechDetectService,
    public sharedService: SharedService,
    public router: Router,
    public activeRouter: ActivatedRoute,
    public apiService: ApiService
  ) {}
  ngOnInit(): void {
    this.dataSource = this.accuracyService.resultList;
    console.log('result = ', this.dataSource);
    const filteredRows = this.dataSource.filter(
      (row: any) => row.accuracy >= 100
    );

    this.totalScore = filteredRows.length;
    this.getCurrentRoute();
  }
  getCurrentRoute() {
    if (!this.sharedService.userConfig) {
      const data = localStorage.getItem('userConfig') || '';
      this.sharedService.userConfig = JSON.parse(data);
    }
    this.currentUser = this.sharedService?.userConfig?.user.username;
    this.activeRouter.params.subscribe((params) => {
      {
        this.type = params['type'];
      }
    });
    if (this.totalScore > 1) {
      if (
        this.type == 'pre-primer' &&
        !this.sharedService.hasAuthentication(
          Constants.preOralReadingLevel.PrePrimer
        )
      ) {
        this.IslevelUnlocked = true;
        this.onUpdateLevel(
          this.currentUser,
          Constants.preOralReadingLevel.PrePrimer
        );
      }
      if (
        this.type == 'primer' &&
        !this.sharedService.hasAuthentication(
          Constants.preOralReadingLevel.Primer
        )
      ) {
        this.IslevelUnlocked = true;
        this.onUpdateLevel(
          this.currentUser,
          Constants.preOralReadingLevel.Primer
        );
      }
      if (
        this.type == 'level-1' &&
        !this.sharedService.hasAuthentication(
          Constants.preOralReadingLevel.LevelOne
        )
      ) {
        this.IslevelUnlocked = true;
        this.onUpdateLevel(
          this.currentUser,
          Constants.preOralReadingLevel.LevelOne
        );
      }
      if (
        this.type == 'level-1' &&
        !this.sharedService.hasAuthentication(
          Constants.preOralReadingLevel.LevelOne
        )
      ) {
        this.IslevelUnlocked = true;
        this.onUpdateLevel(
          this.currentUser,
          Constants.preOralReadingLevel.LevelOne
        );
      }
      if (
        this.type == 'level-2' &&
        !this.sharedService.hasAuthentication(
          Constants.preOralReadingLevel.LevelTwo
        )
      ) {
        this.IslevelUnlocked = true;
        this.onUpdateLevel(
          this.currentUser,
          Constants.preOralReadingLevel.LevelTwo
        );
      }
      if (
        this.type == 'level-3' &&
        !this.sharedService.hasAuthentication(
          Constants.preOralReadingLevel.LevelThree
        )
      ) {
        this.IslevelUnlocked = true;
        this.onUpdateLevel(
          this.currentUser,
          Constants.preOralReadingLevel.LevelThree
        );
      }
      if (
        this.type == 'level-4' &&
        !this.sharedService.hasAuthentication(
          Constants.preOralReadingLevel.LevelFour
        )
      ) {
        this.IslevelUnlocked = true;
        this.onUpdateLevel(
          this.currentUser,
          Constants.preOralReadingLevel.LevelFour
        );
      }
      if (
        this.type == 'level-5' &&
        !this.sharedService.hasAuthentication(
          Constants.preOralReadingLevel.LevelFive
        )
      ) {
        this.IslevelUnlocked = true;
        this.onUpdateLevel(
          this.currentUser,
          Constants.preOralReadingLevel.LevelFive
        );
      }
      if (
        this.type == 'level-6' &&
        !this.sharedService.hasAuthentication(
          Constants.preOralReadingLevel.LevelSix
        )
      ) {
        this.IslevelUnlocked = true;
        this.onUpdateLevel(
          this.currentUser,
          Constants.preOralReadingLevel.LevelSix
        );
      }
    }
  }
  // checkResultAndUnLockLEvel(){
  //   if(this.totalScore > 8){
  //     this.
  //   }
  // }
  onUpdateLevel(identifier: string, level_id: number) {
    this.isLoading = true;
    this.apiService
      .updateUserLevelActiveStatus(identifier, level_id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        // this.onGetLatestUserLevels();
        const message = `Congratulations! You have unlocked the Oral Reading Passage ${this.type}`;
        this.sharedService.openCustomSnackBar(message, 'success');
        this.onGetLatestUserLevels();
      });
  }
  onGetLatestUserLevels() {
    this.isLoading = true;
    // this.onUpdateLevel(user, Constants.preTestLevel.WordList);
    this.apiService
      .getUserLevelsByUsernameOrEmail(this.currentUser)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        localStorage.setItem('levelConfig', JSON.stringify(res));
        this.sharedService.levelsConfig = res;
      });
  }
  onNavigateToLevel() {
    this.sharedService.isLoading = true;
    this.router.navigate([
      `dashboard/pre-test/pre-oral-reading-passages/${this.type}`,
    ]);
  }
}
