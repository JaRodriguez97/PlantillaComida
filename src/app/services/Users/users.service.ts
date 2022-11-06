import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { userInterface } from '@models/users.interface';
import { environment } from '@env/environment';
import { comboInterface } from '@models/combo.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  URL = `${environment.URL_BACKEND}api/user/`;

  constructor(private http: HttpClient) {}

  headers(token: string | undefined) {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: token,
    });
  }

  getUser(_id: String, token?: string): Observable<userInterface> {
    let headers = this.headers(token);

    return this.http.post<userInterface>(`${this.URL}login`, _id, {
      headers,
    });
  }

  getLogin(form: userInterface, token?: string): Observable<userInterface> {
    let headers = this.headers(token);

    return this.http.post<userInterface>(`${this.URL}login`, form, {
      headers,
    });
  }

  getSignUp(form: userInterface, token?: string): Observable<userInterface> {
    let headers = this.headers(token);

    return this.http.post<userInterface>(`${this.URL}singUp`, form, {
      headers,
    });
  }
}
