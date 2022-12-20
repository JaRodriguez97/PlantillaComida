import { MenuComponent } from './components/Menu/menu.component';
import { AgmCoreModule } from '@agm/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@env/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxLocalstorageDirectiveModule } from 'ngx-localstorage';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SwiperModule } from 'swiper/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AgmCoreModule.forRoot({ apiKey: environment.apiKey }),
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    AppRoutingModule,
    SwiperModule,
    HttpClientModule,
    ScrollingModule,
    FontAwesomeModule,
    NgxLocalstorageDirectiveModule,
    BrowserAnimationsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
