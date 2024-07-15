import { Component, inject, OnInit } from '@angular/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { globalProperties } from '../../shared/globalProperties';
import { jwtDecode } from 'jwt-decode';
import { TokenAuthService } from '../../services/token-auth.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'login',
  standalone: true,
  imports: [AngularMaterialModule, FormsModule, ReactiveFormsModule, RouterModule, ForgotPasswordComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [UserService, SnackbarService, TokenAuthService]
})
export class LoginComponent implements OnInit{
public loginForm: any = FormGroup
responseMsg: any = ''
payload: any;
dialog = inject(MatDialog)
constructor(private _formBuilder: FormBuilder,
  private _userService: UserService,
  private _snackbar: SnackbarService,
  private _router: Router,
  private _tokenAuthService: TokenAuthService
){}

ngOnInit(): void {
  this.loginForm = this._formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(globalProperties.emailRegx)]],
    password: ['', [Validators.required]]
  })
}

onLogin(){
  const data = this.loginForm.value
  this._userService.userLogin(data)
  .subscribe({
    next: (res: any) => {
      const token = res?.token
      // sessionStorage.setItem('token', token)
      this._tokenAuthService.setToken(token)
      this.payload = jwtDecode(token)
      if(this.payload.role && this.payload.role === 'admin'){
        this._router.navigate(['/admin/dashboard'])
      }
      else{
        this._router.navigate(['/'])
      }
    },
    error: (err: any) => {
      if(err.error?.message){
        this.responseMsg = err.error?.message  
      }
      else{
        this.responseMsg = globalProperties.genericError
      }
      this._snackbar.openSnackbar(this.responseMsg, globalProperties.error)
    }
  })
}
forgotPassword(){
  const dialogConfig = new MatDialogConfig()
  dialogConfig.width = '500px'
  dialogConfig.disableClose = true
  dialogConfig.autoFocus = true
  this.dialog.open(ForgotPasswordComponent, dialogConfig)
}

}
