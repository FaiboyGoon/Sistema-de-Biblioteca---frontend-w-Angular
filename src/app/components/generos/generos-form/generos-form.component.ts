import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Genero } from '../../../models/genero';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneroService } from '../../../services/genero.service';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { ApiErrorResponse } from '../../../models/api-error-response';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generos-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './generos-form.component.html',
  styleUrl: './generos-form.component.scss',
})
export class GenerosFormComponent {
  backendErrors: { [key: string]: string } = {};

  @Input('genero') genero!: Genero;
  @Output('meuEvento') meuEvento = new EventEmitter();

  rotaAtivada = inject(ActivatedRoute);
  roteador = inject(Router);
  generoService = inject(GeneroService);

  constructor() {
    let id = this.rotaAtivada.snapshot.params['id'];
    if (id) {
      this.findById(id);
    }
  }

  findById(id: number) {
    this.backendErrors = {};

    this.generoService.findById(id).subscribe({
      next: (generoRetornado) => {
        this.genero = generoRetornado;
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
    if (this.genero.id > 0) {
      this.generoService.update(this.genero, this.genero.id).subscribe({
        next: (mensagem) => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.roteador.navigate(['dashboard/generos']);
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
      this.generoService.save(this.genero).subscribe({
        next: (mensagem) => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.roteador.navigate(['dashboard/generos']);
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
}
