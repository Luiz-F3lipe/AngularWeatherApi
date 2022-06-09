import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private storage: Storage;

  constructor() { 
    this.storage = window.localStorage;
  }

  Criar(key: string): string {
    const valor = this.storage.getItem(key)
    return valor ? valor: ''
  }
  Editar(key:string, value:string): void {
    this.storage.setItem(key, value)
  }
  Excluir(key:string): void {
    this.storage.removeItem(key)
  }
  Limpar(): void {
    this.storage.clear()
  }
}

export class StorageKeys {
  static readonly CIDADE = 'cidade';
  static readonly PAIS = 'pais';
  static readonly TEMPO_ATUAL = 'tempoAtual';
}
