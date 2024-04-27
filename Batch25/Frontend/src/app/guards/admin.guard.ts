import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const adminGuard: CanActivateFn = () => {
  const token = sessionStorage.getItem('token')
  if(!token){
    inject(Router).navigate(['/'])
    return false
  }
  else{
    const decodedToken = JSON.parse(atob(token.split('.')[1]))
    if(decodedToken.role === 'admin'){
      return true
    }
    else{
      inject(Router).navigate(['/'])
    }
  }
};
