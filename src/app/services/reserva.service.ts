import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Reserva } from '../models/reserva';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  http = inject(HttpClient);

  API = 'http://localhost:8080/api/reservas';

  constructor() {}

  findAll(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.API + '/findAll');
  }

  deleteById(id: number): Observable<string> {
    return this.http.delete<string>(this.API + '/deleteById/' + id, {
      responseType: 'text' as 'json',
    });
  }

  save(reserva: Reserva): Observable<string> {
    return this.http.post<string>(this.API + '/save', reserva, {
      responseType: 'text' as 'json',
    });
  }

  update(reserva: Reserva, id: number): Observable<string> {
    return this.http.put<string>(this.API + '/update/' + id, reserva, {
      responseType: 'text' as 'json',
    });
  }

  findById(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(this.API + '/findById/' + id);
  }

  findByDataReservaAfter(data: Date): Observable<Reserva[]> {
    // Convert JS Date → ISO LocalDate (yyyy-MM-dd)
    const formattedDate = data.toISOString().split('T')[0];
    const params = new HttpParams().set('data', formattedDate);
    return this.http.get<Reserva[]>(this.API + '/findByDataReservaAfter', {
      params,
    });
  }

  findByDataReservaBefore(data: Date): Observable<Reserva[]> {
    // Convert JS Date → ISO LocalDate (yyyy-MM-dd)
    const formattedDate = data.toISOString().split('T')[0];
    const params = new HttpParams().set('data', formattedDate);
    return this.http.get<Reserva[]>(this.API + '/findByDataReservaBefore', {
      params,
    });
  }
}
