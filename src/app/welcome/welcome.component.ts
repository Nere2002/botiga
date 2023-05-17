import {Component, OnInit} from '@angular/core';
import {ProductService} from "../product.service";

class Product {
  name= ' ' ;
  description= ' ';
  price= ' ';
  id!: number;
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  products: Product[] = [];
  userId: any;


  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe(
        products => {
          this.products = products;
        },
        error => {
          console.error('Error al obtener los productos:', error);
        }
      );
  }
  addToCart(productId: number, userId: number): void {
    this.productService.addToCart(productId, userId).subscribe(
      result => {
        console.log('Producto agregado al carrito');
      },
      error => {
        console.error('Error al agregar el producto al carrito:', error);
      }
    );
  }


}
