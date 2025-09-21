import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Livro } from '../models/livro';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LivroService {
  http = inject(HttpClient);

  API = 'http://localhost:8080/api/livros';

  constructor() {}

  findAll(): Observable<Livro[]> {
    return this.http.get<Livro[]>(this.API + '/findAll');
  }

  deleteById(id: number): Observable<string> {
    return this.http.delete<string>(this.API + '/deleteById/' + id, {
      responseType: 'text' as 'json',
    });
  }

  save(livro: Livro): Observable<string> {
    return this.http.post<string>(this.API + '/save', livro, {
      responseType: 'text' as 'json',
    });
  }

  update(livro: Livro, id: number): Observable<string> {
    return this.http.put<string>(this.API + '/update/' + id, livro, {
      responseType: 'text' as 'json',
    });
  }

  findById(id: number): Observable<Livro> {
    return this.http.get<Livro>(this.API + '/findById/' + id);
  }

  findByTitulo(titulo: string): Observable<Livro[]> {
    const params = new HttpParams().set('titulo', titulo);
    return this.http.get<Livro[]>(this.API + '/findByTitulo', { params });
  }

  findByGenerosNome(nome: string): Observable<Livro[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Livro[]>(this.API + '/findByGenerosNome', { params });
  }

  findLivrosMaisPopulares(minReservas: number): Observable<Livro[]> {
    const params = new HttpParams().set('minReservas', minReservas.toString());
    return this.http.get<Livro[]>(this.API + '/findLivrosMaisPopulares', {
      params,
    });
  }
}
