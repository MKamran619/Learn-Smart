import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  onRegisterUser(userData: any): Observable<any> {
    return this.http.post(this.API_URL + '/api/auth/local/register', userData);
  }
  onLogin(userData: any): Observable<any> {
    return this.http.post(this.API_URL + '/api/auth/local', userData);
  }
}
