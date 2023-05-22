import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }

  getUserId(): number {
    // Lógica para obtener el ID del usuario
    // Puede ser a través de una llamada HTTP, consulta a una base de datos, etc.
    // En este ejemplo, simplemente devolvemos un valor fijo para fines de demostración
    return 123;
  }
}
