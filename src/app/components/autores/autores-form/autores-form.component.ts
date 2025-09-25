import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Autor } from '../../../models/autor';
import { ActivatedRoute, Router } from '@angular/router';
import { AutorService } from '../../../services/autor.service';
import { ApiErrorResponse } from '../../../models/api-error-response';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

@Component({
  selector: 'app-autores-form',
  standalone: true,
  imports: [FormsModule, MdbFormsModule],
  templateUrl: './autores-form.component.html',
  styleUrl: './autores-form.component.scss',
})
export class AutoresFormComponent {
  backendErrors: { [key: string]: string } = {};

  //autor: Autor = new Autor();

  @Input('autor') autor!: Autor;
  @Output('meuEvento') meuEvento = new EventEmitter();

  rotaAtivada = inject(ActivatedRoute);
  roteador = inject(Router);
  autorService = inject(AutorService);

  constructor() {
    let id = this.rotaAtivada.snapshot.params['id'];
    if (id) {
      this.findById(id);
    }
  }

  findById(id: number) {
    this.backendErrors = {};

    this.autorService.findById(id).subscribe({
      next: (autorRetornado) => {
        this.autor = autorRetornado;
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
    if (this.autor.id > 0) {
      this.autorService.update(this.autor, this.autor.id).subscribe({
        next: (mensagem) => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.roteador.navigate(['dashboard/autores']);
          this.meuEvento.emit('OK');
        },
        error: (err: ApiErrorResponse) => {
          if (err.errors) {
            this.backendErrors = err.errors;
            this.roteador.navigate(['dashboard/autores']);
            this.meuEvento.emit('OK');
          } else {
            Swal.fire('Erro', err.message, 'error');
            this.roteador.navigate(['dashboard/autores']);
            this.meuEvento.emit('OK');
          }
        },
      });
    } else {
      this.autorService.save(this.autor).subscribe({
        next: (mensagem) => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.roteador.navigate(['dashboard/autores']);
          this.meuEvento.emit('OK');
        },
        error: (err: ApiErrorResponse) => {
          if (err.errors) {
            this.backendErrors = err.errors;
            this.roteador.navigate(['dashboard/autores']);
            this.meuEvento.emit('OK');
          } else {
            Swal.fire('Erro', err.message, 'error');
            this.roteador.navigate(['dashboard/autores']);
            this.meuEvento.emit('OK');
          }
        },
      });
    }
  }
}
