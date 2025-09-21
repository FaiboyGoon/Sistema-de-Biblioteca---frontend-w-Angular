import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Genero } from '../../../models/genero';
import { FormsModule } from '@angular/forms';
import { Page } from '../../../models/page';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneroService } from '../../../services/genero.service';
import Swal from 'sweetalert2';
import { ApiErrorResponse } from '../../../models/api-error-response';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';
import { GenerosFormComponent } from '../generos-form/generos-form.component';

@Component({
  selector: 'app-generos-list',
  standalone: true,
  imports: [
    FormsModule,
    NgbPaginationModule,
    GenerosFormComponent,
    MdbModalModule,
  ],
  templateUrl: './generos-list.component.html',
  styleUrl: './generos-list.component.scss',
})
export class GenerosListComponent {
  backendErrors: { [key: string]: string } = {};

  lista: Genero[] = [];
  pagina: Page = new Page();
  numPage: number = 1;
  qtidPorPagina: number = 5;

  pesquisa: string = '';
  generoEdit!: Genero;

  //Elementos da Modal
  modalService = inject(MdbModalService);
  @ViewChild('modalGeneroForm') modalGeneroForm!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  @Input('modoModal') modoModal: boolean = false;
  @Output('meuEvento') meuEvento = new EventEmitter();

  generoService = inject(GeneroService);

  constructor() {
    this.findAll();
  }

  findAll() {
    this.backendErrors = {};

    this.generoService.findAll(this.numPage, this.qtidPorPagina).subscribe({
      next: (page) => {
        this.lista = page.content;
        this.pagina = page;
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

  findByNome() {
    this.backendErrors = {};

    this.generoService.findByNome(this.pesquisa).subscribe({
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

  deleteById(genero: Genero) {
    this.backendErrors = {};

    Swal.fire({
      title: 'Deseja mesmo deletar este gênero?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.generoService.deleteById(genero.id).subscribe({
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

  selecionar(genero: Genero) {
    this.meuEvento.emit(genero);
  }

  trocarPagina(pageClicada: any) {
    this.numPage = pageClicada;
    this.findAll();
  }

  new() {
    //zerando dados do generoEdit e abrindo a modal
    this.generoEdit = new Genero();
    this.modalRef = this.modalService.open(this.modalGeneroForm);
  }

  edit(genero: Genero) {
    this.generoEdit = genero;
    this.modalRef = this.modalService.open(this.modalGeneroForm);
  }
  meuEventoTratamento(mensagem: any) {
    //atualizando lista e fechando a modal
    this.findAll();
    this.modalRef.close();
  }
}
