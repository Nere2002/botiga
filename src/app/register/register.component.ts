import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private authService: AuthService) { }

  onSubmit() {
    const user = {
      username: this.username,
      password: this.password,
      email: this.email
    };

    this.authService.register(user)
      .subscribe(
        result => {
          console.log('Usuario registrado exitosamente');
        },
        error => {
          this.errorMessage = 'Error al registrar el usuario';
        }
      );
  }
}
