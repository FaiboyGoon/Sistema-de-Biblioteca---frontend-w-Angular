import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Livro } from '../../../models/livro';
import { LivroService } from '../../../services/livro.service';
import Swal from 'sweetalert2';
import { ApiErrorResponse } from '../../../models/api-error-response';
import { ActivatedRoute, Router } from '@angular/router';
import { Autor } from '../../../models/autor';
import { AutorService } from '../../../services/autor.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Genero } from '../../../models/genero';
import { AutoresListComponent } from '../../autores/autores-list/autores-list.component';
import { GenerosListComponent } from '../../generos/generos-list/generos-list.component';

@Component({
  selector: 'app-livros-form',
  standalone: true,
  imports: [
    MdbFormsModule,
    FormsModule,
    AutoresListComponent,
    GenerosListComponent,
  ],
  templateUrl: './livros-form.component.html',
  styleUrl: './livros-form.component.scss',
})
export class LivrosFormComponent {
  @Input('livro') livro!: Livro;
  @Output('meuEvento') meuEvento = new EventEmitter();

  listaAutores!: Autor[];

  backendErrors: { [key: string]: string } = {};

  rotaActivada = inject(ActivatedRoute);
  roteador = inject(Router);

  livroService = inject(LivroService);
  autorService = inject(AutorService);

  @ViewChild('modalAutoresList') modalAutoresList!: TemplateRef<any>;
  @ViewChild('modalGenerosList') modalGenerosList!: TemplateRef<any>;
  modalService = inject(MdbModalService);
  modalRef!: MdbModalRef<any>;

  constructor() {
    let id = this.rotaActivada.snapshot.params['id'];
    if (id) {
      this.findById(id);
    }
    this.findAllAutores();
  }

  findById(id: number) {
    this.livroService.findById(id).subscribe({
      next: (retorno) => {
        this.livro = retorno;
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
    if (this.livro.id > 0) {
      this.livroService.update(this.livro, this.livro.id).subscribe({
        next: (mensagem) => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.roteador.navigate(['dashboard/livros']);
          this.meuEvento.emit('OK');
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
      this.livroService.save(this.livro).subscribe({
        next: (mensagem) => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.roteador.navigate(['dashboard/livros']);
          this.meuEvento.emit('OK');
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

  findAllAutores() {
    this.autorService.findAll().subscribe({
      next: (lista) => {
        this.listaAutores = lista;
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

  meuEventoTratamento(autor: Autor) {
    this.livro.autor = autor;
    this.modalRef.close();
  }

  meuEventoTratamentoGenero(genero: Genero) {
    if (this.livro.generos == null) this.livro.generos = [];

    this.livro.generos.push(genero);
    this.modalRef.close();
  }

  buscarAutor() {
    this.modalRef = this.modalService.open(this.modalAutoresList, {
      modalClass: 'moda1-x1',
    });
  }

  buscarGeneros() {
    this.modalRef = this.modalService.open(this.modalGenerosList, {
      modalClass: 'moda1-x1',
    });
  }

  deletarGenero(genero: Genero) {
    let indice = this.livro.generos.findIndex((x) => {
      return x.id == genero.id;
    });
    this.livro.generos.splice(indice, 1);
  }
}
