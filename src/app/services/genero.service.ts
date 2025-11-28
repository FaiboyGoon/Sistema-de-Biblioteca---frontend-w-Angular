import { inject, Injectable } from '@angular/core';
import { Genero } from '../models/genero';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../models/page';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeneroService {
  http = inject(HttpClient);

  API = environment.API_URL+'/api/generos';

  constructor() {}

  findAll(numPage: number, qtidPorPagina: number): Observable<Page> {
    return this.http.get<Page>(
      this.API + '/findAll/' + numPage + '/' + qtidPorPagina
    );
  }

  deleteById(id: number): Observable<string> {
    return this.http.delete<string>(this.API + '/deleteById/' + id, {
      responseType: 'text' as 'json',
    });
  }

  save(genero: Genero): Observable<string> {
    return this.http.post<string>(this.API + '/save', genero, {
      responseType: 'text' as 'json',
    });
  }

  update(genero: Genero, id: number): Observable<string> {
    return this.http.put<string>(this.API + '/update/' + id, genero, {
      responseType: 'text' as 'json',
    });
  }

  findById(id: number): Observable<Genero> {
    return this.http.get<Genero>(this.API + '/findById/' + id);
  }

  findByNome(nome: string): Observable<Genero[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Genero[]>(this.API + '/findByNome', { params });
  }
}
