import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private _url = environment.apiUrl
  http = inject(HttpClient)
  constructor() { }

  newOrder(uId: any, order: any): Observable<any>{
    return this.http.post<any>(`${this._url}/order/newOrder/${uId}`, order)
  }

}
