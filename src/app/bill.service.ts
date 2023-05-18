import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BillService {

  private apiUrl = 'http://localhost:3000'; // URL de la API

  constructor(private http: HttpClient) { }


}
