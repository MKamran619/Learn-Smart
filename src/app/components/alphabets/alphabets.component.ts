import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../home/header/header.component';
import { IconDirective } from '@coreui/icons-angular';
import { cilArrowLeft } from '@coreui/icons';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-alphabets',
  standalone: true,
  imports: [HeaderComponent, IconDirective],
  templateUrl: './alphabets.component.html',
  styleUrl: './alphabets.component.scss',
})
export class AlphabetsComponent implements OnInit {
  icons = { cilArrowLeft };
  mode = '';
  btnCapitalActive = true;
  constructor(private router: Router, private activeRouter: ActivatedRoute) {}

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params) => {
      {
        this.mode = params['mode'];
      }
    });
  }

  onChangePreviewMode(mode: string) {
    this.router.navigate([`dashboard/${mode}`]);
  }
}
