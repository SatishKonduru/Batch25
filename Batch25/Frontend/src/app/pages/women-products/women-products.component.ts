import { Component, inject } from '@angular/core';
import { MenService } from '../../modules/admin/products/men/men.service';
import { LoaderService } from '../../services/loader.service';
import { map, Observable } from 'rxjs';
import { productModel } from '../../shared/models/model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';

@Component({
  selector: 'women-products',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './women-products.component.html',
  styleUrl: './women-products.component.css'
})
export class WomenProductsComponent {
  timestamp = Date.now();
  menService = inject(MenService)
  womenProducts$!: Observable<productModel[]>;
  loaderService = inject(LoaderService);
  spinnerSize: number = 30;
  dialog = inject(MatDialog)

  ngOnInit(): void {
    this.getProducts()
}
getProducts() {
  const products$ = this.menService.getProducts()
  const loadProducts$ = this.loaderService.showLoader(products$);
  this.womenProducts$ = loadProducts$.pipe(
    map((res: any) => {
      const productArray = res.products || [];
      return productArray.filter(
        (product: any) =>
          product.category.name == "Women"
        );
    })
  );
}

openProductDetails(product: any){
  console.log("Product Details: ", product)
  const dialogConfig = new MatDialogConfig()
  dialogConfig.data = product
  dialogConfig.width = '940px'
  dialogConfig.position = {left:'10px'}
  dialogConfig.autoFocus = true
  dialogConfig.disableClose = true
  this.dialog.open(ProductDetailsComponent, dialogConfig)
}
}
