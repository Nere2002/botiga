import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import { Router } from '@angular/router';
import { ethers } from 'ethers';
import Web3 from "web3";

declare global {
  interface Window {
    ethereum: any;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // Comprueba si Metamask está instalado
    if (!window.ethereum) {
      console.log('Metamask no está instalado');
    }
  }

  async loginWithMetamask() {
    try {
      // Solicita la conexión con Metamask
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Accede al proveedor de Metamask utilizando web3.js
      const provider = new Web3(window.ethereum);
      const accounts = await provider.eth.getAccounts();

      // Obtiene la dirección de la cuenta actual
      const address = accounts[0];

      // Realiza las acciones necesarias después del inicio de sesión exitoso
      console.log('Inicio de sesión exitoso con Metamask');
      console.log('Dirección de la cuenta actual:', address);

      // Realiza otras operaciones o redirige al usuario a la página de la billetera
    } catch (error) {
      console.error('Error al iniciar sesión con Metamask', error);
    }
  }

  onSubmit() {
    this.authService.login(this.username, this.password)
      .subscribe(
        result => {
          console.log(result);
          this.authService.userId = result.userId; // Guarda el ID del usuario en el servicio AuthService
          this.router.navigate(['/welcome']);
        },
        error => {
          this.errorMessage = 'Credenciales inválidas';
        }
      );
  }
}
