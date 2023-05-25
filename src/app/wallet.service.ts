import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private isAuthenticatedValue: boolean = false; // Variable para almacenar el estado de autenticación

  constructor() {
    // Simulando la lógica de inicialización, establecemos isAuthenticated en true si el usuario tiene un token válido almacenado
    const storedToken = localStorage.getItem('userToken');
    this.isAuthenticatedValue = !!storedToken; // Convertimos el valor en un booleano

    // Si deseas agregar una lógica adicional de inicialización, como verificar la validez del token o realizar una llamada a una API para verificar la autenticación, puedes hacerlo aquí.
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedValue;
  }
}
