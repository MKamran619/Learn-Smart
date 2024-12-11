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
  constructor(
    public accuracyService: SpeechDetectService,
    public sharedService: SharedService,
    public aptService: ApiService,
    private snackBar: MatSnackBar,
    public router: Router
  ) {}
  ngOnInit(): void {
    this.dataSource = this.accuracyService.resultList;

    const filteredRows = this.dataSource.filter(
      (row: any) => row.accuracy >= 100
    );

    this.totalScore = filteredRows.length;
    this.unBlockingLevelByAccuracy();
  }
  unBlockingLevelByAccuracy() {
    let isLevelUnlocked = false;
    if (!this.sharedService.userConfig) {
      const data = localStorage.getItem('userConfig') || '';
      this.sharedService.userConfig = JSON.parse(data);
    }

    const accuracyOne = this.dataSource[0].accuracy;
    const accuracyTwo = this.dataSource[1].accuracy;
    const accuracyThree = this.dataSource[2].accuracy;
    const accuracyFour = this.dataSource[3].accuracy;
    const accuracyFive = this.dataSource[4].accuracy;

    const user = this.sharedService.userConfig.user.username;

    if (
      accuracyOne < 25 &&
      !this.sharedService.hasAuthentication(
        Constants.preWordListLevel.PrePrimer
      )
    ) {
      this.onUpdateLevel(user, Constants.preWordListLevel.PrePrimer);
      isLevelUnlocked = true;
    }
    if (
      accuracyOne > 25 &&
      !this.sharedService.hasAuthentication(Constants.preWordListLevel.Primer)
    ) {
      this.onUpdateLevel(user, Constants.preWordListLevel.Primer);
      isLevelUnlocked = true;
    }
    if (
      accuracyTwo > 60 &&
      !this.sharedService.hasAuthentication(Constants.preWordListLevel.LevelOne)
    ) {
      this.onUpdateLevel(user, Constants.preWordListLevel.LevelOne);
      isLevelUnlocked = true;
    }
    if (
      accuracyThree > 60 &&
      !this.sharedService.hasAuthentication(Constants.preWordListLevel.LevelTwo)
    ) {
      this.onUpdateLevel(user, Constants.preWordListLevel.LevelTwo);
      isLevelUnlocked = true;
    }
    if (
      accuracyFour > 60 &&
      !this.sharedService.hasAuthentication(
        Constants.preWordListLevel.LevelThree
      )
    ) {
      this.onUpdateLevel(user, Constants.preWordListLevel.LevelThree);
      isLevelUnlocked = true;
    }
    if (
      accuracyFive > 60 &&
      !this.sharedService.hasAuthentication(
        Constants.preWordListLevel.LevelFour
      )
    ) {
      this.onUpdateLevel(user, Constants.preWordListLevel.LevelFour);
      isLevelUnlocked = true;
    }
    this.onGetLatestUserLevels(user);
  }
  onUpdateLevel(identifier: string, level_id: number) {
    this.aptService
      .updateUserLevelActiveStatus(identifier, level_id)
      .pipe(finalize(() => {}))
      .subscribe((res) => {
        // this.onGetLatestUserLevels();
      });
  }
  onGetLatestUserLevels(user: string) {
    this.onUpdateLevel(user, Constants.preTestLevel.WordList);
    this.aptService
      .getUserLevelsByUsernameOrEmail(user)
      .pipe(finalize(() => {}))
      .subscribe((res) => {
        localStorage.setItem('levelConfig', JSON.stringify(res));
        this.sharedService.levelsConfig = res;
        this.showMessage();
      });
  }
  showMessage() {
    // this.snackBar.open(
    //   'Congratulations! You have unlocked the word list levels.',
    //   'Close',
    //   {
    //     duration: 15000, // Duration in milliseconds
    //     verticalPosition: 'bottom', // Position: 'top' or 'bottom'
    //     horizontalPosition: 'center', // Position: 'start', 'center', 'end', 'left', or 'right'
    //   }
    // );
  }
  onNavigateToLevel(mode: string) {
    this.sharedService.isLoading = true;
    this.router.navigate([`dashboard/pre-test/pre-word-list/${mode}`]);
  }
}
