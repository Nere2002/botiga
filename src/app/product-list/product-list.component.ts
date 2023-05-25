import { Component } from '@angular/core';
import {ProductApiService} from "../product-api.service";


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products: any[] = [];

  constructor(private productApiService: ProductApiService) {}

  ngOnInit() {
    this.getProducts1();
  }

  getProducts1() {
    this.productApiService.getProducts1()
      .subscribe(
        (response) => {
          this.products = response;
        },
        (error) => {
          console.error('Error al obtener los productos:', error);
        }
      );
  }
}
