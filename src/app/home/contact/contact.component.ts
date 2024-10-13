import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SharedService } from '../../services/sharedServices/shared.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  constructor(public sharedService: SharedService) {}
  ngOnInit(): void {
    this.setActiveLink();
  }

  setActiveLink() {
    this.sharedService.activeLink = 'contact';
  }
}
