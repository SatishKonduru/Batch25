import { NgModule } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';



const materialCompnents = [
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatBadgeModule
]
@NgModule({
  imports: [materialCompnents],
  exports: [materialCompnents]
})
export class AngularMaterialModule { }
