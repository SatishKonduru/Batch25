import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { globalProperties } from '../../shared/globalProperties';

@Component({
  selector: 'forgot-password',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit{
forgotForm: any = FormGroup
formBuilder = inject(FormBuilder)
userService = inject(UserService)
responseMsg : any = ''
snackbar = inject(SnackbarService)
dialogRef = inject(MatDialogRef<ForgotPasswordComponent>)

ngOnInit(): void {
  this.forgotForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(globalProperties.emailRegx)]]
  })
}

getPasswordLink(){
  const formData =  this.forgotForm.value
  var data = {
    email: formData.email
  }
  const token = sessionStorage.getItem('token')
  if(token){
    sessionStorage.removeItem('token')
  }
  this.userService.getPasswordResetLink(data).subscribe({
    next: (res: any) => {
      if(res?.message){
        this.responseMsg = res?.message
        this.snackbar.openSnackbar(this.responseMsg, 'success')
      }

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

  this.dialogRef.close()
}



}
