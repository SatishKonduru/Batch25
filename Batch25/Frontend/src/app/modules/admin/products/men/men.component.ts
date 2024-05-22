import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { SnackbarService } from '../../../../services/snackbar.service';
import { MenService } from '../../men/men.service';
import { Observable, map } from 'rxjs';
import { categoryModel, productModel } from '../../../../shared/models/model';
import { globalProperties } from '../../../../shared/globalProperties';
import { MatDrawer } from '@angular/material/sidenav';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'men',
  standalone: true,
  imports: [
    AngularMaterialModule, 
    ProductCardComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule
  ],
  templateUrl: './men.component.html',
  styleUrl: './men.component.css',
  providers: [SnackbarService, MenService , LoaderService]
})
export class MenComponent implements OnInit{
@ViewChild('drawer') drawer : MatDrawer
  searchKey : string =''
  menProducts$ : Observable<productModel[]>;
  menService = inject(MenService)
  categories$: Observable<categoryModel[]>;
  responseMsg: string = ''
  snackbar = inject(SnackbarService)
  productForm : any = FormGroup;
  formBuilder = inject(FormBuilder)

  editorConfig : AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '12rem',
    minHeight: '10rem',
    placeholder: "Enter Product's Complete Description",
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: ''
  }

  selectedFileName: any
  selectedImage: any
  imageSelected: boolean = false;
  loaderService = inject(LoaderService)
  spinnnerSize: number = 30
  menDrawerContentTitle = ''
  menDrawerFormData : any = {}



ngOnInit(): void {
  this.getProducts()
  this.getCategories()
  this.productForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.pattern(globalProperties.nameRegx)]],
    description: ['', [Validators.required]],
    richDescription: [''],
    price: [0, Validators.required],
    category: ['', Validators.required],
    countInStock: [0, Validators.required],
    style: [''],
    size: ['', Validators.required],
    color: ['', Validators.required],
    season: ['', Validators.required],
    brand: ['', Validators.required]
  })
}
  getProducts(searchKey: string = ''){
    const products$ = this.menService.getProducts()
    const loadProducts$ = this.loaderService.showLoader(products$)
    this.menProducts$ = loadProducts$.pipe(
      map((res: any) => {
        const productArray = res.products || []
        return productArray.filter((product: any) => product.category.name == 'Men' && 
      (product.name.trim().toLowerCase().includes(searchKey.trim().toLowerCase()) || 
      product.brand.trim().toLoserCase().includes(searchKey.trim().toLowerCase())))
      })
    )

  }

  getCategories(){
    const category$ = this.menService.getCategories()
    this.categories$= category$.pipe(
      map((res: any) => {
        const categoryArray = res.categories || []
        return categoryArray
      })
    )

  }

  applyFilter(value: any) {
    this.getProducts(value)
  }

  onSearchClear(){
    this.searchKey = ''
    this.applyFilter('')
  }

  @ViewChild('fileInput') fileInput : ElementRef
  @ViewChild ('fileInputField') fileInputField : ElementRef
  image: any;

  openFileInput(){
    this.fileInput.nativeElement.click()
  }
  onFileSelected(e: any){
    const fileInput = e.target
    if(fileInput.files && fileInput.files.length > 0){
      const file: File = fileInput.files[0]
      this.image = file
      this.previewImage(file)
      this.fileInputField.nativeElement.value = file.name
      this.imageSelected = true
    }

  }
  saveProduct(){
    const productDetails = this.productForm.value;
    const imageFile = this.image;
    const formData = new FormData();
    formData.append("name", productDetails.name);
    formData.append("description", productDetails.description);
    formData.append("richDescription", productDetails.richDescription);
    formData.append("price", productDetails.price);
    formData.append("countInStock", productDetails.countInStock);
    formData.append("category", productDetails.category);
    formData.append("style", productDetails.style);
    formData.append("size", productDetails.size);
    formData.append("color", productDetails.color);
    formData.append("season", productDetails.season);
    formData.append("brand", productDetails.brand);
    formData.append("image", imageFile);

    this.menService.addProduct(formData).subscribe({
      next: (res: any) => {
        if(res?.message){
            this.responseMsg = res?.message
            this.getProducts()
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

    this.productForm.reset()
    this.selectedImage = ''
    this.drawer.close()
  }
  closeDrawer(){
    this.menDrawerContentTitle =''
    this.selectedImage=''
    this.productForm.reset()
    this.drawer.close()
  }

  previewImage(file: File){
    const reader =  new FileReader()
    reader.onload = (e) => {
      this.selectedImage = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  toggleDrawer(){
    this.drawer.toggle()
  }

  onMenDrawerContentTitleChange(title: string){
    this.menDrawerContentTitle = title
  }
  onMenDrawerFormDataChange(data: any){
    this.menDrawerFormData = data
    this.productForm.patchValue(this.menDrawerFormData)
    this.productForm.controls['category'].setValue(this.menDrawerFormData.category.id)
    this.selectedImage = this.menDrawerFormData.image
  }

  editProduct(){
    const productDetails = this.productForm.value
    const imageFile = this.image
    const formData = new FormData()
    formData.append('name', productDetails.name)
    formData.append('description', productDetails.description)
    formData.append('richDescription', productDetails.richDescription)
    formData.append('price', productDetails.price)
    formData.append('countInStock', productDetails.countInStock)
    formData.append('category', productDetails.category)
    formData.append('style', productDetails.style)
    formData.append('size', productDetails.size)
    formData.append('color', productDetails.color)
    formData.append('season', productDetails.season)
    formData.append('brand', productDetails.brand)
    formData.append('image', imageFile)
    const productId = this.menDrawerFormData.id
    this.menService.updateProduct(productId, formData).subscribe({
      next: (res: any) => {
        if(res?.message){
          this.responseMsg = res?.message
          this.getProducts()
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
    this.drawer.close()
  }
  
}
