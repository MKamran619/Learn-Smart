import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_URL = 'http://localhost:1337/api/auth/local/register';

  constructor(private http: HttpClient) {}

  onRegisterUser(userData: any): Observable<any> {
    return this.http.post(this.API_URL, userData); // Sends a POST request to the API
  }
}
