import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { cilMenu } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { SharedService } from '../../services/sharedServices/shared.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IconDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  icons = { cilMenu };
  isShowMenu = false;

  constructor(public sharedService: SharedService) {}

  ngOnInit(): void {}

  onToggleMenu() {
    this.isShowMenu = !this.isShowMenu;
  }
}
