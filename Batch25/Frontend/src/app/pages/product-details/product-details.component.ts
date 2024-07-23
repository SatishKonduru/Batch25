import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { TokenAuthService } from '../../services/token-auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { globalProperties } from '../../shared/globalProperties';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'product-details',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
htmlContent : any
sanitizer = inject(DomSanitizer)
userService = inject(UserService)
tokenService = inject(TokenAuthService)
responseMsg : any = ''
snackbar = inject(SnackbarService)
cartService = inject(CartService)
router = inject(Router)
constructor(@Inject(MAT_DIALOG_DATA) public dialogData : any){
  console.log("dialogData: ", dialogData)
  const htmlString = dialogData.richDescription
  this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(htmlString)

}
addToWishList(product: any){
  let userId = this.tokenService.getUserId()
  if(userId){
    this.userService.addToWishList(userId, product).subscribe({
      next: (res:any) => {
        if(res?.message){
          this.responseMsg = res?.message
          this.snackbar.openSnackbar(this.responseMsg, 'success')
        }
      },
      error: (err: any) => {
        if(err.error?.message){
          this.responseMsg = err.error?.message
        }
        else{
          this.responseMsg = globalProperties.genericError
        }
        this.snackbar.openSnackbar(this.responseMsg,globalProperties.error)
      }
    })
  }
  else{}
}

addToCart(){
  let userId = this.tokenService.getUserId()
  const token = sessionStorage.getItem('token')
  if(!token){
    this.responseMsg = 'Please Login'
    this.snackbar.openSnackbar(this.responseMsg, globalProperties.error)
  }
  else{
    this.cartService.addToCart(userId, this.dialogData).subscribe({
      next: (res: any) => {
        this.responseMsg = res?.message
        this.snackbar.openSnackbar(this.responseMsg, 'succes')
        this.cartService.notifyProductAdded()
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

}
