import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraficoService {
  private apiUrl = 'http://localhost:3000/grafico';

  constructor(private http: HttpClient) {}

  getGrafico(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/grafico');
  }


}
