import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'product-details',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
htmlContent : any
sanitizer = inject(DomSanitizer)
constructor(@Inject(MAT_DIALOG_DATA) public dialogData : any){
  console.log("dialogData: ", dialogData)
  const htmlString = dialogData.richDescription
  this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(htmlString)

}

}
