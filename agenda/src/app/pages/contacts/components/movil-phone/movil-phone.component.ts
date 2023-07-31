import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray} from '@angular/forms';
import { Phone } from '../../models/contactos.model';

@Component({
  selector: 'app-movil-phone',
  templateUrl: './movil-phone.component.html',
  styleUrls: ['./movil-phone.component.css']
})
export class MovilPhoneComponent implements OnInit{
  dynamicMovilForm: FormGroup;
  @Output() formDataSubmitted = new EventEmitter<any>();
  exceededDigits: boolean = false;
  exceededDigitsLada: boolean = false;
  @Input() phone;
  @Input() lada;
  editMode = false;
    constructor(private fb: FormBuilder){
      this.dynamicMovilForm = this.fb.group({
        areaCode: new FormControl ('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
        phoneValue: new FormControl ('', [Validators.required, Validators.pattern('^[0-9]{7}$')])
      });
   }

ngOnInit(){
  console.log(this.phone);
    this.editMode = this.phone != null ? true : false;
      this.dynamicMovilForm.patchValue({
        areaCode: this.lada,
        phoneValue: this.phone
       });
}

addPhone(phoneType: string): void {
  const phoneValue = this.dynamicMovilForm.value.phoneValue;
  const areaCode = this.dynamicMovilForm.value.areaCode;
  console.log(phoneType,phoneValue);
  this.formDataSubmitted.emit({ phoneType: phoneType,phoneValue: areaCode + phoneValue });
   this.dynamicMovilForm.reset();
   this.editMode =false;
   }

   checkDigits(){
    this.exceededDigits = this.dynamicMovilForm.value.phoneValue.length > 7;       
  }

  checkDigitsLada(){
    this.exceededDigitsLada = this.dynamicMovilForm.value.areaCode.length > 3;       
  }



}
