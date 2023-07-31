import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContactModel } from 'src/app/pages/contacts/models/contactos.model';
import { ResultModel } from 'src/app/pages/contacts/models/result.model';
import { ContactoService } from 'src/app/pages/contacts/services/contacto.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit{
  @Input()totalPagesArray: number[] = [];
  visiblePages = 4;
  @Input() currentPage: number;
  @Input() totalPages: number;
  @Output() pageChange = new EventEmitter<number>();

  constructor(private spinner: NgxSpinnerService){}

ngOnInit(): void {
  
}

  onPageChange(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.spinner.show();
      setTimeout(()=>{
        this.currentPage++;
        this.spinner.hide();
      },2000);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.spinner.show();

      setTimeout(()=>{
        this.currentPage--;
        this.spinner.hide();
      },2000);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
      setTimeout(()=>{
        this.spinner.hide();
      },2000);
    }
  }


  get visiblePagesArray() {
    const halfVisiblePages = Math.floor(this.visiblePages / 2);
    const lastVisiblePage = Math.min(this.currentPage + halfVisiblePages, this.totalPages);
    const firstVisiblePage = Math.max(1, lastVisiblePage - this.visiblePages + 1);
    return Array.from({ length: lastVisiblePage - firstVisiblePage + 1 }, (_, i) => i + firstVisiblePage);
  }
}
