import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  inject,
} from "@angular/core";
import { AngularMaterialModule } from "../../../angular-material/angular-material.module";
import { ProductCardComponent } from "../../shared/product-card/product-card.component";
import { BehaviorSubject, Observable, combineLatest, map, of, tap } from "rxjs";
import { categoryModel, productModel } from "../../../../shared/models/model";

import { CommonModule, IMAGE_CONFIG } from "@angular/common";
import { MatDrawer } from "@angular/material/sidenav";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { globalProperties } from "../../../../shared/globalProperties";
import {
  AngularEditorConfig,
  AngularEditorModule,
} from "@kolkov/angular-editor";
import { ActivatedRoute, Router } from "@angular/router";
import { SnackbarService } from "../../../../services/snackbar.service";
import { LoaderService } from "../../../../services/loader.service";
import { WomenService } from "../women/womenService";
import { MenService } from "./men.service";
import { KidsService } from "../kids/kids.service";


@Component({
  selector: "app-men",
  standalone: true,
  imports: [
    AngularMaterialModule,
    ProductCardComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
  ],
  templateUrl: "./men.component.html",
  styleUrl: "./men.component.css",
  providers: [ SnackbarService, LoaderService, MenService],
})
export class MenComponent implements OnInit {
  @ViewChild("drawer") drawer!: MatDrawer;

