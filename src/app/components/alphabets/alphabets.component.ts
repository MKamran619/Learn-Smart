import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../home/header/header.component';
import { IconDirective } from '@coreui/icons-angular';
import { cilArrowLeft } from '@coreui/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { CardContainerComponent } from '../../shared-component/card-container/card-container.component';

@Component({
  selector: 'app-alphabets',
  standalone: true,
  imports: [HeaderComponent, CardContainerComponent, IconDirective],
  templateUrl: './alphabets.component.html',
  styleUrl: './alphabets.component.scss',
})
export class AlphabetsComponent implements OnInit {
  icons = { cilArrowLeft };
  mode = '';
  btnCapitalActive = true;
  selectedLetter = 'Capital Letter';
  letters: string[] = [];
  constructor(private router: Router, private activeRouter: ActivatedRoute) {}

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params) => {
      {
        this.mode = params['mode'];
      }
    });
    this.onClickCapitalLetter();
  }

  onClickCapitalLetter() {
    this.btnCapitalActive = true;
    this.selectedLetter = 'Capital Letter';
    this.letters = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i)
    );
  }
  onClickCommonLetter() {
    this.btnCapitalActive = false;
    this.selectedLetter = 'Common Letter';
    this.letters = ['E', 'T', 'A', 'O', 'I', 'N', 'S', 'H', 'R', 'D'];
  }
  onChangePreviewMode(mode: string) {
    this.router.navigate([`dashboard/${mode}`]);
  }
}
