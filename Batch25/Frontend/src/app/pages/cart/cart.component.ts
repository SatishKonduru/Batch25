import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { CartService } from '../../services/cart.service';
import { TokenAuthService } from '../../services/token-auth.service';
import { map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
isOpen : boolean = false
cartService = inject(CartService)
userId : any
userToken = inject(TokenAuthService)
cartItems$ : Observable<any>
ngOnInit(): void {
  this.cartService.isCartOpen().subscribe(status => {
    this.isOpen = status
  }
  )
  this.userId = this.userToken.getUserId()
  this.getCartItens()
  this.cartService.productAdded$.subscribe(() => {
    //Refresh cart data when notified that a product has been added
    this.getCartItens()
  })
}

closeCart(){
  this.cartService.toggleCart()
}

getCartItens(){
  this.cartItems$ = this.cartService.getCartItems(this.userId).pipe(
    map(item => {
      if(item.cart.status == 'Active'){
        return item.cart
      }
    }),
    shareReplay()
  )
}

openCartDetails(){
  
}

}
