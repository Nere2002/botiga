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

  buyCart(): void {
    const cartItems = this.productsInCart.map(product => {
      return { product_id: product.id, quantity: 1 }; // You can modify the quantity if needed
    });

    this.billService.createBill(this.userId, this.total, cartItems).subscribe(
      response => {
        console.log('Factura creada:', response);
        // Aquí puedes agregar cualquier lógica adicional, como limpiar el carrito
      },
      error => {
        console.error('Error al crear la factura:', error);
      }
    );
  }


}
