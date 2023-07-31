
export interface Email {
    emailId: number;
    emailValue: string;
  }
  
export interface Phone {
    phoneId: number;
    phoneValue: string;
    phoneType: string;
    areaCode?: string;
    countryCode?: string;
  }
  
  export class Tag {
    tagId: number;
    tagValue: string;

    constructor(tagId: number, tagValue: string){
      this.tagId = tagId;
      this.tagValue = tagValue;
    }
  }
  
  export class ContactModel {
    contactId?: number;
    contactFirstName: string;
    contactLastName: string;
    contactCompany: string;
    contactBirthday: Date;
    contactNotes: string;
    contactAlias: string;
    contactPhoto: string;
    contactEmails: Email[];
    contactTags: Tag[];
    contactPhones: Phone[];

    constructor(contactFirstName: string, contactLastName: string, contactCompany: string,
      contactBirthday: Date, contactNotes: string, contactAlias: string, contactPhoto: string, contactEmails: Email[],
      contactTags: Tag[], contactPhones: Phone[],contactId?: number, ){
        this.contactId = contactId;
        this.contactFirstName = contactFirstName;
        this.contactLastName = contactLastName;
        this.contactCompany = contactCompany;
        this.contactBirthday = contactBirthday;
        this.contactNotes = contactNotes;
        this.contactAlias = contactAlias;
        this.contactPhoto = contactPhoto;
        this.contactEmails = contactEmails;
        this.contactTags = contactTags;
        this.contactPhones = contactPhones;
      }
  }

  export class DataModelContact{
    public code: number;
    public created: Date;
    public error: string;
    public friendlyMessage: string[];
    public message: string; 
    public result : {};
    public statusCode: number;
    public succeed : boolean;


constructor(code: number, created: Date, error: string, friendlyMessage: string[], message: string ,result: {},statusCode: number, succeed: boolean ){
    this.code = code;
    this.created = created;
    this.error = error;
    this.friendlyMessage = friendlyMessage;
    this.message = message;
    this.result = result;
    this.statusCode = statusCode;
    this.succeed = succeed;
      }
  }

