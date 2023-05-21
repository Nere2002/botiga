import {Component, OnInit} from '@angular/core';
import {ProductService} from "../product.service";
import {CartService} from "../cart.service";
import {BillService} from "../bill.service";
import { AuthService } from "../auth.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";



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
  productsInCart: Product[] = [];
  total: number = 0;
  userId: any;


  constructor(
      private productService: ProductService ,
      private cartService: CartService,
      private billService: BillService,
      private authService: AuthService,
      private router: Router,
      private http: HttpClient

  ) { }

  ngOnInit(): void {

    this.userId = this.authService.userId;
    console.log(this.authService.userId);

    this.productService.getProducts()
      .subscribe(
        products => {
          this.products = products;
        },
        error => {
          console.error('Error al obtener los productos:', error);
        }
      );

    //this.userId = this.authService.getUserId();

    this.authService.getUserId().subscribe(
      userId => {
        this.userId = userId;
      },
      error => {
        console.error('Error al obtener el ID del usuario:', error);
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


/*  buyCart(): void {
    // Realizar la compra del carrito
    const data = { userId: this.userId, total: this.total };

    // Enviar la factura al servidor
    this.http.post<any>('/api/insertar_factura', data).subscribe(response => {
      // Obtener el ID de la factura creada
      const facturaId = response.facturaId;

      // Guardar los productos del carrito en el servidor
      this.http.post('/api/insertar_cart', this.productsInCart).subscribe(response => {
        console.log(response); // Mostrar mensaje de éxito o realizar otras acciones necesarias
        // ...
      });
    });
  }*/










} // -------------------------------- FIN COMPONENTE -----------------------------------------------
