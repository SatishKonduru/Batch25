import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild, inject } from '@angular/core';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { Observable, Subject, debounceTime, distinctUntilChanged, map, shareReplay, startWith, switchMap } from 'rxjs';
import { productModel } from '../../../../shared/models/model';
import { WomenService } from './womenService';
import { LoaderService } from '../../../../services/loader.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationComponent } from '../../shared/confirmation/confirmation.component';
import { SnackbarService } from '../../../../services/snackbar.service';
import { globalProperties } from '../../../../shared/globalProperties';

@Component({
  selector: 'app-women',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule, FormsModule],
  templateUrl: './women.component.html',
  styleUrl: './women.component.css'
})
export class WomenComponent implements OnInit{
  
  selectedItem: any;
  showDetails: boolean = false;
  searchKey: any ;
  displayedColumns: string[] = ['name', 'price', 'color', 'countInStock']
  womenProducts$! : Observable<productModel[]> 
  responseMsg: string = ''
  womenService = inject(WomenService)
  loaderService = inject(LoaderService)
  @ViewChild(MatPaginator) paginator! : MatPaginator
  private searchTerms = new Subject<string>();
  spinnerSize: number = 30;
  router = inject(Router)
  dialog = inject(MatDialog)
  @Output() deleteEmitter = new EventEmitter()
  snackbar = inject(SnackbarService)
  showItemDetails(item: any) {
    this.selectedItem = item;
    this.showDetails = true;
  }
  onClose(){
    this.selectedItem = null;
    this.showDetails = false;
  }

  ngOnInit(): void {
      // this.getProducts()
      this.womenProducts$ = this.searchTerms.pipe(
        startWith(''),
        debounceTime(500), // Debounce time of 300ms
        distinctUntilChanged(), // Only emit when the search term changes
        switchMap((searchKey: string) => this.getProducts(searchKey))
      ).pipe(shareReplay())
  
      // Fetch products on component initialization without search key
      this.searchTerms.next('');
  }

  getProducts(searchKey: string): Observable<any> { // Return type explicitly set to Observable<any>
    return this.womenProducts$ = this.loaderService.showLoader(this.womenService.getProducts()).pipe(
      map((res: any) => {
        const productArray = res.products || [];
        return productArray.filter(
          (product: any) =>
            product.category.name == "Women" &&
            (product.name
              .trim()
              .toLowerCase()
              .includes(searchKey.trim().toLowerCase()) ||
              product.color
                .trim()
                .toLowerCase()
                .includes(searchKey.trim().toLowerCase()))
        );
      })
    );
  }

  applyFilter(value: any) {
    // this.getProducts(value);
    this.searchTerms.next(value);
  }
  onSearchClear() {
    this.searchKey = "";
    this.applyFilter("");
  }

  // openDrawer() {
  //   this.womenService.openDrawer();
  // }

  onUpdate(item: any){
    this.womenService.setFormData(item)
    this.router.navigate(['admin/dashboard/products/men'], { queryParams: { openDrawer: true } });
  }
 
  deleteProduct(product: any){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      message: 'Delete: ' + product.name
    }
   const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig)
    dialogRef.componentInstance.afterDelete.subscribe({
      next: (res: any) => {
        this.delete(product.id)
        dialogRef.close()
        this.onClose()
      }
    })

  }
   delete(id: any){
    this.womenService.deleteProduct(id).subscribe({
      next: (res: any) => {
        this.getProducts('')
        
        if(res?.message) {
          this.responseMsg = res?.message
        }
        this.snackbar.openSnackbar(this.responseMsg, 'success')
      },
      error: (err: any) => {
        if(err.error?.message) {
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
