import { Component, inject } from '@angular/core';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WomenService } from './women.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { productModel } from '../../../../shared/models/model';
import { Observable } from 'rxjs';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'women',
  standalone: true,
  imports: [AngularMaterialModule, CommonModule, FormsModule],
  templateUrl: './women.component.html',
  styleUrl: './women.component.css',
  providers: [WomenService, SnackbarService, LoaderService]
})
export class WomenComponent {
selectedItem : any
showDetails:boolean = false
searchKey : any
displayedColumns: string[] = ['name', 'price', 'color','countInStock']
womenProducts$ : Observable<productModel[]>
responseMsg: string = ''
womenService = inject(WomenService)
snackbar = inject(SnackbarService)
loaderService = inject (LoaderService)


applyFilter(filterValue: any){

}
onSearchClear(){}


}
