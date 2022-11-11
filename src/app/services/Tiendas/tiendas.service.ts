import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { campusInterface } from '@models/campus.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TiendasService {
  URL = `${environment.backend}api/tiendas/`;

  constructor(private http: HttpClient) {}

  headers(token: string | undefined) {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: token,
    });
  }

  getTiendas(token?: string): Observable<campusInterface[]> {
    let headers = this.headers(token);

    return this.http.get<campusInterface[]>(this.URL, {
      headers,
    });
  }
}
