import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { globalProperties } from '../../shared/globalProperties';

@Component({
  selector: 'password-reset',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule, FormsModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent implements OnInit{
  token: string =''
  password: string;
  confirmPassword: string;
  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)
  userService = inject(UserService)
  snackbar = inject(SnackbarService)
  responseMsg : any =''
ngOnInit(): void {
  this.activatedRoute.params.subscribe(params => {
    this.token = params['token']
  })
}

updatePassword(){
  if(this.password != this.confirmPassword){
    return
  }
  var data = {
    token: this.token,
    newPassword: this.password
  }
  this.userService.updatePassword(data).subscribe({
    next: (res:any) => {
      this.responseMsg = res?.message
      this.snackbar.openSnackbar(this.responseMsg, 'success')
      this.router.navigate(['/login'])
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
