import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Usuario } from '../../../auth/usuario';
import Swal from 'sweetalert2';
import { ApiErrorResponse } from '../../../models/api-error-response';
import { UsuarioService } from '../../../services/usuario.service';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';
import { FormsModule } from '@angular/forms';
import { UsuariosFormComponent } from '../usuarios-form/usuarios-form.component';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [FormsModule, MdbModalModule],
  templateUrl: './usuarios-list.component.html',
  styleUrl: './usuarios-list.component.scss',
})
export class UsuariosListComponent {
  backendErrors: { [key: string]: string } = {};

  @Input('modoModal') modoModal: boolean = false;
  @Output('meuEvento') meuEvento = new EventEmitter();

  lista: Usuario[] = [];
  pesquisa: string = '';

  usuarioService = inject(UsuarioService);

  usuarioEdit!: Usuario;

  constructor() {
    this.findAll();
  }

  findAll() {
    this.usuarioService.findAll().subscribe({
      next: (listaRetornada) => {
        this.lista = listaRetornada;
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

  deleteById(usuario: Usuario) {
    Swal.fire({
      title: 'Deseja mesmo deletar este usuário?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteById(usuario.id).subscribe({
          next: (mensagem) => {
            Swal.fire({
              title: mensagem,
              icon: 'success',
              confirmButtonText: 'OK',
            });
            this.findAll();
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
    });
  }

  findByNome() {
    this.usuarioService.findByNome(this.pesquisa).subscribe({
      next: (lista) => {
        this.lista = lista;
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

  selecionar(usuario: Usuario) {
    this.meuEvento.emit(usuario);
  }
}