  searchKey: string = "";
  menProducts$!: Observable<productModel[]>;
  menService = inject(MenService);
  snackbar = inject(SnackbarService);
  categories$!: Observable<categoryModel[]>;
  formBuilder = inject(FormBuilder);
  productForm: any = FormGroup;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "12rem",
    minHeight: "10rem",
    placeholder: "Enter Product Complete Description here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Poppins",
  };
  imageSelected: boolean = false;
  responseMsg: string = "";
  loaderService = inject(LoaderService);
  spinnerSize: number = 30;

  menDrawerContentTitle: any = "";
  menDrawerFormData: any = {};
  kidaProductsData: any

  isDrawerOpen: boolean = false;
  activatedRoute = inject(ActivatedRoute)
  // womenService = inject(WomenService)
  womenProductData: any

  router = inject(Router)
  constructor(private _womenService: WomenService, private _kidsService: KidsService ) {
    this._womenService.isOpen$.subscribe(isOpen => {
      this.isDrawerOpen = isOpen;
    });

    this._kidsService.isOpen$.subscribe(isOpen => {
      this.isDrawerOpen = isOpen
    })
   
  }
  ngOnInit(): void {
      this.getProducts();
    this.getCategories();
    this.productForm = this.formBuilder.group({
      name: [
        "",
        [Validators.required, Validators.pattern(globalProperties.nameRegx)],
      ],
      description: ["", Validators.required],
      richDescription: [""],
      // image: ['', Validators.required],
      price: [0, Validators.required],
      category: ["", Validators.required],
      countInStock: [0, Validators.required],
      style: [""],
      size: ["", Validators.required],
      color: ["", Validators.required],
      season: ["", Validators.required],
      brand: ["", Validators.required],
    });


    this.activatedRoute.queryParams.subscribe(params => {
      if (params['openDrawer']) {
        this._womenService.openDrawer();
       this._womenService.formData$.subscribe(res => {
       this.menDrawerContentTitle = "Update Product"
        this.womenProductData = res;
      console.log("this.womenProductData................", this.womenProductData)
      })
      this.onMenDrawerFormDataChange(this.womenProductData)
     }

     if(params['openDrawerForKids']){
      this._kidsService.openDrawer()
      this._kidsService.formData$.subscribe(res => {
        this.menDrawerContentTitle = 'Update Product'
        this.kidaProductsData = res
      })
      this.onMenDrawerFormDataChange(this.kidaProductsData)
     }
    })

   





  }
  saveProduct() {
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

    this.menService.addProduct(formData).subscribe(
      (res: any) => {
        if (res?.message) {
          this.responseMsg = res?.message;
          this.getProducts();
          this.snackbar.openSnackbar(this.responseMsg, "success");
        }
      },
      (err: any) => {
        if (err.error?.message) {
          this.responseMsg = err.error?.message;
        } else {
          this.responseMsg = globalProperties.genericError;
        }
        this.snackbar.openSnackbar(this.responseMsg, globalProperties.error);
      }
    );
    this.productForm.reset()
    this.selectedImage = "";
    this.drawer.close();
  }

  closeDrawer() {
    this.menDrawerContentTitle = "";
    this.selectedImage = "";
    this.productForm.reset();
   this.activatedRoute.queryParams.subscribe(params => {
    if(params['openDrawer']){
      this._womenService.closeDrawer()
      this.router.navigate(['admin/dashboard/products/women'])
    }

    if(params['openDrawerForKids']){
      this._kidsService.closeDrawer()
      this.router.navigate(['admin//dashboard/products/kids'])
    }
   })
    
    this.drawer.close();
  }
  getProducts(searchKey: string = "") {
    const products$ = this.menService.getProducts();
    const loadProducts$ = this.loaderService.showLoader(products$);
    this.menProducts$ = loadProducts$.pipe(
      map((res: any) => {
        const productArray = res.products || [];
        return productArray.filter(
          (product: any) =>
            product.category.name == "Men" &&
            (product.name
              .trim()
              .toLowerCase()
              .includes(searchKey.trim().toLowerCase()) ||
              product.brand
                .trim()
                .toLowerCase()
                .includes(searchKey.trim().toLowerCase()))
        );
      })
    );
  }

  getCategories() {
    const category$ = this.menService.getCategories();
    this.categories$ = category$.pipe(
      map((res: any) => {
        const categoryArray = res.categories || [];
        return categoryArray;
      })
    );
  }

  @ViewChild("fileInput") fileInput!: ElementRef;
  @ViewChild("fileInputField") fileInputField!: ElementRef;
  image: any;
  onFileSelected(event: any): void {
    const fileInput = event.target;

    if (fileInput.files && fileInput.files.length > 0) {
      const file: File = fileInput.files[0];
      this.image = file;
      // Set the selected image preview
      this.previewImage(file);

      // Update the input field value
      this.fileInputField.nativeElement.value = file.name;
      this.imageSelected = true;
    }
  }

  openFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  selectedFileName: string | undefined;
  selectedImage: string | undefined;
  previewImage(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      this.selectedImage = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  }

  applyFilter(value: any) {
    this.getProducts(value);
  }
  onSearchClear() {
    this.searchKey = "";
    this.applyFilter("");
  }

  toggleDrawer() {
    this.drawer.toggle();
  }
  onMenDrawerContentTitleChange(title: string) {
    this.menDrawerContentTitle = title;
  }

  onMenDrawerFormDataChange(data: any) {
    this.menDrawerFormData = data;
    this.productForm.patchValue(this.menDrawerFormData);
    this.productForm.controls["category"].setValue(
      this.menDrawerFormData.category.id
    );
    this.selectedImage = this.menDrawerFormData.image;
  }

  editProduct() {
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

    const productId = this.menDrawerFormData.id;
    this.menService.updateProduct(productId, formData).subscribe({
      next: (res: any) => {
        if (res?.message) {
          this.responseMsg = res?.message;
          this.getProducts();
          this.snackbar.openSnackbar(this.responseMsg, "success");
        }
      },

      error: (err: any) => {
         if (err.error?.message) {
            this.responseMsg = err.error?.message;
          } else {
            this.responseMsg = globalProperties.genericError;
          }
          this.snackbar.openSnackbar(this.responseMsg, globalProperties.error);
        }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['openDrawer']){
        this,this._womenService.closeDrawer()
        this.router.navigate(['admin/dashboard/products/women'])
      }
    })
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['openDrawerForKids']){
        this,this._womenService.closeDrawer()
        this.router.navigate(['admin/dashboard/products/kids'])
      }
    })

    this.drawer.close();
  }

  onDeleteProductFromProductCard(){
    this.getProducts()
  }
}
