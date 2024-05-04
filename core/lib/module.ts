// import { MODULE_NAME } from "./params";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ReactiveFormsModule } from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'
// Material
// import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./materialModule";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RimaAaaModule } from "@colabo-rima/f-aaa";
import { CommonModule } from "@angular/common";
// import { PlaySustManagementModule } from "@colabo-playsust/f-management";

//import puzzle services:
import { PlaySustService } from "./playsust.service";

//import puzzle components:
import { PlaySustComponent } from "./playsust-component/playsust.component";
import { PlaySustStatsComponent } from "./playsust-stats-component/playsust-stats.component";
import { QuestSolutionShowComponent } from "./questSolution-show-component/questSolution-show.component";
import { QuestChallengeShowComponent } from "./questChallenge-show-component/questChallenge-show.component";
import { QuestSkillShowComponent } from "./questSkill-show-component/questSkill-show.component";
import { PlaySustQuestPuzzleFormComponent } from "./playsust-quest-puzzle-form/playsust-quest-puzzle-form.component";
import { QuestPuzzleShowComponent } from "./quest-puzzle-show-component/quest-puzzle-show.component";
import { PlaysustQuestSolutionFullShowComponent } from "./playsust-quest-solution-full-show/playsust-quest-solution-full-show.component";
// import { PlaySustPanelComponent } from "./playsust-panel/playsust-panel.component";
//  components classes:
const moduleDeclarations: any[] = [
	PlaySustComponent,
	PlaySustStatsComponent,
	QuestSolutionShowComponent,
	QuestChallengeShowComponent,
	QuestSkillShowComponent,
	PlaySustQuestPuzzleFormComponent,
	QuestPuzzleShowComponent,
	PlaysustQuestSolutionFullShowComponent,
	// PlaySustPanelComponent
];

const moduleImports: any[] = [
	RouterModule,
	//examplar, often required imported modules:
	ReactiveFormsModule,
	// FormsModule,
	//...
	// Material:
	// BrowserAnimationsModule,
	CommonModule,
	MaterialModule,
	FlexLayoutModule,
	RimaAaaModule,
	// PlaySustManagementModule
];

@NgModule({
	declarations: moduleDeclarations,
	imports: moduleImports,
	// exports: moduleImports.concat(moduleDeclarations)
	exports: moduleDeclarations,

	//service classes this module exports:
	providers: [PlaySustService],
	entryComponents: [
		PlaySustQuestPuzzleFormComponent,
		PlaysustQuestSolutionFullShowComponent,
		// PlaySustPanelComponent
		// BottomSheetOverviewExampleSheet //https://material.angular.io/components/bottom-sheet/overview#configuring-bottom-sheet-content-via-code-entrycomponents-code-
	],
})
export class PlaySustModule {}
