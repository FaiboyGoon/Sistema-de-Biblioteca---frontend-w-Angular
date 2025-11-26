import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';
import Swal from 'sweetalert2';

export const loginGuard: CanActivateFn = (route, state) => {
  
  let loginService = inject(LoginService);
  let router = inject(Router);

  if(loginService.hasRole("USER") && state.url == '/dashboard/usuarios' || state.url == '/dashboard/usuarios/new'){
    Swal.fire({
      title: "Permissão Negada",
      text: "Você não tem permissão para acessar este conteúdo",
      icon: "error"
    });
    router.navigate(['/dashboard/principal']);
    return false;
    
  }

  return true;
};
