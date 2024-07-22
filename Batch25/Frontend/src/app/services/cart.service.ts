import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private isOpenSubject : BehaviorSubject<boolean>  = new BehaviorSubject<boolean>(false)
  constructor() { }

  toggleCart(){
    this.isOpenSubject.next(!this.isOpenSubject.value)
  }

  //method to check if the Cart is Open?
  isCartOpen(): Observable<boolean>{
    return this.isOpenSubject.asObservable()
  }

}
