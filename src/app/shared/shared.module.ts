import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownDirective } from './dropdown.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertComponent } from './alert/alert.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DropdownDirective, LoadingSpinnerComponent, AlertComponent],
  imports: [CommonModule],
  exports: [
    DropdownDirective,
    LoadingSpinnerComponent,
    AlertComponent,
    CommonModule,
  ],
})
export class SharedModule {}
