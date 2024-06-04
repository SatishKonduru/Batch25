import { Injectable, inject } from "@angular/core";
import { environment } from "../../../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject, shareReplay } from "rxjs";
import { productModel } from "../../../../shared/models/model";

 @Injectable({
    providedIn: 'root'
 })

 export class WomenService{
    private _url = environment.apiUrl;
    private _http = inject(HttpClient)
    private formDataSubject = new BehaviorSubject<any>('')
    formData$ = this.formDataSubject.asObservable()
    private isOpenSubject = new BehaviorSubject<boolean>(false);
    isOpen$ = this.isOpenSubject.asObservable();

   
    openDrawer() {
      this.isOpenSubject.next(true);
    }
  
    closeDrawer() {
      this.isOpenSubject.next(false);
    }
  
   setFormData(data: any){
      this.formDataSubject.next(data)
      this.formData$.subscribe(res => {
        console.log("NEW formData$ : ", res)
      })
   }

    getProducts(): Observable<productModel[]>{
        return this._http.get<productModel[]>(`${this._url}/product/getAllProducts`).pipe(
              shareReplay()
        )
    }

   
 }