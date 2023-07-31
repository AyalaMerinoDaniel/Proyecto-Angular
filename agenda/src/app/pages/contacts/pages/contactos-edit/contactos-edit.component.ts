import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ContactModel, Email, Phone} from '../../models/contactos.model';
import { DomSanitizer } from '@angular/platform-browser';
import { HousePhoneComponent} from '../../components/house-phone/house-phone.component'
import { MovilPhoneComponent } from '../../components/movil-phone/movil-phone.component';
import { WhatsAppPhoneComponent } from '../../components/whats-app-phone/whats-app-phone.component';
import { ContactoService } from '../../services/contacto.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { status } from 'src/app/enums/enum.enum';
import { CountContactsService } from 'src/app/services/count-contacts.service';

@Component({
  selector: 'app-contactos-edit',
  templateUrl: './contactos-edit.component.html',
  styleUrls: ['./contactos-edit.component.css']
})
export class ContactosEditComponent implements OnInit{
  @ViewChild('dynamicContainer', { read: ViewContainerRef }) dynamicContainer: ViewContainerRef;
  @ViewChild('dynamicContainer', { read: ViewContainerRef }) dynamicPhoneMobile: ViewContainerRef;
  @ViewChild('dynamicContainer', { read: ViewContainerRef }) dynamicPhoneWhatsApp: ViewContainerRef;
  @ViewChild('miPhoto', { static: false }) miPhoto: ElementRef;

  id: number;
  editMode = false;
  contacto: ContactModel;
  datos;
  contactForm :FormGroup;
  public previsualizacion: string;
  public archivos: any = [];
  lenghtEmails= null;
  lenghtTags = null;
  lenghtPhones = null;
  image :String;
  tagsLocalStorage: any[] = [];
  newTag: string = '';
  selectedTag: any | null = null;
  isVisible = false;
  selectedType: string;
  exito :string[] = null;
  exito2 :string[] = null;
  listTags: []= [];
  isPopupVisible = false;
  isPopupVisible2 = false;
  isPopupVisible3 = false;
  exceededDigits: boolean = false;
  @Output() formData = new EventEmitter<any>();


  constructor(private route: ActivatedRoute, 
     private router: Router, 
     private sanitizer: DomSanitizer, 
     private fb: FormBuilder, 
     private componentFactoryResolver: ComponentFactoryResolver,
     private contactService: ContactoService,
     private localStorageService: LocalstorageService,
     private countContactsService: CountContactsService){

    this.contactForm = this.fb.group({
      name: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      empresa: new FormControl('', Validators.required),
      phones: this.fb.array([]),
      cumpleaños: new FormControl(Date, Validators.required),
      alias: new FormControl('', Validators.required),
      notes: new FormControl('', Validators.required),
      imagePath: new FormControl(null, Validators.required),
      correos: this.fb.array([]),
      tags: this.fb.array([])
     });


  }

  ngOnInit(){
     this.datos = JSON.parse(localStorage.getItem('contactos'));
     this.tagsLocalStorage = this.localStorageService.getItem('etiquetas');
     console.log(this.tagsLocalStorage);
     
     this.route.params
    .subscribe(
    (params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null ? true : false;
      this.contacto = this.datos[this.id];
        
      this.contactForm.patchValue({
        name: this.contacto.contactFirstName,
        apellido: this.contacto.contactLastName,
        empresa: this.contacto.contactCompany,
        cumpleaños: this.contacto.contactBirthday,
        alias: this.contacto.contactAlias,
        notes: this.contacto.contactNotes
    });

      this.lenghtEmails = this.contacto.contactEmails.length;
      this.lenghtTags = this.contacto.contactTags.length;
      this.lenghtPhones = this.contacto.contactPhones.length;
      this.addPreviousTags();
      this.addPreviousEmails();
      this.addPreviousPhones();
      this.getImagen();
    }
  );  
  console.log(this.lenghtEmails);
  
  }
  
  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  getImagen(){
    this.image = this.contacto.contactPhoto;
    if (this.image) {
    this.contactForm.get('imagePath').patchValue(this.image);
  }
  }

  handleFileInputChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.image = reader.result as string;
      this.contactForm.get('imagePath').patchValue(reader.result);
    };

    reader.readAsDataURL(file);
  }

  onSubmit(){
    const name = this.contactForm.value.name;
    const lastName = this.contactForm.value.apellido;
    const company  = this.contactForm.value.empresa;
    const phones = this.contactForm.get('phones') as FormArray;
    const arrayPhones = phones.value;

    const Emails= this.contactForm.get('correos') as FormArray;
    const arrayEmails = Emails.value;

    const birthday = this.contactForm.value.cumpleaños;
    const alias = this.contactForm.value.alias;
    const notes = this.contactForm.value.notes;
    const image = this.contactForm.value.imagePath;

    const tags = this.contactForm.get('tags') as FormArray;
    const arrayTags = tags.value;

    const newContact = new ContactModel(name, lastName, company, birthday, notes, 
      alias, image, arrayEmails, arrayTags, arrayPhones);
    
    if(this.editMode){
      console.log(name, lastName,company,birthday,notes,alias,image,arrayEmails,arrayTags,arrayPhones);
      this.editContact(newContact, this.id);
      this.isPopupVisible2 = true;
    }else{
      this.createContact(newContact);
      this.isPopupVisible = true;
    }
}

createContact(newContact: ContactModel){
  this.countContactsService.countIncrement();
  this.contactService.addContact(newContact).subscribe(data=>{
    console.log(data);
    if(data.statusCode === status.success){
    this.exito2 = data.friendlyMessage;
  }
  }, error =>{
    console.log(error);
  }
  );
}

editContact(newContact: ContactModel, id:number){
  this.contactService.updateContact(newContact, id).subscribe(data=>{
    console.log(data);
    if(data.statusCode === status.success){
    this.exito = data.friendlyMessage;
    }
  }, error =>{
    console.log(error);
  });
}

onCancel(){
  this.router.navigate(['../'], {relativeTo: this.route})
}


//------------------------Correos------------------------------//
  addPreviousEmails() {

    const correos = this.contactForm.get('correos') as FormArray;
    this.contacto.contactEmails.forEach(email =>{
       correos.push(
        this.fb.group({
        emailId:  new FormControl(email.emailId, Validators.required),
        emailValue: new FormControl(email.emailValue, Validators.required)
      })
    );
    })
  
  }

  get emailsControls() {
    return (this.contactForm.get('correos') as FormArray).controls
  }

  
emailListArray() {
    return this.contactForm.get('correos') as FormArray;
  }

  
onAddCorreo(){
  let emailIdBefore
  if(!this.lenghtEmails){
    this.lenghtEmails = 0;
    emailIdBefore = 1;
  }else{
     emailIdBefore = this.emailsControls.at(this.lenghtEmails - 1)?.get('emailId')?.value + 1;
  }
(<FormArray>this.contactForm.get('correos')).push(
  new FormGroup({
    'emailId': new FormControl(emailIdBefore, Validators.required),
    'emailValue': new FormControl(null, [Validators.required, Validators.email])
  })
);
  this.lenghtEmails +=1; 
  console.log(this.lenghtEmails);
  console.log((<FormArray>this.contactForm.get('correos')).value);
  
}

onDeleteCorreo(index: number){
  (<FormArray>this.contactForm.get('correos')).removeAt(index);
  this.lenghtEmails-=1;
  console.log((<FormArray>this.contactForm.get('correos')).value);
}

editEmail(email: Email, index : number){
  
  (<FormArray>this.contactForm.get('correos')).removeAt(index);
  this.lenghtEmails-=1;
 
  let phoneIdBefore;

  if(!this.lenghtEmails){
    this.lenghtEmails = 0;
    phoneIdBefore = 1;
  }else{
     phoneIdBefore = this.emailsControls.at(this.lenghtEmails - 1)?.get('emailId')?.value + 1;
  }

  (<FormArray>this.contactForm.get('correos')).push(
    new FormGroup({
      'emailId': new FormControl(phoneIdBefore, Validators.required),
      'emailValue': new FormControl(email.emailValue, [Validators.required, Validators.email])
    })
  );
  console.log((<FormArray>this.contactForm.get('correos')).value);
  this.lenghtEmails+=1;
}

