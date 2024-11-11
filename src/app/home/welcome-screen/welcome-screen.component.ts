import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertModule } from '@coreui/angular';
import { FormModule as coreFormModule } from '@coreui/angular';
import { ButtonDirective } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, interval, take } from 'rxjs';
import { ApiService } from '../../services/apiServices/api.service';
import { SharedService } from '../../services/sharedServices/shared.service';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [CommonModule, AlertModule, coreFormModule, FormsModule],
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.scss',
})
export class WelcomeScreenComponent implements OnInit {
  showStart = true;
  showScreenOne = false;
  showScreenTwo = false;
  showScreenThree = false;
  showScreenfour = false;
  showScreenfive = false;
  timer = 60;
  userName = '';
  placeName = '';
  constructor(
    public router: Router,
    public apiService: ApiService,
    public sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.userName =
      this.userName.charAt(0).toUpperCase() + this.userName.slice(1);
  }

  onMoveNext() {
    if (this.showStart) {
      this.showStart = false;
      this.showScreenOne = true;
      setTimeout(() => {
        this.showScreenOne = false;
        this.showScreenTwo = true;
      }, 1500);
    }
  }
  onMoveToScreenThree(value: string) {
    if (this.userName.length == 3) {
      setTimeout(() => {
        this.userName =
          this.userName.charAt(0).toUpperCase() + this.userName.slice(1);
        this.showScreenTwo = false;
        this.showScreenThree = true;
      }, 2000);
    }
  }
  onMoveToScreenFour(value: string) {
    if (this.placeName.length == 3) {
      this.onMoveToScreenfive();
      setTimeout(() => {
        this.showScreenThree = false;
        this.showScreenfour = true;
      }, 2000);
    }
  }
  onMoveToScreenfive() {
    setTimeout(() => {
      this.showScreenfour = false;
      this.showScreenfive = true;
      this.onCountDown(this.timer);
    }, 15000);
  }
  onCountDown(s: number) {
    if (!this.sharedService.userConfig) {
      const data = localStorage.getItem('userConfig') || '';
      this.sharedService.userConfig = JSON.parse(data);
    }

    const user = this.sharedService.userConfig.user.username;
    if (s > 0) {
      setTimeout(() => {
        this.timer = this.timer - 1;
        this.onCountDown(this.timer);
        if (this.timer == 0) {
          this.apiService
            .getUserLevelsByUsernameOrEmail(user)
            .pipe(
              finalize(() => {
                this.sharedService.isLoading = false;
              })
            )
            .subscribe((res) => {
              localStorage.setItem('levelConfig', JSON.stringify(res));
            });
          this.router.navigate(['dashboard']);
        }
      }, 1000);
    }
  }
}
