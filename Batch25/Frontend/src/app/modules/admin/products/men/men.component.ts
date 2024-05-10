import { Component } from '@angular/core';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SnackbarService } from '../../../../services/snackbar.service';
import { MenService } from '../../men/men.service';

@Component({
  selector: 'men',
  standalone: true,
  imports: [
    AngularMaterialModule, 
    ProductCardComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule
  ],
  templateUrl: './men.component.html',
  styleUrl: './men.component.css',
  providers: [SnackbarService, MenService ]
})
export class MenComponent {

}
