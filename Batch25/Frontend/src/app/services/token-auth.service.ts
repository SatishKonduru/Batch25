import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenAuthService {

  constructor() { }
  private tokenSubject = new BehaviorSubject<string>('')
  token$ : Observable<string> = this.tokenSubject.asObservable()

  payload : any

  setToken(token: string){
    sessionStorage.setItem('token', token)
  }

  getToken(): Observable<string>{
    const token = sessionStorage.getItem('token')
    if(token){
      this.payload = jwtDecode(token)
      this.tokenSubject.next(this.payload.name)
    }
    return this.token$
  }

  getUserId(): Observable<any>{
    const token = sessionStorage.getItem('token')
    let user: any
    if(token){
      user = jwtDecode(token)
      return user.id
    }
    else{
      return throwError('No Token Found')
    }
  }

  exit(){
    sessionStorage.removeItem('token')
    this.tokenSubject.next('')
  }



}
