import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import { Observable, map } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { Title } from '@angular/platform-browser';



@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [AngularMaterialModule, RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [DashboardService]
})

export class DashboardComponent implements OnInit{
  @ViewChild('PieContainer', {static: true}) PieContainer : ElementRef;
  @ViewChild('LineContainer', {static: true}) LineContainer : ElementRef;
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
  this.dashboardService.getProducts().subscribe((data: any) => {
    if(data.products){
      this.products = data.products
      this.countCategories()
      this.renderPieChart()
      // this.renderLineChart()

    }
  })
  }    
  countCategories(){
    this.menCount = this.products.filter(p => p.category.name === 'Men')
                    .reduce((total, p) => total+p.countInStock , 0)

   this.womenCount = this.products.filter(p => p.category.name === 'Women')
                    .reduce((total, p) => total+p.countInStock , 0) 

  this.kidsCount = this.products.filter(p => p.category.name === 'Kids')
                    .reduce((total, p) => total+p.countInStock , 0)
  }

  renderPieChart(){
    const echartsElement : HTMLElement = this.PieContainer.nativeElement
    if(!echartsElement){
      console.log("Pie chart containter is not Available")
      return
    }
    const myChart = echarts.init(echartsElement)
    const option = {
      title: {
        text: 'Categories',
        left: 'center',
      },
      tooltip: {
        trigger: 'item'
      },
      series:{
        name: 'Category of..',
        type: 'pie',
        roseType: 'radius',
        radius: '85%',
        data: [
          {value: this.menCount, name: 'Men'},
          {value: this.womenCount, name: 'Women'},
          {value: this.kidsCount, name: 'Kids'}
        ],
        emphasis: {
          itemStyle : {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: '#000'
          },
          color: ['#ff6666', '#009933', '#890b3ff']
        }
      }
    }

    myChart.setOption(option)
    myChart.on('error', function(error){console.error('ECharts error: ', error)})
  }

  renderLineChart(){}
}
