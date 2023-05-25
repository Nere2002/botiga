import { Component, OnInit } from '@angular/core';
import { ProductService } from "../product.service";
import { CartService } from "../cart.service";
import { BillService } from "../bill.service";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { WalletService } from "../wallet.service";
import Web3 from "web3";

class Product {
  name = '';
  description = '';
  price = '';
  id!: number;
  quantity = 0;
  cryptoPrice!: number;
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
  quantityTotal: number = 0;


  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private billService: BillService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private walletService: WalletService

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
      )

    this.authService.getUserId().subscribe(
      userId => {
        this.userId = userId;
      },
      error => {
        console.error('Error al obtener el ID del usuario:', error);
      }
    );

    this.getBitcoinPriceInEuros();

  }

  // ------------------------ AÑADIR CARRITO ---------------------------------

  addToCart(productId: number, quantity: number): void {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      // Verificar si el producto ya está en el carrito
      const existingProduct = this.productsInCart.find(p => p.id === product.id);
      if (existingProduct) {
        // Si el producto ya está en el carrito, actualizar la cantidad
        existingProduct.quantity += quantity;
      } else {
        // Si el producto no está en el carrito, añadirlo con la cantidad
        product.quantity = quantity;
        this.productsInCart.push(product);
      }

      this.total += +product.price * quantity;
      this.quantityTotal += quantity;
    }
  }

  // ----------------------------- CRIPTOMONEDA --------------------------------

  getBitcoinPriceInEuros(): void {
    const apiUrl = 'https://api.coincap.io/v2/assets/bitcoin';

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        const bitcoinPriceInEuros = response?.data?.priceUsd; // CoinCap devuelve el precio de Bitcoin en dólares, asumiendo que se utiliza como referencia para calcular el precio en euros
        this.calculateProductCryptoPrices(bitcoinPriceInEuros);
      },
      error => {
        console.error('Error al obtener el precio de Bitcoin:', error);
      }
    );
  }

  calculateProductCryptoPrices(bitcoinPriceInEuros: number): void {
    this.products.forEach(product => {
      const productCryptoPrice = +product.price / bitcoinPriceInEuros;
      product.cryptoPrice = productCryptoPrice; // Agregar el valor en bitcoins al producto
    });
  }

  // ---------------------------- Borrar carrito -----------------------------

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
      user_id: this.authService.userId,
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
        user_id: this.authService.userId,
        product_id: product.id,
        quantity: product.quantity, // You can modify this according to your requirements
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

  purchaseWithCrypto(): void {
    const web3 = new Web3(window.ethereum);

    // Obtener las cuentas disponibles en MetaMask
    web3.eth.getAccounts().then(accounts => {
      if (accounts.length > 0) {
        const userWalletAddress = accounts[0]; // Obtener la primera cuenta como dirección de billetera del usuario

        const totalInEthers = this.total / 1e18; // Convertir el valor total a ethers (18 decimales)

        this.sendTransaction(userWalletAddress, totalInEthers)
          .then(transactionHash => {
            // Transacción enviada exitosamente
            console.log('Transaction hash:', transactionHash);

            // Realiza las acciones necesarias después de la compra, como limpiar el carrito y redirigir a una página de confirmación
            this.clearCart();

          })
          .catch(error => {
            // Error al enviar la transacción
            console.error('Error sending transaction:', error);
          });
      } else {
        // No se encontraron cuentas en MetaMask
        console.error('No se encontraron cuentas en MetaMask.');
      }
    });
  }

// ...

  userWalletAddress: string = '0x5134D6782c79e416933649C6A2e7e0b21b6D1899'; // Declaración de la variable userWalletAddress

  async sendTransaction(toAddress: string, value: number): Promise<string> {
    try {
      // Comprobar si Metamask está instalado y disponible
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Metamask is not installed or not available');
      }

      // Crear una transacción y enviarla usando la API de Metamask
      const transaction = {
        from: this.userWalletAddress,
        to: toAddress,
        value: '0x' + (value * Math.pow(10, 18)).toString(16) // Convertir el valor a wei (18 decimales)
      };

      const transactionHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transaction]
      });

      return transactionHash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }
}
