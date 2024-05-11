import { Component, OnInit, inject } from '@angular/core';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SnackbarService } from '../../../../services/snackbar.service';
import { MenService } from '../../men/men.service';
import { Observable, map } from 'rxjs';
import { categoryModel, productModel } from '../../../../shared/models/model';

@Component({
  selector: 'men',
  standalone: true,
  imports: [
    AngularMaterialModule, 
    ProductCardComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule
  ],
  templateUrl: './men.component.html',
  styleUrl: './men.component.css',
  providers: [SnackbarService, MenService ]
})
export class MenComponent implements OnInit{

  searchKey : string =''
  menProducts$ : Observable<productModel[]>;
  menService = inject(MenService)
  categories$: Observable<categoryModel[]>;
  responseMsg: string = ''
  snackbar = inject(SnackbarService)

ngOnInit(): void {
  this.getProducts()
  this.getCategories()
}
  getProducts(searchKey: string = ''){
    const products$ = this.menService.getProducts()
    this.menProducts$ = products$.pipe(
      map((res: any) => {
        const productArray = res.products || []
        return productArray.filter((product: any) => product.category.name == 'Men' && 
      (product.name.trim().toLowerCase().includes(searchKey.trim().toLowerCase()) || 
      product.brand.trim().toLoserCase().includes(searchKey.trim().toLowerCase())))
      })
    )

  }

  getCategories(){
    const category$ = this.menService.getCategories()
    this.categories$= category$.pipe(
      map((res: any) => {
        const categoryArray = res.categories || []
        return categoryArray
      })
    )

  }

  applyFilter(value: any) {
    this.getProducts(value)
  }

  onSearchClear(){
    this.searchKey = ''
    this.applyFilter('')
  }

}
