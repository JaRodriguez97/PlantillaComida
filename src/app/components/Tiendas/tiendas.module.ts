import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiendasRoutingModule } from './tiendas-routing.module';
import { TiendasComponent } from './tiendas.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [TiendasComponent],
  imports: [
    CommonModule,
    TiendasRoutingModule,
    FontAwesomeModule,
    AgmCoreModule,
  ],
})
export class TiendasModule {}
