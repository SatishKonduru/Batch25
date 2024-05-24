import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { productModel } from '../../../../shared/models/model';

@Injectable({
  providedIn: 'root'
})
export class WomenService {

  private _url = environment.apiUrl;
  private _http = inject(HttpClient)
  constructor() { }

  getProducts(): Observable<productModel[]>{
    return this._http.get<productModel[]>(`${this._url}/product/getAllProducts`).pipe(shareReplay())
  }

}
