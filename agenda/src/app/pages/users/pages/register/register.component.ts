import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserModel } from '../../models/user.model';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { status } from 'src/app/enums/enum.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  mostrarHeader: boolean = false;
  public previsualizacion: string;
  public archivos: any = [];
  public loading: boolean;
  exito :string[] = null;
  exito2 :string[] = null;
  id: number;
  editMode = false;
  user: UserModel;
  datos;
  updateData;
  userForm: FormGroup;
  image :String;
  isPopupVisible = false;
  isPopupVisible2 = false;

constructor(private router: Router, 
  private route: ActivatedRoute, 
  private registerService: RegisterService, 
  private sanitizer: DomSanitizer,
  private fb: FormBuilder,
  private localStoreS : LocalstorageService){

    this.userForm = this.fb.group({
      userFullName: new FormControl('', Validators.required),
      userName: new FormControl('', Validators.required),
      userEmail: new FormControl('', [Validators.required, Validators.email]),
      userPassword: new FormControl('', Validators.required),
      userPhoto: new FormControl('', Validators.required),
     });
  }

ngOnInit(): void {

  this.datos = this.localStoreS.getItem('users');

  this.route.params
  .subscribe(
  (params: Params) => {
    this.id = +params['id'];
    this.editMode = params['id'] != null ? true : false;
    this.user = this.datos[this.id];
    // this.initForm();
      this.userForm.patchValue({
        userFullName: this.user.userFullName,
        userName: this.user.userName,
        userEmail: this.user.userEmail,
        userPassword: this.user.userPassword
       });
       this.getImagen(); 
    }
  
  );

}

onCancel(){
  this.router.navigate(['/auth'], {relativeTo: this.route})
}

closePopup(): void {
  this.isPopupVisible = false;
  this.router.navigate(['/contact/contactos'], {relativeTo: this.route});
  
}

closePopup2(): void {
  this.isPopupVisible = false;
  this.router.navigate(['../login'], {relativeTo: this.route})
}

onSwitchMode() {
  if(this.editMode){
    this.router.navigate(['/contatc/contactos'], {relativeTo: this.route})
  }
  else{
    this.router.navigate(['/auth'], {relativeTo: this.route})
  }
}

onSubmit() {
  const idUser = this.user.userId;
  const nameC = this.userForm.value.userFullName;
  const userN = this.userForm.value.userName;
  const email = this.userForm.value.userEmail;
  const password = this.userForm.value.userPassword;
  const photo = this.userForm.value.userPhoto;
  const newUser = new UserModel(nameC, userN, password, email, photo, idUser);

  if(this.editMode){
    this.updateUser(newUser);
    this.datos = this.userForm.value;
    this.localStoreS.getItem('users');
    }else{
    if (!this.userForm.valid) {
      return;
    }
    this.createUser(newUser);
    this.isPopupVisible2 = true;
      }
      this.isPopupVisible = true;
  }


createUser(newUser: UserModel){
  this.registerService.signUp(newUser).subscribe(
    data =>{
      console.log(data);
      if(data.statusCode === status.success){
      this.exito2 = data.friendlyMessage;
      }
    },
    error =>{
      console.log(error);
    }
  );
}

updateUser(newUser: UserModel){
 this.registerService.updateUser(newUser).subscribe(data =>{
  console.log(data);
  if(data.statusCode === status.success){
     this.exito = data.friendlyMessage;
     this.localStoreS.actualizarElemento('users',1, newUser);
  }
 }, error =>{
   console.log(error);
  });
}

  capturarFile(event): any {
    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base;
      console.log(imagen);

    })
    this.archivos.push(archivoCapturado)
    // 
    // console.log(event.target.files);

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

  handleFileInputChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.image = reader.result as string;
      this.userForm.get('userPhoto').patchValue(reader.result);
    };

    reader.readAsDataURL(file);
  }

  getImagen(){
    this.image = this.user.userPhoto;
    if (this.image) {
    this.userForm.get('userPhoto').patchValue(this.image);
  }
  }

}
