import { Component, EventEmitter, OnInit,Input, Output} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-whats-app-phone',
  templateUrl: './whats-app-phone.component.html',
  styleUrls: ['./whats-app-phone.component.css']
})
export class WhatsAppPhoneComponent implements OnInit {
  whatsAppForm: FormGroup;
  @Output() formDataSubmitted = new EventEmitter<any>();
  exceededDigits: boolean = false;
  exceededDigitsLada: boolean = false;
  @Input() phone;
  @Input() lada;
  @Input() countryCode;
  editMode =false;
 
  constructor(private fb: FormBuilder){
    this.whatsAppForm = this.fb.group({
      countryCode: new FormControl('',[Validators.required, Validators.pattern(/^\+\d{1,3}$/)]),
      areaCode: new FormControl('',[Validators.required, Validators.pattern('^[0-9]{3}$')]),
      phoneValue: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{7}$')])
    })
  }

  ngOnInit(){
    console.log(this.phone);
    this.editMode = this.phone != null ? true : false;
      this.whatsAppForm.patchValue({
        countryCode: this.countryCode,
        areaCode: this.lada,
        phoneValue: this.phone
       });
  }


  addPhone(phoneType: string): void {
    const phoneValue = this.whatsAppForm.value.phoneValue;
    const areaCode = this.whatsAppForm.value.areaCode;
    const countryCode = this.whatsAppForm.value.countryCode;
    console.log(phoneType,phoneValue);
    this.formDataSubmitted.emit({ phoneType: phoneType, phoneValue: countryCode+ areaCode+ phoneValue });
     this.whatsAppForm.reset();
     this.editMode = false;
     }

     checkDigits(){
      this.exceededDigits = this.whatsAppForm.value.phoneValue.length > 7;       
    }

    checkDigitsLada(){
      this.exceededDigitsLada = this.whatsAppForm.value.areaCode.length > 3;       
    }

}
