import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Livro } from '../../../models/livro';
import { LivroService } from '../../../services/livro.service';
import Swal from 'sweetalert2';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';
import { LivrosFormComponent } from '../livros-form/livros-form.component';
import { ApiErrorResponse } from '../../../models/api-error-response';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-livros-list',
  standalone: true,
  imports: [MdbModalModule, LivrosFormComponent, FormsModule],
  templateUrl: './livros-list.component.html',
  styleUrl: './livros-list.component.scss',
})
export class LivrosListComponent {
  backendErrors: { [key: string]: string } = {};

  @Input('modoModal') modoModal: boolean = false;
  @Output('meuEvento') meuEvento = new EventEmitter();

  lista: Livro[] = [];
  livroEdit!: Livro;
  pesquisa: string = '';

  //Elementos da Modal
  modalService = inject(MdbModalService);
  @ViewChild('modalLivroForm') modalLivroForm!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  livroService = inject(LivroService);

  constructor() {
    this.findAll();
  }

  findAll() {
    this.backendErrors = {};

    this.livroService.findAll().subscribe({
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

  deleteById(livro: Livro) {
    this.backendErrors = {};

    Swal.fire({
      title: 'Deseja mesmo deletar este livro?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.livroService.deleteById(livro.id).subscribe({
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

  findByTitulo() {
    this.backendErrors = {};

    this.livroService.findByTitulo(this.pesquisa).subscribe({
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

  new() {
    //zerando dados do livroEdit e abrindo a modal
    this.livroEdit = new Livro();
    this.modalRef = this.modalService.open(this.modalLivroForm);
  }

  edit(livro: Livro) {
    this.livroEdit = livro;
    this.modalRef = this.modalService.open(this.modalLivroForm);
  }
  meuEventoTratamento(mensagem: any) {
    //atualizando lista e fechando a modal
    this.findAll();
    this.modalRef.close();
  }

  selecionar(livro: Livro) {
    this.meuEvento.emit(livro);
  }
}
