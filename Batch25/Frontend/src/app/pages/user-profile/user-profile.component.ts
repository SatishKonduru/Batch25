import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { TokenAuthService } from '../../services/token-auth.service';
import { userModel } from '../../shared/models/model';
import { Observable, map, shareReplay } from 'rxjs';
import { SnackbarService } from '../../services/snackbar.service';
import { globalProperties } from '../../shared/globalProperties';

@Component({
  selector: 'user-profile',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  providers: [UserService, TokenAuthService, SnackbarService]
})
export class UserProfileComponent implements OnInit{
  userId: any
  userToken = inject(TokenAuthService)
  userService = inject(UserService)
  userDetails$ : Observable<userModel>
  private formBuilder = inject(FormBuilder)
  snackbar = inject(SnackbarService)
  responseMsg: any = ''
  userForm: any = FormGroup 

  ngOnInit(): void {
    this.userId = this.userToken.getUserId()
    this.getUserDetails(this.userId)
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.pattern(globalProperties.emailRegx)],
      phone: ['', Validators.pattern(globalProperties.phoneRegex)],
      apartment: [''],
      street: [''],
      city: [''],
      state: [''],
      country: ['']
    })

    this.userDetails$.subscribe(res => {
      this.userForm.patchValue(res)
    })
  }

  getUserDetails(userId: any){
    this.userDetails$ = this.userService.getUserById(userId).pipe(
      map((res: any) => res.userDetails),
      shareReplay()
    )
  }

}
