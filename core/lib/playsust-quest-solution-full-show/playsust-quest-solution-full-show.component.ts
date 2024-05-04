import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Dialog, Dialog1Btn, Dialog2Btn, DialogData } from "@colabo-utils/f-notifications";

import { MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { Component, Inject, OnInit } from "@angular/core";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { BottomShDgData, BottomShDg } from "@colabo-utils/f-notifications";
import { MatSnackBar } from "@angular/material/snack-bar";
import { QuestPuzzle } from "../vos/questPuzzle";
import { CHALLENGE_RESOURCE_PATH } from "../vos/questChallenge";
import { SKILL_RESOURCE_PATH, SkillCard } from "../vos/skillCard";
import { QuestSolution } from "../vos/questSolution";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";

// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// import {GlobalEmittersArrayService} from '@colabo-puzzles/f-core/code/puzzles/globalEmitterServicesArray';
import { PlaySustService } from "../playsust.service";
import { Team } from "@colabo-rima/i-aaa";
import { SolutionEvaluation } from "../vos/solutionEvaluation";

export interface ITabData {
	title: string;
}

export enum PlaysustQuestSolutionShowMode {
	VIEW = "VIEW",
	EDIT = "EDIT",
	EVALUATE = "EVALUATE",
}

@Component({
	selector: "playsust-quest-solution-full-show",
	templateUrl: "./playsust-quest-solution-full-show.component.html",
	styleUrls: ["./playsust-quest-solution-full-show.component.scss"],
})
/**
 *
 */
export class PlaysustQuestSolutionFullShowComponent implements OnInit {
	public DESC_MIN: number = 15;
	public DESC_MAX: number = 1000;
	public TITLE_MIN: number = 2;
	public TITLE_MAX: number = 70;

	public rating: number = 1;

	// public playsustFormActive = true;
	isLinear = true; //false; // `true` requires the user to complete previous steps before proceeding to following steps

	protected solutionId: string;
	public showMode: PlaysustQuestSolutionShowMode;
	public questPuzzle: QuestPuzzle;
	public solution: QuestSolution;

	public questPuzzleForm: FormGroup;
	public submitted: boolean = false;
	public rounds: number[] = [1, 2, 3, 4];
	public teams: Team[] = [];
	dialogRef: MatDialogRef<Dialog1Btn | Dialog2Btn, any>;

	constructor(@Inject(MAT_BOTTOM_SHEET_DATA) private data: any, private playsustService: PlaySustService, public dialog: MatDialog, private bottomSheet: MatBottomSheet, private fb: FormBuilder, private bottomSheetRef: MatBottomSheetRef<PlaysustQuestSolutionFullShowComponent>, private snackBar: MatSnackBar) {
		this.solution = new QuestSolution();
		this.solutionId = data.solutionId;
		this.showMode = data.mode;
		this.bottomSheetRef.afterDismissed().subscribe(this.dismissed.bind(this));
	}

	ngOnInit() {
		console.log("solutionId", this.solutionId);
		this.submitted = false;
		const solutionOriginal: QuestSolution = this.playsustService.getQuestSolution(this.solutionId);
		this.solution = Object.assign(this.solution, solutionOriginal);
		//the upper assign made it shallow copy (thus referncing to the original evaluation) so we had to make it reference to a newly created object, while copying all the original propoerties to it
		this.solution.evaluation = Object.assign(new SolutionEvaluation(), solutionOriginal.evaluation);

		//TODO: a workaround until questStep logics is implemented:
		this.questPuzzle = this.playsustService.getQuestPuzle(this.solution.questStep._id);
		// this.teams = this.

		this.show(); //MUST be called AFTER the SOLUTION is set up, because it references it
	}

	public NaN2Zero(n: number): number {
		return isNaN(n) ? 0 : n;
	}

	get isEvaluation(): boolean {
		return this.showMode === PlaysustQuestSolutionShowMode.EVALUATE;
	}

	get skill(): SkillCard {
		return this.questPuzzle ? this.questPuzzle.skillCards[0] : null;
	}

	public get challengeImageUrl(): string {
		return this.questPuzzle && this.questPuzzle.challenge && this.questPuzzle.challenge.image ? this.questPuzzle.challenge.image.url : "https://colabo.space/data/images/logos/colabo-logo-with-url.png";
	}

	public get skillImageUrl(): string {
		return this.skill && this.skill.image ? this.skill.image.url : "https://colabo.space/data/images/logos/colabo-logo-with-url.png";
	}

	dismissed(): void {
		// console.log("[PlaysustQuestSolutionFullShowComponent] dismissed");
	}

	onSubmit() {
		this.dialogRef = Dialog.open(this.dialog, 2, new DialogData("Are you sure you want to submit?", null, "Yes", "No", false), { disableClose: true }, this.submitConfirmation.bind(this));
	}

	/**
	 *
	 */
	submitConfirmation(val: number): void {
		if (val === 1) {
			this.submitted = true;
			console.log("questPuzzleForm", this.questPuzzleForm);
			this.solution.title = this.questPuzzleForm.value.general.title;
			this.solution.description = this.questPuzzleForm.value.general.description;
			// this.solution.image = this.questPuzzleForm.value.general.image;

			this.solution.cultureImpact = this.questPuzzleForm.value.details.cultureImpact === null ? 0 : this.questPuzzleForm.value.details.cultureImpact;
			this.solution.economyImpact = this.questPuzzleForm.value.details.economyImpact === null ? 0 : this.questPuzzleForm.value.details.economyImpact;
			this.solution.environmentImpact = this.questPuzzleForm.value.details.environmentImpact === null ? 0 : this.questPuzzleForm.value.details.environmentImpact;
			this.solution.societyImpact = this.questPuzzleForm.value.details.societyImpact === null ? 0 : this.questPuzzleForm.value.details.societyImpact;

			this.solution.answers = this.questPuzzleForm.value.details.questions;

			/*
    !IMPORTANT: we tried to set it to NULL but then the code `deepAssign(old_data, data);` in backend `src/backend/dev_puzzles/knalledge/core/lib/modules/kNode.ts` breaks.
    Right now we use NaN value to mean non-evaluated
    if(this.solution.evaluation && !this.solution.evaluation.isEvaluated)
    {
      this.solution.evaluation = null; //non-evaluated yet
    }
    */

			this.playsustService
				.saveQuestSolution(this.solution, true) //TODO: so far is const `true` because this component is used just for edigin and evaluation and viewsing of solutions, but if it is merged with the solution creation component, than it should be variable
				.subscribe(this.solutionSaved.bind(this));
		}
	}

	protected solutionSaved(result: boolean): void {
		if (result) {
			this.snackBar.open("Your solution is saved", "Great!", {
				duration: 3000,
			});
			this.bottomSheetRef.dismiss();
		} else {
			this.submitted = false;
			//TODO: to see if we close it here to, or?
			//TODO: to use a permanent error message (BottomSheet)
			this.snackBar.open("Error ", "OK", {
				duration: 5000,
			});
		}
	}

	get questions(): FormArray {
		return this.questPuzzleForm.get("details").get("questions") as FormArray;
	}

	show() {
		const questionsArray: any = [];
		this.questPuzzle.questions.forEach((question, index) => questionsArray.push(new FormControl("", Validators.required)));
		//{'question_'+index :

		this.questPuzzleForm = this.fb.group({
			// name: ['', [Validators.required,
			//   CustomValidators.validateCharacters //example of using custom validator imported from other service
			// ]],
			//   "email": ['', [Validators.required, Validators.email]],
			general: new FormGroup({
				team: new FormControl(this.solution.teamHumanId),
				round: new FormControl(this.solution.roundHumanId),
				title: new FormControl(this.solution.title, [Validators.required, Validators.minLength(this.TITLE_MIN), Validators.maxLength(this.TITLE_MAX)]),
				description: new FormControl(this.solution.description, [Validators.required, Validators.minLength(this.DESC_MIN), Validators.maxLength(this.DESC_MAX)]),
			}),
			details: new FormGroup({
				environmentImpact: new FormControl(this.solution.environmentImpact),
				economyImpact: new FormControl(this.solution.economyImpact),
				cultureImpact: new FormControl(this.solution.cultureImpact),
				societyImpact: new FormControl(this.solution.societyImpact),
				// question: new FormControl("", Validators.required)
				questions: new FormArray(questionsArray),
			}),

			//
			// isPublic: [false],
			// // 'countryControl': [this.countries[1].id],
			// mapTemplate: [this.mapTemplates[0].id],
			// desc: [this.mapTemplates[0].desc],
			// mapId: ["", [this.mongoIdValidator]] //eg: 5da112f36841c168dd06b150
			//   "password":["", [Validators.required, Validators.minLength(3)]]

			// createPrivateIdeas: [this.playsust.createPrivateIdeas],
			// onlyIdeasToQuestion: [this.playsust.onlyIdeasToQuestion],
			// allowArgumentsToIdeas: new FormControl({
			//   value: this.playsust.allowArgumentsToIdeas,
			//   disabled: !this.playsust.onlyIdeasToQuestion
			// }),
			// allowAddingWhileSharingIdeas: [this.playsust.allowAddingWhileSharingIdeas]
			// name: ['', [Validators.required,
			//   CustomValidators.validateCharacters //example of using custom validator imported from other service
			// ]],
			//   "email": ['', [Validators.required, Validators.email]],
			// name: ["", [Validators.required, Validators.minLength(2)]],
			// isPublic: [false],
			// 'countryControl': [this.countries[1].id],
			// mapTemplate: [this.mapTemplates[0].id],
			// desc: [this.mapTemplates[0].desc],
			// mapId: ["", [this.mongoIdValidator]] //eg: 5da112f36841c168dd06b150
			//   "password":["", [Validators.required, Validators.minLength(3)]]
		});

		if (this.showMode === PlaysustQuestSolutionShowMode.EVALUATE || this.showMode === PlaysustQuestSolutionShowMode.VIEW) {
			(this.questPuzzleForm.controls["general"] as FormGroup).controls["title"].disable();
			(this.questPuzzleForm.controls["general"] as FormGroup).controls["description"].disable();
			(this.questPuzzleForm.controls["details"] as FormGroup).controls["environmentImpact"].disable();
			(this.questPuzzleForm.controls["details"] as FormGroup).controls["economyImpact"].disable();
			(this.questPuzzleForm.controls["details"] as FormGroup).controls["cultureImpact"].disable();
			(this.questPuzzleForm.controls["details"] as FormGroup).controls["societyImpact"].disable();
		}
	}

	close(): void {
		this.dialogRef = Dialog.open(this.dialog, 2, new DialogData("Are you sure you want to cancel?", null, "Yes", "No", false), { disableClose: true }, this.closeConfirmation.bind(this));
	}

	closeConfirmation(val: number): void {
		if (val === 1) {
			this.bottomSheetRef.dismiss();
		}
	}

	private playsustSent(result: boolean, error?: any): void {
		console.log("[playsustSent]", result, error);
	}

	/* ****** EVALUATION **** */
	public onRatingChanged(rating: number, attribute: string) {
		console.log(rating);
		this.solution.evaluation[attribute] = rating;
	}

	log(msg: string): void {
		console.log(msg);
	}
}
