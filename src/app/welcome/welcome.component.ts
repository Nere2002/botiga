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


// ----------------------------- AÑADIR AL CARRITO -----------------------------------------------

  buyCart(): void {
    // Create a new invoice with the user ID and total
    const invoice = {
      user_id: this.userId,
      total: this.total
      // Add other invoice properties if needed
    };

    // Make a POST request to save the invoice to the database
    this.billService.createInvoice(invoice)
      .subscribe(
        (invoiceId: number) => {
          // Invoice created successfully, save the cart items
          this.saveCartItems(invoiceId);
        },
        error => {
          console.error('Error creating invoice:', error);
        }
      );
  }

  saveCartItems(invoiceId: number): void {
    // Iterate over the cart items and save each item to the database
    for (const product of this.productsInCart) {
      const cartItem = {
        user_id: this.userId,
        product_id: product.id,
        quantity: 1, // You can modify this according to your requirements
        factura_id: invoiceId
        // Add other cart item properties if needed
      };

      // Make a POST request to save the cart item to the database
      this.cartService.addToCart(cartItem)
        .subscribe(
          () => {
            // Cart item saved successfully
            console.log('Cart item saved:', cartItem);
          },
          error => {
            console.error('Error saving cart item:', error);
          }
        );
    }

    // Clear the cart after saving the items
    this.clearCart();
  }

  clearCart(): void {
    this.productsInCart = [];
    this.total = 0;
  }











} // -------------------------------- FIN COMPONENTE -----------------------------------------------
