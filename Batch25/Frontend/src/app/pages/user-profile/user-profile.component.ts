import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { TokenAuthService } from '../../services/token-auth.service';
import { userModel } from '../../shared/models/model';
import { Observable, map, shareReplay } from 'rxjs';
import { SnackbarService } from '../../services/snackbar.service';
import { globalProperties } from '../../shared/globalProperties';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

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
  dialog = inject(MatDialog)
  wishlistCount : number
  orderDetails : any = []
  ordersCount : number = 0
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
    this.getWishlistCount(this.userId)
    this.getOrderDetails(this.userId)
  }

  getUserDetails(userId: any){
    this.userDetails$ = this.userService.getUserById(userId).pipe(
      map((res: any) => res.userDetails),
      shareReplay()
    )
  }

  @ViewChild('fileInput') fileInput : ElementRef;
  @ViewChild('fileInputFiled') fileInputField : ElementRef

  image : any
  imageSelected: boolean = false

  onFileSelected(event: any):void {
    const fileInput = event.target
    if(fileInput.files && fileInput.files.length > 0){
      const file: File = fileInput.files[0]
      this.image = file
      this.previewImage(file)
      this.fileInputField.nativeElement.value = file.name
      this.imageSelected = true
    }
  }

  openFileInput():void{
    this.fileInput.nativeElement.click()
  }

  selectedFileName : string | undefined;
  selectedImage : string | undefined;

previewImage(file: File){
  const reader = new FileReader()
  reader.onload = (e) => {
    this.selectedImage = e.target?.result as string
  }
  reader.readAsDataURL(file)
}


updateUser(){
  const userDetails = this.userForm.value
  const imageFile = this.image
  const formData = new FormData()
  formData.append('name', userDetails.name)
  formData.append('email', userDetails.email)
  formData.append('phone', userDetails.phone)
  formData.append('apartment', userDetails.apartment)
  formData.append('street', userDetails.street)
  formData.append('city', userDetails.city)
  formData.append('country', userDetails.country)
  formData.append('image', imageFile)

  this.userService.updateUser(this.userId, formData).subscribe({
    next: (res: any) => {
      if(res?.message){
        this.responseMsg = res?.message
        this.getUserDetails(this.userId)
        this.snackbar.openSnackbar(this.responseMsg,'success')
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
}

changePassword(){
  const dialogConfig = new MatDialogConfig()
  dialogConfig.width = '500px'
  dialogConfig.disableClose = true
  dialogConfig.autoFocus = true
  this.dialog.open(ForgotPasswordComponent, dialogConfig)
}

getWishlistCount(uId: any){
  this.userService.wishListCount(uId).subscribe({
    next: (res: any) => {
        this.wishlistCount = res.wishlistCount
    },
    error: (err: any) => {
      
    }
  })
}

getOrderDetails(uId: any){
this.userService.getOrders(uId).subscribe({
  next: (res: any) => {
    this.orderDetails = res.orderDetails
    let totalCount = 0
    this.orderDetails.forEach((order: any) => {
      order.items.forEach((item: any) => {
        totalCount += item.quantity
      })
    })
    this.ordersCount = totalCount
  },
  error: (err: any) => {
    console.log('Error while getting order Details')
  }
})
}


getStatusColor(status: string): string{
  switch(status){
    case 'Pending': return 'red';
    case 'Shipped': return 'blue';
    case 'Deliverd' : return 'green'
    default: return 'black'
  }
}

}
