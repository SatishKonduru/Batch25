import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TokenAuthService } from '../../services/token-auth.service';
import { OrderService } from '../../services/order.service';
import { SnackbarService } from '../../services/snackbar.service';
import { CartService } from '../../services/cart.service';
import { globalProperties } from '../../shared/globalProperties';

@Component({
  selector: 'checkout',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
userId: any
userToken = inject(TokenAuthService)
orderService = inject(OrderService)
responseMsg: any =''
snackbar = inject(SnackbarService)
cartService = inject(CartService)
dialogRef = inject(MatDialogRef<CheckoutComponent>)

constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any){}

ngOnInit(): void {
  this.userId = this.userToken.getUserId()
}

placeOrder(order: any){
this.orderService.newOrder(this.userId, order).subscribe({
  next: (res: any) => {
    this.cartService.notifyProductAdded()
    this.dialogRef.close()
    this.responseMsg = res?.message
    this.snackbar.openSnackbar(this.responseMsg,'success')
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
