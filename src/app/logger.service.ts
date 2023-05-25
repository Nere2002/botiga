import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";





@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  logUrl = 'http://localhost:3000/logs'; // URL del endpoint en el servidor para guardar los logs

  constructor(private http: HttpClient) {}

  logAction(action: string, username: string): Observable<any> {
    const timestamp = new Date().toLocaleString();
    const logEntry = `Date & Time: ${timestamp} - User: ${username} - Action: ${action}`;

    return this.http.post(this.logUrl, { logEntry }).pipe(
      catchError((error: any) => throwError(error))
    );
  }

}
