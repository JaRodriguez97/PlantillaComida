import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { userInterface } from '@models/users.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  URL = `${environment.backend}api/user/`;

  constructor(private http: HttpClient) {}

  headers(token: string | undefined) {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: token,
    });
  }

  getUser(id: string, token?: string): Observable<userInterface> {
    let headers = this.headers(token);

    return this.http.post<userInterface>(`${this.URL}`, { id }, { headers });
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

  updateUser(
    id: string | null | undefined,
    dataUpdate: any,
    NamePropUpdate: string,
    token?: string
  ): Observable<userInterface> {
    let headers = this.headers(token);

    return this.http.put<userInterface>(
      this.URL,
      { id, dataUpdate, NamePropUpdate },
      { headers }
    );
  }
}
