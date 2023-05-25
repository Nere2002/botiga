import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

  private apiUrl = 'http://localhost:3000/productsApi'; // URL de tu servidor Node.js

  constructor(private http: HttpClient) {}

  getProducts1(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
