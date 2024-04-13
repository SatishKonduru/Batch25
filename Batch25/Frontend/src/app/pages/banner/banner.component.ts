import { Component } from '@angular/core';

@Component({
  selector: 'banner',
  standalone: true,
  imports: [],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
  timestamp = Date.now();

images: string[] = [
  '../../../assets/banner/b1.png',
  "../../../assets/banner/b2.png",
  "../../../assets/banner/b3.png"
] 
}
