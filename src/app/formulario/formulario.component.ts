import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {

  nombre=' ';
  email=' ';
  consulta=' ';

  constructor(private http: HttpClient) { }

  enviarConsulta() {
    const formData = {
      nombre: this.nombre,
      email: this.email,
      consulta: this.consulta
    };

    this.http.post('/api/guardar-consulta', formData)
      .subscribe(
        response => console.log(response),
        error => console.error(error)
      );
  }
}
