import { Injectable } from '@angular/core';
import { BehaviorSubject} from "rxjs";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CountContactsService {
  count: number = 10;
  
  countChanged: BehaviorSubject<number> = new BehaviorSubject<number>(this.count);
  constructor() { }

  getContadorObservable(): Observable<number> {
    return this.countChanged.asObservable();
  }

 countIncrement() {
    this.count +=1;
    
    this.countChanged.next(this.count);
  }

  countDecrement() {
    if (this.count > 0) {
        this.count-=1
        this.countChanged.next(this.count);
      }
  }

}
