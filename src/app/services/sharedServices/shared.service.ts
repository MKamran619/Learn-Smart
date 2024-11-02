import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  activeLink = 'home';
  preWordListActive = false;
  preOralActive = false;
  preInventoryActive = false;
  preMultipleActive = false;

  postWordListActive = false;
  postOralActive = false;
  postInventoryActive = false;
  postMultipleActive = false;

  constructor() {}
}
