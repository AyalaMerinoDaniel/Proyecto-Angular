import { ContactModel, Tag, DataModelContact, Email, Phone } from "../models/contactos.model";
import { BehaviorSubject, Subject} from "rxjs";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { DataModel } from "src/app/models/data.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { apiUrl } from "src/app/environment/environmet-urls";


@Injectable({
    providedIn: 'root'
})
export class ContactoService{
    contactChanged = new Subject<ContactModel[]>();
    private headers = new HttpHeaders().set('Authorization', 'Bearer 12345678at'
    ).set('Content-Type','application/json').set('X-API-Key' , '7802c4c0');

constructor(private http: HttpClient){
    
}
    
    tagsList: Tag[]=[
       new Tag(0, 'Games'),
       new Tag(1, 'sports'),
       new Tag(2, 'Movies'),
       new Tag(3, 'Soccer'),
       new Tag(4, 'Smartphone'),
       new Tag(5, 'Social Media'),
       new Tag(6, 'COD'),
       new Tag(7, 'Play Station'),

    ];

    private contactos: ContactModel[]= [];

    setContacts(contacts: ContactModel[]){
        this.contactos = contacts;
        this.contactChanged.next(this.contactos.slice());
    }   

    getContactos(){
        return this.contactos.slice();
    }

    getContacto(id: number){
        return this.contactos[id];
     }
    
 
 storeContacts(offset: number, limit: number): Observable <DataModel>{
     const body = {
         "offset": offset,
         "limit": limit,
         "searchTerm": "test"
     }
     
     return this.http
     .put<DataModel>(
         apiUrl.baseUrl+'contacts', body,
          {headers: this.headers}
     );
 }
 
 
 
 fetchContacts():Observable<ContactModel> {
     return this.http.get<ContactModel>(
        apiUrl.baseUrl+'contacts',
         { headers: this.headers }
         );
     }
 
 
 addContact(newContact: ContactModel): Observable<DataModelContact>{
    return this.http.post<DataModelContact>(apiUrl.baseUrl+'contacts/create',
    {contactFirstName: newContact.contactFirstName,
     contactLastName: newContact.contactLastName,
     contactCompany: newContact.contactCompany,
     contactBirthday: newContact.contactBirthday,
     contactNotes: newContact.contactNotes,
     contactAlias: newContact.contactAlias,
     contactPhoto: newContact.contactPhoto,
     contactEmails: newContact.contactEmails,
     contactTags: newContact.contactTags,
     contactPhones: newContact.contactPhones
    },
    {headers: this.headers});

 }
 
 updateContact(newContact: ContactModel, id:number): Observable<DataModelContact>{
     return this.http.put<DataModelContact>(apiUrl.baseUrl+'contacts/update/'+id,
     {contactFirstName: newContact.contactFirstName,
        contactLastName: newContact.contactLastName,
        contactCompany: newContact.contactCompany,
        contactBirthday: newContact.contactBirthday,
        contactNotes: newContact.contactNotes,
        contactAlias: newContact.contactAlias,
        contactPhoto: newContact.contactPhoto,
        contactEmails: newContact.contactEmails,
        contactTags: newContact.contactTags,
        contactPhones: newContact.contactPhones
     },
     {headers: this.headers});
  }

  deleteContact(id: number): Observable<DataModelContact> {
    return this.http.delete<DataModelContact>(apiUrl.baseUrl+'contacts/delete/' + id, { headers: this.headers })
  }

}