import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private _url = environment.apiUrl
  private _http = inject(HttpClient)

  constructor() { }

  getAllOrders(): Observable<any>{
    return this._http.get<any>(`${this._url}/order/getAllOrders`).pipe(shareReplay())
  }

  updateOrderStatus(orderId: any, newStatus: any): Observable<any>{
    return this._http.patch(`${this._url}/order/updateOrderStatus/${orderId}`, {status: newStatus})
  }

}
