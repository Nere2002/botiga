import { Component } from '@angular/core';
import {AuthService} from "../auth.service";
import { Router } from '@angular/router';
import { LoggerService } from "../logger.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private loggerService: LoggerService) { }


/*  onSubmit() {
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
  }*/

  onSubmit() {
    this.authService.login(this.username, this.password)
      .subscribe(
        result => {
          console.log(result);
          this.authService.userId = result.userId; // Guarda el ID del usuario en el servicio AuthService
          this.loggerService.logAction('Inicio de sesión', this.username)
            .subscribe(
              () => {
                console.log('Registro de inicio de sesión guardado en logs.txt');
                this.router.navigate(['/welcome']);
              },
              error => {
                console.error('Error al guardar el registro de inicio de sesión:', error);
                this.router.navigate(['/welcome']);
              }
            );
        },
        error => {
          this.errorMessage = 'Credenciales inválidas';
        }
      );
  }
}
