import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Reserva } from '../../../models/reserva';
import { Usuario } from '../../../auth/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { LivroService } from '../../../services/livro.service';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';
import { ApiErrorResponse } from '../../../models/api-error-response';
import { ReservaService } from '../../../services/reserva.service';
import Swal from 'sweetalert2';
import { Livro } from '../../../models/livro';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { UsuariosListComponent } from '../../usuarios/usuarios-list/usuarios-list.component';
import { LivrosListComponent } from '../../livros/livros-list/livros-list.component';

@Component({
  selector: 'app-reservas-form',
  standalone: true,
  imports: [
    MdbModalModule,
    FormsModule,
    MdbFormsModule,
    UsuariosListComponent,
    LivrosListComponent,
  ],
  templateUrl: './reservas-form.component.html',
  styleUrl: './reservas-form.component.scss',
})
export class ReservasFormComponent {
  @Input('reserva') reserva!: Reserva;
  @Output('meuEvento') meuEvento = new EventEmitter();

  listaUsuarios!: Usuario[];
  listaLivros!: Livro[];

  backendErrors: { [key: string]: string } = {};

  rotaActivada = inject(ActivatedRoute);
  roteador = inject(Router);

  reservaService = inject(ReservaService);
  livroService = inject(LivroService);
  usuarioService = inject(UsuarioService);

  @ViewChild('modalUsuariosList') modalUsuariosList!: TemplateRef<any>;
  @ViewChild('modalLivrosList') modalLivrosList!: TemplateRef<any>;
  modalService = inject(MdbModalService);
  modalRef!: MdbModalRef<any>;

  constructor() {
    let id = this.rotaActivada.snapshot.params['id'];
    if (id) {
      this.findById(id);
    }
    this.findAllUsuarios();
    this.findAllLivros();
  }

  findById(id: number) {
    this.reservaService.findById(id).subscribe({
      next: (retorno) => {
        this.reserva = retorno;
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

  save() {
    this.backendErrors = {};

    //Update
    if (this.reserva.id > 0) {
      this.reservaService.update(this.reserva, this.reserva.id).subscribe({
        next: (mensagem) => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.roteador.navigate(['dashboard/reservas']);
          this.meuEvento.emit('OK');
        },
        error: (err: ApiErrorResponse) => {
          if (err.errors) {
            this.backendErrors = err.errors;
            this.roteador.navigate(['dashboard/reservas']);
            this.meuEvento.emit('OK');
          } else {
            Swal.fire('Erro', err.message, 'error');
            this.roteador.navigate(['dashboard/reservas']);
            this.meuEvento.emit('OK');
          }
        },
      });
    } else {
      this.reservaService.save(this.reserva).subscribe({
        next: (mensagem) => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.roteador.navigate(['dashboard/reservas']);
          this.meuEvento.emit('OK');
        },
        error: (err: ApiErrorResponse) => {
          if (err.errors) {
            this.backendErrors = err.errors;
            this.roteador.navigate(['dashboard/reservas']);
            this.meuEvento.emit('OK');
          } else {
            Swal.fire('Erro', err.message, 'error');
            this.roteador.navigate(['dashboard/reservas']);
            this.meuEvento.emit('OK');
          }
        },
      });
    }
  }

  findAllUsuarios() {
    this.usuarioService.findAll().subscribe({
      next: (lista) => {
        this.listaUsuarios = lista;
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

  findAllLivros() {
    this.livroService.findAll().subscribe({
      next: (lista) => {
        this.listaLivros = lista;
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

  meuEventoTratamento(usuario: Usuario) {
    this.reserva.usuario = usuario;
    this.modalRef.close();
  }

  meuEventoTratamentoLivro(livro: Livro) {
    this.reserva.livro = livro;
    this.modalRef.close();
  }

  buscarUsuario() {
    this.modalRef = this.modalService.open(this.modalUsuariosList, {
      modalClass: 'moda1-x1',
    });
  }

  buscarLivro() {
    this.modalRef = this.modalService.open(this.modalLivrosList, {
      modalClass: 'moda1-x1',
    });
  }
}
