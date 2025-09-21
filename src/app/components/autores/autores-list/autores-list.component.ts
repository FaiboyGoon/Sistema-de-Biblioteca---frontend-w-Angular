import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Autor } from '../../../models/autor';
import { AutorService } from '../../../services/autor.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiErrorResponse } from '../../../models/api-error-response';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';
import { AutoresFormComponent } from '../autores-form/autores-form.component';

@Component({
  selector: 'app-autores-list',
  standalone: true,
  imports: [FormsModule, AutoresFormComponent, MdbModalModule],
  templateUrl: './autores-list.component.html',
  styleUrl: './autores-list.component.scss',
})
export class AutoresListComponent {
  backendErrors: { [key: string]: string } = {};

  lista: Autor[] = [];
  pesquisa: string = '';

  @Input('modoModal') modoModal: boolean = false;
  @Output('meuEvento') meuEvento = new EventEmitter();

  autorService = inject(AutorService);

  autorEdit!: Autor;

  //Elementos da Modal
  modalService = inject(MdbModalService);
  @ViewChild('modalAutorForm') modalAutorForm!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  constructor() {
    this.findAll();
  }

  findAll() {
    this.autorService.findAll().subscribe({
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

  deleteById(autor: Autor) {
    Swal.fire({
      title: 'Deseja mesmo deletar este autor?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.autorService.deleteById(autor.id).subscribe({
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
    this.autorService.findByNome(this.pesquisa).subscribe({
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

  selecionar(autor: Autor) {
    this.meuEvento.emit(autor);
  }

  new() {
    //zerando dados do generoEdit e abrindo a modal
    this.autorEdit = new Autor();
    this.modalRef = this.modalService.open(this.modalAutorForm);
  }

  edit(autor: Autor) {
    this.autorEdit = autor;
    this.modalRef = this.modalService.open(this.modalAutorForm);
  }
  meuEventoTratamento(mensagem: any) {
    //atualizando lista e fechando a modal
    this.findAll();
    this.modalRef.close();
  }
}
