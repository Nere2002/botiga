import { Component } from '@angular/core';
import {ProductApiService} from "../product-api.service";
import axios from 'axios';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products: any[] = [];

  constructor(private productApiService: ProductApiService) {}
  user: any;
  /*ngOnInit() {
    this.getProducts1();
  }*/
  ngOnInit() {
    this.getUserData(); // crida la funció per obtenir les dades de l'usuari immediatament
    setInterval(() => {
      this.getUserData(); // crida la funció per obtenir les dades de l'usuari cada 5 segons
    }, 5000);
  }

  getUserData() {
    axios.get('https://randomuser.me/api/').then((response) => {
      this.user = response.data.results[0];
    });
  }

/*  getProducts1() {
    this.productApiService.getProducts1()
      .subscribe(
        (response) => {
          this.products = response;
        },
        (error) => {
          console.error('Error al obtener los productos:', error);
        }
      );
  }*/
}
