import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'confirmation',
  standalone: true,
  imports: [AngularMaterialModule, CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent implements OnInit{
  afterDelete = new EventEmitter()
  details: any = {}
  
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:  any){}

ngOnInit(): void {
  if(this.dialogData){
    this.details = this.dialogData
  }
}


handleAction(){
  this.afterDelete.emit()
}

}
