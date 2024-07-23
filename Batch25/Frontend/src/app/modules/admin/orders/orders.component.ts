import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { Observable } from 'rxjs';
import { OrdersService } from './orders.service';
import { FormsModule } from '@angular/forms';






@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit{
  orders : any = []
  ordersService = inject(OrdersService)
  searchKey: any = ''
  filterData : any = []
  
  ngOnInit(): void {
      this.getAllOrders()
  }

  getAllOrders(){
    this.ordersService.getAllOrders().subscribe({
        next: (res: any) => {
          const orderStatus: any = { Pending: 0, Shipped: 1, Delivered: 2 };
         this.orders = res.orders.sort((a: any, b: any) => {
             return orderStatus[a.status] - orderStatus[b.status];
          });
          this.filterData = this.orders
         
        }
    })
  }
  getStatusColor(status: string): string {
    switch (status) {
      case 'Pending':
        return 'red';
      case 'Shipped':
        return 'blue';
      case 'Delivered':
        return 'green';
      default:
        return 'black'; // Default color
    }
  }


  applyFilter(){
    this.filterData = this.orders.filter((item: any) => item.status.toLowerCase().includes(this.searchKey.toLowerCase())  || 
    item.id.toLowerCase().includes(this.searchKey.toLowerCase())
    )
  }

  

}