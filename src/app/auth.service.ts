import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, tap} from "rxjs/operators";
import { Observable, throwError} from 'rxjs';
import {LoggerService} from "./logger.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/login';
  private apiUrl= 'http://localhost:3000/register';
  userId: number | null = null; // Inicialmente no hay un userId asignado

  constructor(private http: HttpClient, private loggerService: LoggerService) { }


/*  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password })
      .pipe(
        catchError((error: any) => throwError(error))
      );
  }*/

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password }).pipe(
      tap(() => {
        // Guardar el registro de inicio de sesión en el archivo de log
        const action = 'Inicio de sesión';
        this.loggerService.logAction(action, username);
      }),
      catchError((error: any) => throwError(error))
    );
  }


  register(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }



  getUserId(): Observable<number> {
    // Realizar la llamada HTTP o la consulta a la base de datos para obtener el ID del usuario
    return this.http.get<number>(`${this.apiUrl}/user/id`);
  }
}


