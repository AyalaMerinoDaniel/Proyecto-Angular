import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private usuarioUpdateSubject = new BehaviorSubject<any[]>([]);
  userUpdate$ = this.usuarioUpdateSubject.asObservable();
  constructor() { 
    const userUpdate = JSON.parse(localStorage.getItem('usuarioActual'));
    this.usuarioUpdateSubject.next(userUpdate);
  }


  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  actualizarElemento (clave: string, indice: number, nuevoValor: any) {
    var miArray = JSON.parse(localStorage.getItem(clave));
    if (miArray && Array.isArray(miArray) && indice >= 0 && indice < miArray.length) {
      miArray[indice] = nuevoValor;
      localStorage.setItem(clave, JSON.stringify(miArray));
      this.usuarioUpdateSubject.next(miArray);
    }
  }
}