//------------------------TAGS------------------------------//

addTagLocalStorage(){

  
if(this.newTag !== ''){
  const newTagObj = {
    tagId: this.generarId(),
    tagValue: this.newTag
  };
  this.tagsLocalStorage.push(newTagObj);
  localStorage.setItem('etiquetas', JSON.stringify(this.tagsLocalStorage));
  this.newTag = '';
}
}

generarId(){
  const min = 8;
  const randomNumber = Math.floor(Math.random() * (100 - min + 1)) + min;
  return randomNumber;
}

seleccionarEtiqueta(etiqueta: any) {
  this.selectedTag = etiqueta;
}

addPreviousTags() {
  const tagss = this.contactForm.get('tags') as FormArray;
  this.contacto.contactTags.forEach(tag =>{
     tagss.push(
      this.fb.group({
      tagId:  new FormControl(tag.tagId, Validators.required),
      tagValue: new FormControl(tag.tagValue, Validators.required)
    })
  );
  })
}

get tagsControls() {
  return (this.contactForm.get('tags') as FormArray).controls
}


tagsListArray() {
  return this.contactForm.get('tags') as FormArray;
}


onAddTag(){
  let tagIdBefore;

  if(!this.lenghtTags){
    this.lenghtTags = 0;
    tagIdBefore = 1;
  }else{
     tagIdBefore = this.tagsControls.at(this.lenghtTags - 1)?.get('tagId')?.value + 1;
  }
(<FormArray>this.contactForm.get('tags')).push(
new FormGroup({
  'tagId': new FormControl(tagIdBefore, Validators.required),
  'tagValue': new FormControl(this.selectedTag, Validators.required)
})
);
this.lenghtTags +=1;

}

onDeleteTag(index: number){
this.tagsListArray().removeAt(index);
this.lenghtTags-=1;
}


openPopup3(): void {
  this.isPopupVisible3 = true;
}

closePopup(): void {
  this.isPopupVisible2 = false;
  this.router.navigate(['../'], {relativeTo: this.route})

}

closePopup2(): void {
  this.isPopupVisible = false;
  this.router.navigate(['../'], {relativeTo: this.route})
}

closePopupTag(): void {
  this.isPopupVisible3 = false;
}

deleteTag(id: number) {
   this.tagsLocalStorage.splice(id,1);
   this.localStorageService.setItem('etiquetas',this.tagsLocalStorage);
}


//------------------------PHONES------------------------------//
addPreviousPhones() {
  const phones = this.contactForm.get('phones') as FormArray;
  this.contacto.contactPhones.forEach(phone =>{
     phones.push(
      this.fb.group({
      phoneId:  new FormControl(phone.phoneId, Validators.required),
      phoneType:  new FormControl(phone.phoneType, Validators.required),
      phoneValue: new FormControl(phone.phoneValue, Validators.required)
    })
  );
  })
}

editedPhone(phone: Phone){
 
  let phoneIdBefore;

  if(!this.lenghtPhones){
    this.lenghtEmails = 0;
    phoneIdBefore = 1;
  }else{
     phoneIdBefore = this.emailsControls.at(this.lenghtEmails - 1)?.get('emailId')?.value + 1;
  }

  (<FormArray>this.contactForm.get('phones')).push(
    new FormGroup({
      'phoneId': new FormControl(phoneIdBefore, Validators.required),
      'phoneType': new FormControl(phone.phoneType, Validators.required),
      'phoneValue': new FormControl(phone.phoneValue, Validators.required)
    })
  );
  console.log((<FormArray>this.contactForm.get('phones')).value);
  this.lenghtPhones+=1;
}

