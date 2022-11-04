import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { UsersService } from '@service/Users/users.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, LoginRoutingModule],
  providers: [UsersService],
})
export class LoginModule {}
