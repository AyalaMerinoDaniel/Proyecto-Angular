import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, Form, FormArray} from '@angular/forms';
import { Phone } from '../../models/contactos.model';

@Component({
  selector: 'app-house-phone',
  templateUrl: './house-phone.component.html',
  styleUrls: ['./house-phone.component.css']
})
export class HousePhoneComponent implements OnInit{
 dynamicForm: FormGroup;
 @Output() formDataSubmitted = new EventEmitter<any>();
 @Output() formDataUpdate = new EventEmitter<any>();
 exceededDigits: boolean = false;
 @Input() phone;
 editMode = false;
 @Input() parentMethod!: () => void;
 

  constructor(private fb: FormBuilder){
    this.dynamicForm= this.fb.group({
      phoneValue: new FormControl ('', [Validators.required, Validators.pattern('^[0-9]{7}$')])
    });
  }

  ngOnInit(): void {
    console.log(this.phone);
    this.editMode = this.phone != null ? true : false;
      this.dynamicForm.patchValue({
        phoneValue: this.phone
       });
  }

  addPhone(phoneType: string): void {
  const phoneValue = this.dynamicForm.value.phoneValue;
   console.log(phoneType,phoneValue);
   this.formDataSubmitted.emit({ phoneType: phoneType, phoneValue: phoneValue });
   this.dynamicForm.reset();
   this.editMode = false;
    
  }
  
  checkDigits(){
    this.exceededDigits = this.dynamicForm.value.phoneValue.length > 7;       
  }

  onCancelClick(): void {

    if (this.parentMethod) {
      console.log(this.parentMethod());
      this.parentMethod();
    }
  }
}
