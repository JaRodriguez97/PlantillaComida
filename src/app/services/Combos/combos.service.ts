import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { comboInterface } from '@models/combo.interface';

@Injectable({
  providedIn: 'root',
})
export class CombosService {
  URL = `${environment.URL_BACKEND}api/combos/`;

  constructor(private http: HttpClient) {}

  headers(token: string | undefined) {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: token,
    });
  }

  getCombos(token?: string): Observable<comboInterface[]> {
    let headers = this.headers(token);

    return this.http.get<comboInterface[]>(this.URL, { headers });
  }
}
