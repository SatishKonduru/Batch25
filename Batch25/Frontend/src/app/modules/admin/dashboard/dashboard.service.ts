import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private _url = environment.apiUrl;
  private _http = inject(HttpClient)
  constructor() { }

  getCount(): Observable<any>{
   return this._http.get<any>(`${this._url}/product/getCount`)
  }

  getProducts(){
    return this._http.get<any>(`${this._url}/product/getAllProducts`)
  }



}
