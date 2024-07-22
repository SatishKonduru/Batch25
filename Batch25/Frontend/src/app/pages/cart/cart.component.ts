import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { CartService } from '../../services/cart.service';

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
ngOnInit(): void {
  this.cartService.isCartOpen().subscribe(status => {
    this.isOpen = status
  }
  )
}

closeCart(){
  this.cartService.toggleCart()
}


}
