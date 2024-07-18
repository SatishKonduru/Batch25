import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { MenService } from '../../modules/admin/products/men/men.service';
import { productModel } from '../../shared/models/model';
import { map, Observable } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';

@Component({
  selector: 'men-products',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './men-products.component.html',
  styleUrl: './men-products.component.css'
})
export class MenProductsComponent implements OnInit{
  timestamp = Date.now()
  menService = inject(MenService)
  menProducts$ !: Observable<productModel[]>
  loaderSerive = inject(LoaderService)
  spinnerSize : number = 30
  dialog = inject(MatDialog)
  ngOnInit(): void {
    this.getProducts()
  }

  getProducts(){
    const products$ = this.menService.getProducts()
    const loadProducts$ = this.loaderSerive.showLoader(products$)
    this.menProducts$ = loadProducts$.pipe(
      map((res: any) => {
          const pArray = res.products || []
          return pArray.filter((p: any) => p.category.name == 'Men')
      })
    )
  }
  openProductDetails(product: any){
    console.log("Selected Product Details:", product)
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = product
    dialogConfig.width = '940px'
    dialogConfig.position = {left: '10px'}
    dialogConfig.autoFocus = true
    dialogConfig.disableClose = true
    this.dialog.open(ProductDetailsComponent, dialogConfig)
  }

}
