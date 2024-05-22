import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MenService } from '../../men/men.service';
import { MAT_MENU_SCROLL_STRATEGY } from '@angular/material/menu';
import { SnackbarService } from '../../../../services/snackbar.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { globalProperties } from '../../../../shared/globalProperties';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [AngularMaterialModule, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  providers: [MenService]
})
export class ProductCardComponent {
@Input()  products : any
@Input() menDrawer : any
@Output() menDrawerContentTitle = new EventEmitter()
@Output() menDrawerFormData = new EventEmitter()
@Output() deleteEmitter = new EventEmitter()
dialog = inject(MatDialog)
menService = inject(MenService)
snackbar = inject(SnackbarService)
responseMsg : string = ''


toggleMenDrawer(product: any){
  this.menDrawer.toggleDrawer()
  this.menDrawerContentTitle.emit('Update Product')
  this.menDrawerFormData.emit(product)
}

deleteProduct(product: any){
  const dialogConfig = new MatDialogConfig()
  dialogConfig.data = {
    message: "Delete "+ product.name
  }
  const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig )
  dialogRef.componentInstance.afterDelete.subscribe({
    next: (res: any) => {
      this.delete(product.id)
      dialogRef.close()
    }
  })
}


delete(id: any){
  this.menService.deleteProduct(id).subscribe({
    next: (res: any) => {
      if(res?.message) {
        this.responseMsg = res?.message
      }
      this.deleteEmitter.emit()
      this.snackbar.openSnackbar(this.responseMsg, 'succes')
    },
    error: (err: any) => {
      if(err.error?.message){
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
