import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  onRegisterUser(userData: any): Observable<any> {
    return this.http.post(
      environment.API_URL + '/api/auth/local/register',
      userData
    ); // Sends a POST request to the API
  }
  onLogin(userData: any): Observable<any> {
    return this.http.post(environment.API_URL + '/api/auth/local', userData); // Sends a POST request to the API
  }
}
