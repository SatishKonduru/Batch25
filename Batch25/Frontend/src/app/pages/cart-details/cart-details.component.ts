import { Component, Inject, inject, OnInit } from '@angular/core';
import { TokenAuthService } from '../../services/token-auth.service';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { globalProperties } from '../../shared/globalProperties';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'cart-details',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule, FormsModule],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit{
  timestamp = Date.now()
  userId: any
  userToken = inject(TokenAuthService)
  cartService = inject(CartService)
  snackbar = inject(SnackbarService)
  responseMsg : any = ''
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any){}

  ngOnInit(): void {
    this.userId = this.userToken.getUserId()
    this.cartService.getCartItems(this.userId)
  }

  updateTotal(product: any){
    product.total = product.product.price * product.quantity
  }

  calculateTotal(product: any){
    return product.total || (product.product.price * product.quantity)
  }

  calculateGrandTotal(){
    let grandTotal = 0
    for(let product of this.dialogData.data.items){
      grandTotal += product.total || (product.product.price * product.quantity)
    }
    return grandTotal
  }
  

  delete(product: any){
    this.cartService.deleteFromCart(this.userId, product.product.id).subscribe({
      next: (res: any) => {
        this.cartService.getCartItems(this.userId).subscribe((data: any) => {
          this.dialogData.data = data.cart
        })
        this.cartService.notifyProductAdded()
        this.responseMsg = res?.message
        this.snackbar.openSnackbar(this.responseMsg, 'success')
      },
      error: (err: any) => {
        if(err.error?.message){
          this.responseMsg = err.error?.message
        }
        else{
          this.responseMsg = globalProperties.genericError
        }
        this.snackbar.openSnackbar(this.responseMsg, globalProperties.error)
      }
    })
  }




}
