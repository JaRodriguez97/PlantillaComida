import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { SwiperModule } from 'swiper/angular';
import { FooterModule } from '@components/Footer/footer.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    MenuRoutingModule,
    SwiperModule,
    FooterModule,
    ScrollingModule,
  ],
})
export class MenuModule {}
