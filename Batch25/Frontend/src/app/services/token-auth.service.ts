import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

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

  exit(){
    sessionStorage.removeItem('token')
    this.tokenSubject.next('')
  }



}
