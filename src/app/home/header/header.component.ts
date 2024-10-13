import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { cilList, cilShieldAlt, cilMenu } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IconDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  icons = { cilList, cilMenu, cilShieldAlt };
  isShowMenu = false;

  onToggleMenu() {
    console.log('asnif');
    this.isShowMenu = !this.isShowMenu;
  }
}
