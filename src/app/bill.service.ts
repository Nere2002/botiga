import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class BillService {

  private apiUrl = 'http://localhost:3000/bills';

  constructor(private http: HttpClient) {}

  createInvoice(invoice: any): Observable<number> {
    return this.http.post<number>(this.apiUrl, invoice)
      .pipe(
        catchError((error: any) => throwError(error))
      );
  }


}
