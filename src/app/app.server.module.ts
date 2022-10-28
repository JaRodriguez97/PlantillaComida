import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [AppModule, ServerModule, ScrollingModule],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
