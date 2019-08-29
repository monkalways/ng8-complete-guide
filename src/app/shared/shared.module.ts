import { NgModule } from '@angular/core';
import { DropDownDirective } from './dropdown.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertComponent } from './alert/alert.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        DropDownDirective,
        LoadingSpinnerComponent,
        AlertComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DropDownDirective,
        LoadingSpinnerComponent,
        AlertComponent,
        CommonModule
    ]
})
export class SharedModule {

}
