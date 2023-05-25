import {Component, ElementRef, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {
  nombre = '';
  email = '';
  consulta = '';

  constructor(private http: HttpClient) { }
  enviarConsulta() {
    const formData = {
      nombre: this.nombre,
      email: this.email,
      consulta: this.consulta
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post('http://localhost:3000/api/guardar-consulta', formData, { headers })
      .subscribe(
        response => console.log(response),
        error => console.error(error)
      );
  }
}
