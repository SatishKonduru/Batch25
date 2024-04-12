import { Component } from '@angular/core';
import { BannerComponent } from '../banner/banner.component';

@Component({
  selector: 'home',
  standalone: true,
  imports: [BannerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
