import { Component } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';

@Component({
  selector: 'app-interest-inventory',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './interest-inventory.component.html',
  styleUrl: './interest-inventory.component.scss',
})
export class InterestInventoryComponent {}
