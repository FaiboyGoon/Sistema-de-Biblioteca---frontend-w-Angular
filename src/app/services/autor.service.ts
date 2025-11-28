import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Autor } from '../models/autor';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AutorService {
  http = inject(HttpClient);

  API = environment.API_URL+'/api/autores';

  constructor() {}

  findAll(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.API + '/findAll');
  }

  deleteById(id: number): Observable<string> {
    return this.http.delete<string>(this.API + '/deleteById/' + id, {
      responseType: 'text' as 'json',
    });
  }

  save(autor: Autor): Observable<string> {
    return this.http.post<string>(this.API + '/save', autor, {
      responseType: 'text' as 'json',
    });
  }

  update(autor: Autor, id: number): Observable<string> {
    return this.http.put<string>(this.API + '/update/' + id, autor, {
      responseType: 'text' as 'json',
    });
  }

  findById(id: number): Observable<Autor> {
    return this.http.get<Autor>(this.API + '/findById/' + id);
  }

  findByNome(nome: string): Observable<Autor[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Autor[]>(this.API + '/findByNome', { params });
  }
}
