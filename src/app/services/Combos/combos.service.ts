import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { comboInterface } from '@models/combo.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CombosService {
  URL = `${environment.backend}api/combos/`;

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

  getCombo(_id: String, token?: string): Observable<comboInterface> {
    let headers = this.headers(token);

    return this.http.get<comboInterface>(this.URL + _id, { headers });
  }

  getTotalPedido(
    arrayID: String[],
    token?: string
  ): Observable<comboInterface[]> {
    let headers = this.headers(token);

    return this.http.post<comboInterface[]>(this.URL, { arrayID }, { headers });
  }

  updateComboComentario(id: String, contactForm: any, token?: string) {
    let headers = this.headers(token);

    return this.http.put<comboInterface>(
      this.URL + 'createComent',
      { id, contactForm },
      { headers }
    );
  }
}
