import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, inject, OnInit } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdersComponent } from '../orders/orders.component';
import { OrdersService } from '../orders/orders.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { globalProperties } from '../../../shared/globalProperties';

@Component({
  selector: 'update-order-status',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-order-status.component.html',
  styleUrl: './update-order-status.component.css'
})
export class UpdateOrderStatusComponent implements OnInit{
  updateForm: any = FormGroup
  formBuilder = inject(FormBuilder)
  formData: any
  orderService = inject(OrdersService)
  onEmitStatus = new EventEmitter()
  responseMsg: any = ''
  snackbar = inject(SnackbarService)
  dialogRef = inject(MatDialogRef<UpdateOrderStatusComponent>)
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any){}

ngOnInit(): void {
  this.formData = this.dialogData.orderData
  this.updateForm = this.formBuilder.group({
    orderId: [''],
    status: ['']
  })
  this.updateForm.patchValue({
    orderId: this.formData.id,
    status: this.formData.status
  })

}

updateStatus(){
  const data = this.updateForm.value
  this.orderService.updateOrderStatus(data.orderId, data.status).subscribe({
    next: (res: any) => {
      this.onEmitStatus.emit()
      this.dialogRef.close()
      this.responseMsg = res?.message
      this.snackbar.openSnackbar(this.responseMsg, 'success')
    },
    error: (err: any) => {
      if(err.error?.message){
        this.responseMsg = err.error?.message
      }
      else{
        this.responseMsg=globalProperties.genericError
      }
      this.snackbar.openSnackbar(this.responseMsg, globalProperties.error)
    }
  })
}




}
