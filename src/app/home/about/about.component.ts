import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SharedService } from '../../services/sharedServices/shared.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  constructor(public sharedService: SharedService) {}

  ngOnInit(): void {
    this.setActiveLink();
  }

  setActiveLink() {
    this.sharedService.activeLink = 'about';
  }
}
