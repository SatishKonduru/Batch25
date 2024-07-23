import { AfterViewChecked, Component, inject, OnInit } from '@angular/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { jwtDecode } from 'jwt-decode';
import { Router, RouterModule } from '@angular/router';
import { TokenAuthService } from '../../services/token-auth.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartComponent } from '../../pages/cart/cart.component';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../services/snackbar.service';
import { globalProperties } from '../globalProperties';

@Component({
  selector: 'header',
  standalone: true,
  imports: [AngularMaterialModule, RouterModule, CommonModule, CartComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [TokenAuthService]
})
export class HeaderComponent implements AfterViewChecked, OnInit{
// user: string = ''
// payload: any = {}
userToken$ : Observable<string>
cartService = inject(CartService)
responseMsg: any = ''
snacbar = inject(SnackbarService)
userId: any;
cartCount: any
constructor(private _tokenAuth: TokenAuthService, private _router: Router){}

ngAfterViewChecked(): void {
  // const token = sessionStorage.getItem('token')
  // if(token){
  //   this.payload = jwtDecode(token)
  //   this.user = this.payload.name
  // }
  // else{
  //   this.user= ''
  // }
  this.userToken$ = this._tokenAuth.getToken()

}

ngOnInit(): void {
  this.getCartCount()
  this.cartService.productAdded$.subscribe(() => {
    this.getCartCount()
  })
}


async getCartCount(){
try{
  this.userId = this._tokenAuth.getUserId()
  this.cartService.getCartItems(this.userId).pipe(
    map(item => item.cart.items)
  ).subscribe(cartItems => {
    this.cartCount = cartItems.length
  })
}
catch(error){
  console.log("Error while fetching cart Items: ", error)
}
}
onExit(){
  // sessionStorage.removeItem('token')
  // this.user = ''
  // this.payload = {}
  this._tokenAuth.exit()
  this._router.navigate(['/'])
}


openCart(){
  const token = sessionStorage.getItem('token')
  if(!token){
    this.responseMsg = 'Please Login...'
    this.snacbar.openSnackbar(this.responseMsg, globalProperties.error)
  }
  else{
    this.cartService.toggleCart()
  }
}



}
