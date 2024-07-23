import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _url = environment.apiUrl;
  private _http = inject(HttpClient)
  private isOpenSubject : BehaviorSubject<boolean>  = new BehaviorSubject<boolean>(false)

  private productAddedSource = new Subject<void>()
  productAdded$ = this.productAddedSource.asObservable()
  constructor() { }

  toggleCart(){
    this.isOpenSubject.next(!this.isOpenSubject.value)
  }

  //method to check if the Cart is Open?
  isCartOpen(): Observable<boolean>{
    return this.isOpenSubject.asObservable()
  }

  addToCart(uId: any, data: any): Observable<any>{
    return this._http.put<any>(`${this._url}/cart/addToCart/${uId}`, data)
  }

  notifyProductAdded(){
    this.productAddedSource.next()
  }

  getCartItems(userId: any): Observable<any>{
    return this._http.get<any>(`${this._url}/cart/getCart/${userId}`)
  }


}
