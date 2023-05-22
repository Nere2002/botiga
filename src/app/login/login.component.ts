import { Component } from '@angular/core';
import {AuthService} from "../auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }


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
