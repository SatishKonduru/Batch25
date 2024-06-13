import { Component } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenAuthService } from '../../services/token-auth.service';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
interface IMenu {
  route: string,
  name: string,
  icon: string,
  children ? : []
}
@Component({
  selector: 'admin',
  standalone: true,
  imports: [AngularMaterialModule, RouterModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  userToken$ !: Observable<string>
  menuList$ !: Observable<IMenu>;

  constructor(private _http: HttpClient, private _tokenAuth: TokenAuthService){}
  ngOnInit(): void {
    // const token = sessionStorage.getItem('token')
    // if(token){ 
    //   this.payload = jwtDecode(token)
    //   this.user = this.payload.name
    // }
    this.userToken$ = this._tokenAuth.getToken()
    this.menuList$ = this._http.get<IMenu>('../../../../assets/menuItems.json')
 
  }
}
