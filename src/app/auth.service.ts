import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import { Observable, throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/login';
  private apiUrl= 'http://localhost:3000/register';
  userId: number | null = null; // Inicialmente no hay un userId asignado
  private saveUserIdUrl= ' ';
  constructor(private http: HttpClient) { }

/*  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post('/login', body);
  }*/

 /* LOGIN
  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password })
      .pipe(
        catchError((error: any) => throwError(error))
      );
  }*/


  login(username: string, password: string): Observable<any> {
    const loginObservable = new Observable((observer) => {
      this.http.post(this.loginUrl, { username, password }).subscribe({
        next: (result) => {
          console.log(result);
          observer.next(result);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });

    return loginObservable;
  }





  /*register(user: any): Observable<any> {
    const url = `${this.apiUrl}/register`;
    return this.http.post(url, user);
  }*/

/*  register(user:any): Observable<any>{
    return this.http.post(this.apiUrl,user)
      .pipe(
        catchError((error: any) => throwError(error))
      );
  }*/
  register(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }
}
