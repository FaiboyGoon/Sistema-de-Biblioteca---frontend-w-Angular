import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../services/usuario.service';
import { LoginService } from '../../../auth/login.service';
import { Usuario } from '../../../auth/usuario';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { ApiErrorResponse } from '../../../models/api-error-response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule, CommonModule],
  templateUrl: './usuarios-form.component.html',
  styleUrl: './usuarios-form.component.scss',
})
export class UsuariosFormComponent {
  modoEdit: boolean = false;

  get isPagRegisto(): boolean {
    return this.router.url.includes('new');
  }

  usuario: Usuario = new Usuario();
  password: string = '';

  backendErrors: { [key: string]: string } = {};

  rotaAtivida = inject(ActivatedRoute);
  roteador = inject(Router);
  usuarioService = inject(UsuarioService);
  loginService = inject(LoginService);

  constructor(private router: Router) {
    let id = this.rotaAtivida.snapshot.params['id'];
    if (id) {
      this.findById(id);
    }
  }

  findById(id: number) {
    this.usuarioService.findById(id).subscribe({
      next: (usuarioRetornado) => {
        this.usuario = usuarioRetornado;
        this.modoEdit = true;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');
      },
    });
  }

  save() {
    this.backendErrors = {};

    if (this.usuario.id > 0) {
      //Update
      this.usuarioService.update(this.usuario, this.usuario.id).subscribe({
        next: (mensagem: any) => {
          Swal.fire(
            mensagem?.message || 'Usuário atualizado com sucesso!',
            '',
            'success'
          );
          this.roteador.navigate(['dashboard/usuarios']);
        },
        error: (err: ApiErrorResponse) => {
          if (err.errors) {
            this.backendErrors = err.errors;
          } else {
            Swal.fire('Erro', err.message, 'error');
          }
        },
      });
    } else {
      if (this.password.length < 5) {
        Swal.fire('A senha precisa ter no mínimo 5 caracteres!', '', 'error');
        return;
      }

      this.usuario.password = this.password;
      this.usuario.role = 'USER';

      //Save
      this.usuarioService.save(this.usuario).subscribe({
        next: (mensagem: any) => {
          Swal.fire(
            mensagem?.message || 'Usuário criado com sucesso!',
            '',
            'success'
          );
          if (!this.loginService.getToken()) {
            this.roteador.navigate(['login']);
          } else {
            this.roteador.navigate(['dashboard/usuarios']);
          }
        },
        error: (err: ApiErrorResponse) => {
          if (err.errors) {
            this.backendErrors = err.errors;
          } else {
            Swal.fire('Erro', err.message, 'error');
          }
        },
      });
    }
  }
}
