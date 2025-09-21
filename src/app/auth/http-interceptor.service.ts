import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { ApiErrorResponse } from '../models/api-error-response';

export const meuhttpInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  if (token && !router.url.includes('/login')) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      let apiError: ApiErrorResponse;

      if (typeof err.error === 'string') {
        // Para caso o Backend retorne uma string em vez de JSON
        try {
          apiError = JSON.parse(err.error);
        } catch {
          apiError = {
            status: err.status,
            message: err.error || 'Erro inesperado',
            timestamp: new Date().toISOString(),
            errors: undefined,
          };
        }
      } else {
        // Se a response ja for JSON
        apiError = {
          status: err.status,
          message: err.error?.message || 'Erro inesperado',
          timestamp: err.error?.timestamp || new Date().toISOString(),
          errors: err.error?.errors || undefined,
        };
      }

      if (apiError.status === 401) {
        apiError.message = 'Não autenticado. Faça login novamente.';
      }
      if (apiError.status === 403) {
        apiError.message = 'Você não tem permissão para acessar esta página.';
      }

      // Tratamento global de 401 e 403 (erros de autenticação e permissão)
      if (apiError.status === 401 || apiError.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Acesso negado',
          text: apiError.message,
        }).then(() => router.navigate(['/login']));
      }

      return throwError(() => apiError);
    })
  );
};