editPhone(index : number){
  const phoneControl = this.phonesControls.at(index);
  const phoneValue = phoneControl.get('phoneValue').value;
  const phoneType= phoneControl.get('phoneType').value;

  this.phonesListArray().removeAt(index);
  this.lenghtPhones -=1;

  if(phoneType === 'phone'){
  const factory = this.componentFactoryResolver.resolveComponentFactory(HousePhoneComponent);
  this.dynamicContainer.clear();
  const componentRef = this.dynamicContainer.createComponent(factory);
  componentRef.instance.phone = phoneValue;

  componentRef.instance.formDataSubmitted.subscribe((phoneData: any) => {
    console.log('Datos actualizados:', phoneData);
    this.editedPhone(phoneData);
  });

}if(phoneType === 'mobile'){
  const lada = phoneControl.get('phoneValue').value.substring(0, 3);
  const phone = phoneControl.get('phoneValue').value.substring(3, 10);

  const factory = this.componentFactoryResolver.resolveComponentFactory(MovilPhoneComponent);
  this.dynamicPhoneMobile.clear();
  const componentRef = this.dynamicPhoneMobile.createComponent(factory);
  
  componentRef.instance.phone = phone;
  componentRef.instance.lada = lada;
  const addPhone= componentRef.instance.formDataSubmitted;
  addPhone.subscribe(phoneData=>{
    this.editedPhone(phoneData);
  });

}if(phoneType === 'whatsapp'){
  const countryCode = phoneControl.get('phoneValue').value.substring(0, 3);
  const lada = phoneControl.get('phoneValue').value.substring(3, 6);
  const phone = phoneControl.get('phoneValue').value.substring(6, 13);

  const factory = this.componentFactoryResolver.resolveComponentFactory(WhatsAppPhoneComponent);
  this.dynamicPhoneWhatsApp.clear();
  const componentRef = this.dynamicPhoneWhatsApp.createComponent(factory);

  componentRef.instance.phone = phone;
  componentRef.instance.lada = lada;
  componentRef.instance.countryCode = countryCode;

  const addPhone= componentRef.instance.formDataSubmitted;
  addPhone.subscribe(phoneData=>{
    this.editedPhone(phoneData);
  });
}
}


get phonesControls(){
 return (this.contactForm.get('phones') as FormArray).controls;
}
createComponent(){
  const factory = this.componentFactoryResolver.resolveComponentFactory(HousePhoneComponent);
  this.dynamicContainer.clear();
  const componentRef = this.dynamicContainer.createComponent(factory);

  const addPhone= componentRef.instance.formDataSubmitted;
  addPhone.subscribe(phoneData=>{
    console.log(phoneData);
    this.editedPhone(phoneData);
  });

 
}
createComponentMobile(){
  const factory = this.componentFactoryResolver.resolveComponentFactory(MovilPhoneComponent);
  this.dynamicPhoneMobile.clear();
  const componentRef = this.dynamicPhoneMobile.createComponent(factory);

  const addPhone= componentRef.instance.formDataSubmitted;
  addPhone.subscribe(phoneData=>{
    this.editedPhone(phoneData);
  });
  
}

createComponentWhatsApp(){
  const factory = this.componentFactoryResolver.resolveComponentFactory(WhatsAppPhoneComponent);
  this.dynamicPhoneWhatsApp.clear();
  const componentRef = this.dynamicPhoneWhatsApp.createComponent(factory);

  const addPhone= componentRef.instance.formDataSubmitted;
  addPhone.subscribe(phoneData=>{
    this.editedPhone(phoneData);
  });
}

phonesListArray() {
  return this.contactForm.get('phones') as FormArray;
}

removePhone(index: number) {
  this.phonesListArray().removeAt(index);
  this.lenghtPhones -=1;
}

//------------------------PHOTO------------------------------//
   capturarFile(event): any {
    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base;
      console.log(imagen);
      console.log(this.previsualizacion);

    })
    this.archivos.push(archivoCapturado)
  }


  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })


}
