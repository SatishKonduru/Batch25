import { Component, OnInit, inject } from '@angular/core';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WomenService } from './women.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { productModel } from '../../../../shared/models/model';
import { Observable, map } from 'rxjs';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'women',
  standalone: true,
  imports: [AngularMaterialModule, CommonModule, FormsModule],
  templateUrl: './women.component.html',
  styleUrl: './women.component.css',
  providers: [WomenService, SnackbarService, LoaderService]
})
export class WomenComponent  implements OnInit{
selectedItem : any
showDetails:boolean = false
searchKey : any
displayedColumns: string[] = ['name', 'price', 'color','countInStock']
womenProducts$ : Observable<productModel[]>
responseMsg: string = ''
womenService = inject(WomenService)
snackbar = inject(SnackbarService)
loaderService = inject (LoaderService)

ngOnInit(): void {
  this.getProducts('')
}
applyFilter(filterValue: any){
this.getProducts(filterValue)
}
onSearchClear(){
  this.searchKey = ''
  this.applyFilter('')
}
onClose(){
  this.selectedItem = null
  this.showDetails = false
}
showItemDetails(item: any){
  this.selectedItem = item
  this.showDetails = true
}
getProducts(searchKey : string = ''){
  const products$ = this.womenService.getProducts()
  const loadProducts$ = this.loaderService.showLoader(products$)
  this.womenProducts$ = loadProducts$.pipe(
    map((res: any) => {
      const productArray = res.products || []
      return productArray.filter((product: any) => product.category.name == 'Women' &&
      (product.name.trim().toLowerCase().includes(searchKey.trim().toLowerCase()) || 
      product.color.trim().toLowerCase().includes(searchKey.trim().toLowerCase())))

    })
  )
}



}
