import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, concatMap, finalize, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderSubject = new BehaviorSubject<boolean>(false)
  public loader$ :Observable<boolean> = this.loaderSubject.asObservable()
  constructor() { }

  showLoader<T>(obs$ : Observable<T>): Observable<T>{
    return of(null).pipe(
      tap(() => this.loaderOn()),
      concatMap(()=> obs$),
      finalize(() => this.loaderOff())
    )
  }

  loaderOn(){
    this.loaderSubject.next(true)
  }

  loaderOff(){
    this.loaderSubject.next(false)
  }



}
