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
      console.log("PPPPPPPPPPPPPPP", this.products)
      this.countCategories()
      this.renderPieChart()
      this.renderLineChart()

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
          {value: 5, name:'', lable: {show: false}},
          {value: this.womenCount, name: 'Women'},
          {value: 5, name:'', lable: {show: false}},
          {value: this.kidsCount, name: 'Kids'},
          {value: 5, name:'', lable: {show: false}},
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

  renderLineChart(){
    const echartsElement: HTMLElement = this.LineContainer.nativeElement

    if(!echartsElement){
      console.error('Echart container is not available')
      return
    }

    const myChart = echarts.init(echartsElement)
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis : {
        type: 'category',
        data: ['Men','Women','Kids']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [
            {
              value: this.menCount,
              itemStyle: {
                color: '#ff6666'
              }
            },
            {
              value: this.womenCount,
              itemStyle: {
                color: '#009933'
              }
            },
            {
              value: this.kidsCount,
              itemStyle: {
                color: '#80b3ff'
              }
            }
          ],
          type: 'line',
          smooth: true
        }
      ]
    }
myChart.setOption(option)
myChart.on('error', function(error) {
  console.error('Echarts error: ', error)
})

  }
}
