import { MODULE_NAME } from "./params";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ReactiveFormsModule } from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'
// Material
// import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./materialModule";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";

//import puzzle components:
import { CreatePuzzleComponent } from "./createPuzzle-component/createPuzzle.component";
import { CreateChallengeComponent } from "./create-challenge-component/create-challenge-component";
import { CreateSkillComponent } from "./create-skill-component/create-skill-component";
import { PlaySustMComponent } from "./playsust-m-component/playsust-m.component";
import { RimaAaaModule } from "@colabo-rima/f-aaa";
import { PlaySustModule } from "@colabo-playsust/f-core";
import { MediaUploadModule } from "@colabo-media/f-upload"
//  components classes:
var moduleDeclarations: any[] = [
  CreatePuzzleComponent,
  CreateChallengeComponent,
  CreateSkillComponent,
  PlaySustMComponent
];

var moduleImports: any[] = [
  RouterModule,
  //examplar, often required imported modules:
  ReactiveFormsModule,
  // FormsModule,
  //...
  // Material:
  CommonModule,
  MaterialModule,
  FlexLayoutModule,
  RimaAaaModule,
  PlaySustModule,
  MediaUploadModule
];

@NgModule({
  declarations: moduleDeclarations,
  imports: moduleImports,
  // exports: moduleImports.concat(moduleDeclarations)
  exports: moduleDeclarations,

  //service classes this module exports:
  providers: [],
  entryComponents: [
    CreateChallengeComponent,
    CreateSkillComponent,
    CreatePuzzleComponent
  ]
})
export class PlaySustManagementModule {}
