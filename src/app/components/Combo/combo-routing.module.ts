import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComboComponent } from './combo.component';

const routes: Routes = [{ path: '', component: ComboComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComboRoutingModule { }
