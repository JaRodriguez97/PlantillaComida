import { AgmCoreModule } from '@agm/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FooterModule } from '@components/Footer/footer.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxLocalstorageDirectiveModule } from 'ngx-localstorage';
import { SwiperModule } from 'swiper/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    SwiperModule,
    HttpClientModule,
    FooterModule,
    ScrollingModule,
    FontAwesomeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyANPMMk_LmctJkbG61fjRkLJ5HQHLqYEwc',
    }),
    NgxLocalstorageDirectiveModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
