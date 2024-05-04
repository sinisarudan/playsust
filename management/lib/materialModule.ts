import { NgModule } from "@angular/core";

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
// import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
// import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
// import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatFormFieldModule } from "@angular/material/form-field";

import {MatGridListModule} from '@angular/material/grid-list';
import {MatStepperModule} from '@angular/material/stepper';

@NgModule({
  exports: [
    //add all the Material Modules imported above:
    MatIconModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatStepperModule,
    MatSliderModule,
    MatSelectModule,
    MatGridListModule
  ]
})
export class MaterialModule {}
