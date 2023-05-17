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
    console.log("onsubmit");
    this.authService.login(this.username, this.password)
      .subscribe(
        result => {
          console.log("result")
          this.router.navigate(['/welcome']);
        },
        error => {
          this.errorMessage = 'Credenciales inválidas';
        }
      );
  }
}
