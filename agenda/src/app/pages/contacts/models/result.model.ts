  import { ContactModel } from './contactos.model';
  export class ResultModel {
    count: number;
    list: ContactModel[];
  
    constructor(count: number, list: ContactModel[]){
      this.count = count;
      this.list = list;
    }
  }