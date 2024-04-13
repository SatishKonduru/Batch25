import { Component } from '@angular/core';
import { BannerComponent } from '../banner/banner.component';
import { BrandsComponent } from '../brands/brands.component';
import { TrendsComponent } from '../trends/trends.component';

@Component({
  selector: 'home',
  standalone: true,
  imports: [BannerComponent, BrandsComponent, TrendsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
