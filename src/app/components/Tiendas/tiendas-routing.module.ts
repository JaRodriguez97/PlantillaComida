import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiendasComponent } from './tiendas.component';

const routes: Routes = [{ path: '', component: TiendasComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiendasRoutingModule { }
