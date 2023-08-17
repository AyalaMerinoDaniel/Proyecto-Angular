import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private usuarioUpdateSubject = new BehaviorSubject<any[]>([]);
  userUpdate$ = this.usuarioUpdateSubject.asObservable();
  localStorageService: {};
  constructor() { 
    const userUpdate = JSON.parse(localStorage.getItem('usuarioActual'));
    this.usuarioUpdateSubject.next(userUpdate);
  }


  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any {
    const item = localStorage.getItem(key);
    try {
      return JSON.parse(item); // Parse the JSON value
    } catch (error) {
      console.error('Error parsing JSON from localStorage:', error);
      return null; // Return null if parsing fails or if the key doesn't exist
    }
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
