import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';


// Matenimientos
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../guards/admin.guard';


const childrenRoutes: Routes = [
  {path: '', component: DashboardComponent, data: {titulo: 'Dashboard'}},
  {path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Ajustes de Tema'}},
  {path: 'buscar/:termino', component: BusquedaComponent, data: {titulo: 'Busqueda General'}},
  {path: 'grafica1', component: Grafica1Component, data: {titulo: 'Gráfica #1'}},
  {path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil de usuario'}},
  {path: 'progress', component: ProgressComponent, data: {titulo: 'ProgressBar'}},
  {path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas'}},
  {path: 'rxjs', component: RxjsComponent, data: {titulo: 'RxJs'}},

  // Matenimientos
  {path: 'medicos', component: MedicosComponent, data: {titulo: 'Gestión de Médicos'}},
  {path: 'medico/:id', component: MedicoComponent, data: {titulo: 'Gestión de Médico'}},
  {path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Gestión de Hospitales'}},

  // Rutas de Admin
  {path: 'usuarios', canActivate: [AdminGuard] ,component: UsuariosComponent, data: {titulo: 'Gestión de usuarios'}},

];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(childrenRoutes)],
  exports: [RouterModule]
})
export class ChildRoutesModule { }
