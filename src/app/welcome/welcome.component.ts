import {Component, OnInit} from '@angular/core';
import {ProductService} from "../product.service";
import {CartService} from "../cart.service";
import {BillService} from "../bill.service";

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
  productsInCart: Product[] = [];
  total: number = 0;


  constructor(
      private productService: ProductService ,
      private cartService: CartService,
      private billService: BillService

  ) { }

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
  addToCart(productId: number): void {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.productsInCart.push(product);
      this.total += +product.price;
    }
  }
  removeFromCart(productId: number): void {
    const index = this.productsInCart.findIndex(p => p.id === productId);
    if (index !== -1) {
      const removedProduct = this.productsInCart.splice(index, 1)[0];
      this.total -= +removedProduct.price;
    }
  }





}
