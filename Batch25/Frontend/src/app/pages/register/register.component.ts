import { Component, OnInit } from '@angular/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { globalProperties } from '../../shared/globalProperties';

@Component({
  selector: 'register',
  standalone: true,
  imports: [AngularMaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [UserService]
})
export class RegisterComponent implements OnInit{

 public registerForm: any = FormGroup
 public responseMsg: any = ''
 constructor(private _userService: UserService,
            private _formBuilder: FormBuilder,
            private _router: Router
 ){}

 ngOnInit(): void {
   this.registerForm = this._formBuilder.group({
    name: ['', [Validators.required, Validators.pattern(globalProperties.nameRegx)]],
    email: ['', [Validators.required, Validators.pattern(globalProperties.emailRegx)]],
    password: ['', Validators.required],
    phone: ['',[Validators.required, Validators.pattern(globalProperties.phoneRegex)]],
    apartment: [''],
    street: [''],
    city: [''],
    state: [''],
    zip: [''],
    country: ['']
   })
 }



 onRegister(){
  const data = this.registerForm.value
  this._userService.userRegister(data)
  .subscribe((res: any) => {
    this.responseMsg = res?.message
    console.log(this.responseMsg)
    this._router.navigate(['/login'])
  }, (err: any) => {
    if(err.error?.message){
      this.responseMsg = err.error?.message
    }
    else{
      this.responseMsg = globalProperties.genericError
    }
    console.log(this.responseMsg)
  })
 }


}
