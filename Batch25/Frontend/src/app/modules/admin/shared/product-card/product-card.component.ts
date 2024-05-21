import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [AngularMaterialModule, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
@Input()  products : any
@Input() menDrawer : any
@Output() menDrawerContentTitle = new EventEmitter()
@Output() menDrawerFormData = new EventEmitter()


toggleMenDrawer(product: any){
  this.menDrawer.toggleDrawer()
  this.menDrawerContentTitle.emit('Update Product')
  this.menDrawerFormData.emit(product)
}




}
