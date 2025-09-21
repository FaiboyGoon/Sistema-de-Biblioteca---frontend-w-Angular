import { Routes } from '@angular/router';
import { LoginComponent } from './components/layout/login/login.component';
import { UsuariosFormComponent } from './components/usuarios/usuarios-form/usuarios-form.component';
import { DashboardComponent } from './components/layout/dashboard/dashboard.component';
import { PrincipalComponent } from './components/layout/principal/principal.component';
import { LivrosListComponent } from './components/livros/livros-list/livros-list.component';
import { LivrosFormComponent } from './components/livros/livros-form/livros-form.component';
import { AutoresListComponent } from './components/autores/autores-list/autores-list.component';
import { AutoresFormComponent } from './components/autores/autores-form/autores-form.component';
import { GenerosListComponent } from './components/generos/generos-list/generos-list.component';
import { GenerosFormComponent } from './components/generos/generos-form/generos-form.component';
import { ReservasListComponent } from './components/reservas/reservas-list/reservas-list.component';
import { ReservasFormComponent } from './components/reservas/reservas-form/reservas-form.component';
import { UsuariosListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';

export const routes: Routes = [
    {path: "", redirectTo: "login", pathMatch: 'full'},
    {path: "login", component: LoginComponent},
    {path: "registar", component: UsuariosFormComponent},
    {path: "dashboard", component: DashboardComponent, children:[
        {path: "principal", component: PrincipalComponent},
        {path: "livros", component: LivrosListComponent},
        {path: "livros/new", component: LivrosFormComponent},
        {path: "livros/edit/:id", component: LivrosFormComponent},
        {path: "autores", component: AutoresListComponent},
        {path: "autores/new", component: AutoresFormComponent},
        {path: "autores/edit/:id", component: AutoresFormComponent},
        {path: "generos", component: GenerosListComponent},
        {path: "generos/new", component: GenerosFormComponent},
        {path: "generos/edit/:id", component: GenerosFormComponent},
        {path: "reservas", component: ReservasListComponent},
        {path: "reservas/new", component: ReservasFormComponent},
        {path: "reservas/edit/:id", component: ReservasFormComponent},
        {path: "usuarios", component: UsuariosListComponent},
        {path: "usuarios/new", component: UsuariosFormComponent},
        {path: "usuarios/edit/:id", component: UsuariosFormComponent}
    ]}
];
