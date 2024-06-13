import { Component, OnInit, inject } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import { Observable, map } from 'rxjs';
import { DashboardService } from './dashboard.service';



@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [AngularMaterialModule, RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [DashboardService]
})

export class DashboardComponent implements OnInit{
  count$ : Observable<any>
  dashboardService = inject(DashboardService)
  products: any[] = []
  menCount:  number = 0
  womenCount: number = 0
  kidsCount : number = 0
  
  

  constructor(){}
  ngOnInit(): void {
  this.count$ =  this.dashboardService.getCount()
                                      .pipe(
                                            map((res) => res.count)
                                          )
  }


}
