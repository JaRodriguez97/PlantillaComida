import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservasRoutingModule } from './reservas-routing.module';
import { ReservasComponent } from './reservas.component';


@NgModule({
  declarations: [
    ReservasComponent
  ],
  imports: [
    CommonModule,
    ReservasRoutingModule
  ]
})
export class ReservasModule { }
