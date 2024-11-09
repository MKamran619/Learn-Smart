import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  GetFilterSentence(): Observable<any> {
    return this.http.get(this.API_URL + '/api/t-sentence-filters');
  }
  GetWordLists(): Observable<any> {
    return this.http.get(this.API_URL + '/api/t-word-lists');
  }
  GetWordListByID(id: number): Observable<any> {
    return this.http.get(this.API_URL + `/api/t-word-lists/${id}`);
  }
  GetOralReadingPassagesList(): Observable<any> {
    return this.http.get(
      this.API_URL + '/api/t-oral-reading-passages?sort=position:asc'
    );
  }
}
