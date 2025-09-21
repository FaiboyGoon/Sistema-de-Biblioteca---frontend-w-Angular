import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Reserva } from '../../../models/reserva';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';
import { ReservaService } from '../../../services/reserva.service';
import { ApiErrorResponse } from '../../../models/api-error-response';
import Swal from 'sweetalert2';
import { ReservasFormComponent } from '../reservas-form/reservas-form.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservas-list',
  standalone: true,
  imports: [MdbModalModule, ReservasFormComponent, FormsModule],
  templateUrl: './reservas-list.component.html',
  styleUrl: './reservas-list.component.scss',
})
export class ReservasListComponent {
  backendErrors: { [key: string]: string } = {};

  lista: Reserva[] = [];
  reservaEdit!: Reserva;
  pesquisa: string = '';

  //Elementos da Modal
  modalService = inject(MdbModalService);
  @ViewChild('modalReservaForm') modalReservaForm!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  reservaService = inject(ReservaService);

  constructor() {
    this.findAll();
  }

  findAll() {
    this.backendErrors = {};

    this.reservaService.findAll().subscribe({
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

  deleteById(reserva: Reserva) {
    this.backendErrors = {};

    Swal.fire({
      title: 'Deseja mesmo deletar esta reserva?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservaService.deleteById(reserva.id).subscribe({
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

  findByDataReservaAfter() {
    this.backendErrors = {};

    this.reservaService
      .findByDataReservaAfter(new Date(this.pesquisa))
      .subscribe({
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
    //zerando dados do reservaEdit e abrindo a modal
    this.reservaEdit = new Reserva();
    this.modalRef = this.modalService.open(this.modalReservaForm);
  }

  edit(reserva: Reserva) {
    this.reservaEdit = reserva;
    this.modalRef = this.modalService.open(this.modalReservaForm);
  }
  meuEventoTratamento(mensagem: any) {
    //atualizando lista e fechando a modal
    this.findAll();
    this.modalRef.close();
  }
}
