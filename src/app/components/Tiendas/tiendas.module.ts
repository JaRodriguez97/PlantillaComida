import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiendasRoutingModule } from './tiendas-routing.module';
import { TiendasComponent } from './tiendas.component';


@NgModule({
  declarations: [
    TiendasComponent
  ],
  imports: [
    CommonModule,
    TiendasRoutingModule
  ]
})
export class TiendasModule { }
