import { Component, Input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { SpeechDetectService } from '../../../../services/speechDetect/speech-detect.service';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../../services/sharedServices/shared.service';
import { ApiService } from '../../../../services/apiServices/api.service';
import { finalize } from 'rxjs';
import { Constants } from '../../../../constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ButtonDirective } from '@coreui/angular';

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
  dataSource: any[] = [{ sentence: '' }, { sentence: '' }];

  prePrimerUnlocked = false;
  primerUnlocked = false;
  levelOneUnlocked = false;
  levelTwoUnlocked = false;
  levelThreeUnlocked = false;
  levelFourUnlocked = false;
  levelFiveUnlocked = false;
  levelSixUnlocked = false;

  isLoading = false;
  currentUser = '';
  isLevelUnlocked = false;

  constructor(
    public accuracyService: SpeechDetectService,
    public sharedService: SharedService,
    public aptService: ApiService,
    private snackBar: MatSnackBar,
    public router: Router
  ) {}
  ngOnInit(): void {
    this.checkAndUnlockLevels();
    this.dataSource = this.accuracyService.resultList;

    const filteredRows = this.dataSource.filter(
      (row: any) => row.accuracy >= 100
    );

    this.totalScore = filteredRows.length;
    this.unBlockingLevelByAccuracy();
  }
  checkAndUnlockLevels() {
    this.prePrimerUnlocked = this.sharedService.hasAuthentication(
      Constants.postWordListLevel.PrePrimer
    );
    this.primerUnlocked = this.sharedService.hasAuthentication(
      Constants.postWordListLevel.Primer
    );
    this.levelOneUnlocked = this.sharedService.hasAuthentication(
      Constants.postWordListLevel.LevelOne
    );
    this.levelTwoUnlocked = this.sharedService.hasAuthentication(
      Constants.postWordListLevel.LevelTwo
    );
    this.levelThreeUnlocked = this.sharedService.hasAuthentication(
      Constants.postWordListLevel.LevelThree
    );
    this.levelFourUnlocked = this.sharedService.hasAuthentication(
      Constants.postWordListLevel.LevelFour
    );
    this.levelFiveUnlocked = this.sharedService.hasAuthentication(
      Constants.postWordListLevel.LevelFive
    );
    this.levelSixUnlocked = this.sharedService.hasAuthentication(
      Constants.postWordListLevel.LevelSix
    );
  }
  unBlockingLevelByAccuracy() {
    if (!this.sharedService.userConfig) {
      const data = localStorage.getItem('userConfig') || '';
      this.sharedService.userConfig = JSON.parse(data);
    }

    const accuracyOne = this.dataSource[0].accuracy;
    const accuracyTwo = this.dataSource[1].accuracy;
    const accuracyThree = this.dataSource[2].accuracy;
    const accuracyFour = this.dataSource[3].accuracy;
    const accuracyFive = this.dataSource[4].accuracy;

    this.currentUser = this.sharedService.userConfig.user.username;

    if (
      accuracyOne > 10 &&
      !this.sharedService.hasAuthentication(
        Constants.postWordListLevel.PrePrimer
      )
    ) {
      this.onUpdateLevel(
        this.currentUser,
        Constants.postWordListLevel.PrePrimer
      );
      this.isLevelUnlocked = true;
    }
    if (
      accuracyOne > 50 &&
      !this.sharedService.hasAuthentication(Constants.postWordListLevel.Primer)
    ) {
      this.onUpdateLevel(this.currentUser, Constants.postWordListLevel.Primer);
      this.isLevelUnlocked = true;
    }
    if (
      accuracyTwo > 60 &&
      !this.sharedService.hasAuthentication(
        Constants.postWordListLevel.LevelOne
      )
    ) {
      this.onUpdateLevel(
        this.currentUser,
        Constants.postWordListLevel.LevelOne
      );
      this.isLevelUnlocked = true;
    }
    if (
      accuracyThree > 60 &&
      !this.sharedService.hasAuthentication(
        Constants.postWordListLevel.LevelTwo
      )
    ) {
      this.onUpdateLevel(
        this.currentUser,
        Constants.postWordListLevel.LevelTwo
      );
      this.isLevelUnlocked = true;
    }
    if (
      accuracyFour > 40 &&
      !this.sharedService.hasAuthentication(
        Constants.postWordListLevel.LevelThree
      )
    ) {
      this.onUpdateLevel(
        this.currentUser,
        Constants.postWordListLevel.LevelThree
      );
      this.isLevelUnlocked = true;
    }
    if (
      accuracyFour > 70 &&
      !this.sharedService.hasAuthentication(
        Constants.postWordListLevel.LevelFour
      )
    ) {
      this.onUpdateLevel(
        this.currentUser,
        Constants.postWordListLevel.LevelFour
      );
      this.isLevelUnlocked = true;
    }
    if (
      accuracyFive > 40 &&
      !this.sharedService.hasAuthentication(
        Constants.postWordListLevel.LevelFive
      )
    ) {
      this.onUpdateLevel(
        this.currentUser,
        Constants.postWordListLevel.LevelFive
      );
      this.isLevelUnlocked = true;
    }
    if (
      accuracyFive > 70 &&
      !this.sharedService.hasAuthentication(
        Constants.postWordListLevel.LevelSix
      )
    ) {
      this.onUpdateLevel(
        this.currentUser,
        Constants.postWordListLevel.LevelSix
      );
      this.isLevelUnlocked = true;
    }
    // this.onGetLatestUserLevels(user);
  }
  onUpdateLevel(identifier: string, level_id: number) {
    this.aptService
      .updateUserLevelActiveStatus(identifier, level_id)
      .pipe(finalize(() => {}))
      .subscribe((res) => {
        // this.onGetLatestUserLevels(this.currentUser)
        this.showMessage();
        this.onGetLatestUserLevels();
      });
  }
  onGetLatestUserLevels() {
    this.isLoading = true;
    this.aptService
      .getUserLevelsByUsernameOrEmail(this.currentUser)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        localStorage.setItem('levelConfig', JSON.stringify(res));
        this.sharedService.levelsConfig = res;
        this.checkAndUnlockLevels();
      });
  }
  showMessage() {
    const message = 'Congratulations! You have unlocked the word list level.';
    this.sharedService.openCustomSnackBar(message, 'success');
  }
  onNavigateToLevel(mode: string) {
    this.sharedService.isLoading = true;
    this.router.navigate([`dashboard/post-test/post-word-list/${mode}`]);
  }
}
