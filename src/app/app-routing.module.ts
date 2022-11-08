import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'about',
    loadChildren: () =>
      import('./components/About/about.module').then((m) => m.AboutModule),
  },
  {
    path: 'landing',
    loadChildren: () =>
      import('./components/Landing/landing.module').then(
        (m) => m.LandingModule
      ),
  },
  {
    path: 'menu',
    loadChildren: () =>
      import('./components/Menu/menu.module').then((m) => m.MenuModule),
  },
  {
    path: 'reservas',
    loadChildren: () =>
      import('./components/Reservas/reservas.module').then(
        (m) => m.ReservasModule
      ),
  },
  {
    path: 'tiendas',
    loadChildren: () =>
      import('./components/Tiendas/tiendas.module').then(
        (m) => m.TiendasModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./components/Login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'perfil',
    loadChildren: () =>
      import('./components/Perfil/perfil.module').then((m) => m.PerfilModule),
  },
  {
    path: 'combo/:REF',
    loadChildren: () =>
      import('./components/Combo/combo.module').then((m) => m.ComboModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./components/NotFound/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppRoutingModule {}
