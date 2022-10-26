import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { FooterModule } from '@components/Footer/footer.module';

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, LandingRoutingModule, FooterModule],
})
export class LandingModule {}
