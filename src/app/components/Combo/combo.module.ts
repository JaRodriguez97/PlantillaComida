import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComboRoutingModule } from './combo-routing.module';
import { ComboComponent } from './combo.component';


@NgModule({
  declarations: [
    ComboComponent
  ],
  imports: [
    CommonModule,
    ComboRoutingModule
  ]
})
export class ComboModule { }
