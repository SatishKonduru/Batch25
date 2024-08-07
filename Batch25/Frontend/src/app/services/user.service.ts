import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userModel } from '../shared/models/model';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _url = environment.apiUrl;
  constructor(private _http: HttpClient) { }

  userRegister(data: any){
  return   this._http.post<userModel>(`${this._url}/user/register`, data, {
      headers: new HttpHeaders().set('Content-Type','application/json')
    })
  }   

  userLogin(data: any){
  return   this._http.post<userModel>(`${this._url}/user/login`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getUserById(uId: any): Observable<userModel>{
    return this._http.get<userModel>(`${this._url}/user/getById/${uId}`)
  }

  updateUser(uId: any, data: any){
    return this._http.patch(`${this._url}/user/update/${uId}`, data)
  }

  getPasswordResetLink(data: any): Observable<any>{
    return this._http.post<any>(`${this._url}/user/reset-password`, data)
  }
  
  updatePassword(data:any): Observable<any>{
    return this._http.post<any>(`${this._url}/user/update-password`, data)
  }

  addToWishList(userId: any, data: any): Observable<userModel>{
    return this._http.patch<userModel>(`${this._url}/user/addToWishList/${userId}`, {product:data})
  }

  wishListCount(uId: any){
    return this._http.get<any>(`${this._url}/user/wishlist/count/${uId}`)
  }

  getOrders(uId: any) {
    return this._http.get<any>(`${this._url}/order/orderDetails/${uId}`)
  }

}
