import { AfterViewChecked, Component, inject } from '@angular/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { jwtDecode } from 'jwt-decode';
import { Router, RouterModule } from '@angular/router';
import { TokenAuthService } from '../../services/token-auth.service';
import { Observable } from 'rxjs';
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
export class HeaderComponent implements AfterViewChecked{
// user: string = ''
// payload: any = {}
userToken$ : Observable<string>
cartService = inject(CartService)
responseMsg: any = ''
snacbar = inject(SnackbarService)
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
