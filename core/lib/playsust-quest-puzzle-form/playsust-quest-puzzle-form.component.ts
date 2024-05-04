import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import { Dialog, Dialog1Btn, Dialog2Btn, DialogData } from "@colabo-utils/f-notifications";

import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { BottomShDgData, BottomShDg } from "@colabo-utils/f-notifications";
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestPuzzle } from "../vos/questPuzzle";
import { CHALLENGE_RESOURCE_PATH } from "../vos/questChallenge";
import { SKILL_RESOURCE_PATH, SkillCard } from "../vos/skillCard";
import { QuestSolution } from "../vos/questSolution";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from "@angular/forms";

// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// import {GlobalEmittersArrayService} from '@colabo-puzzles/f-core/code/puzzles/globalEmitterServicesArray';
import { PlaySustService } from "../playsust.service";
import { Team } from "@colabo-rima/i-aaa";
import { QuestStep } from "../vos/questStep";

export interface ITabData {
  title: string;
}

@Component({
  selector: "ng-playsust-form",
  templateUrl: "./playsust-quest-puzzle-form.component.html",
  styleUrls: ["./playsust-quest-puzzle-form.component.scss"]
})
/**
 * @property `playsust` keeps whole the data regarding the playsust, and it is filled to and changed by form. In the constructor we clone it from the service that keeps the persistent PlaySust data, not to change the original one in Servbice prior submitting (especially in the case of canceling the change)
 */
export class PlaySustQuestPuzzleFormComponent implements OnInit {
  @ViewChild('stepper', {static: false}) private myStepper: MatStepper;
  public DESC_MIN: number = 15;
  public DESC_MAX: number = 1000;
  public TITLE_MIN: number = 2;
  public TITLE_MAX: number = 70;
  public confirmedSDPillarsSliders:boolean = false;

  // public playsustFormActive = true;
  isLinear = true; //false; // `true` requires the user to complete previous steps before proceeding to following steps

  public questPuzzle: QuestPuzzle;
  public solution: QuestSolution;

  public questPuzzleForm: FormGroup;
  public submitted: boolean = false;
  protected puzzleId:string;
  public rounds:number[] = [1,2,3,4];
  public teams:Team[] = [];
  dialogRef: MatDialogRef<Dialog1Btn | Dialog2Btn, any>;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private playsustService: PlaySustService,
    public dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private fb: FormBuilder,
    private bottomSheetRef: MatBottomSheetRef<PlaySustQuestPuzzleFormComponent>,
    private snackBar: MatSnackBar
  ) {
    this.bottomSheetRef.afterDismissed().subscribe(this.dismissed.bind(this));
  }

  ngOnInit() {
    this.puzzleId = this.data._id;
    console.log('puzzleId',this.puzzleId);
    this.submitted = false;
    this.questPuzzle = this.playsustService.getQuestPuzle(this.puzzleId);

    this.initSolution();
    // this.teams = this.
    this.show(); //MUST be called AFTER the SOLUTION is set up, because it references it
  }

  protected initSolution(): void {
    //TODO: should set it up from local storage (mobile) if got lost
    this.solution = new QuestSolution();
  }

  get skill():SkillCard{
    return this.questPuzzle ? this.questPuzzle.skillCards[0] : null;
  }

  public get challengeImageUrl(): string {
    return this.questPuzzle && this.questPuzzle.challenge && this.questPuzzle.challenge.image ? this.questPuzzle.challenge.image.url : 'https://colabo.space/data/images/logos/colabo-logo-with-url.png';
  }

  public get skillImageUrl(): string {
    return this.skill && this.skill.image ? this.skill.image.url : 'https://colabo.space/data/images/logos/colabo-logo-with-url.png';
  }

  dismissed(): void {
    console.log("[PlaySustQuestPuzzleFormComponent] dismissed");
  }

  onSubmit() {
    this.dialogRef = Dialog.open(
      this.dialog,
      2,
      new DialogData("Are you sure you want to submit?", null, "Yes", "No", false),
      { disableClose: true },
      this.submitConfirmation.bind(this)
    );
  }

  /**
   *
   */
  submitConfirmation(val:number):void{
    if(val === 1)
    {
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

      //TODO: a workaround until questStep logics is implemented
      this.solution.questStep = new QuestStep();
      this.solution.questStep._id = this.questPuzzle._id;

      this.playsustService
        .saveQuestSolution(this.solution)
        .subscribe(this.solutionSaved.bind(this));
    }
  }

  protected solutionSaved(result: boolean): void {
    if (result) {
      this.snackBar.open("Your solution is saved", "Great!", {
        duration: 3000
      });
      this.bottomSheetRef.dismiss();
    } else {
      this.submitted = false;
      //TODO: to see if we close it here to, or?
      //TODO: to use a permanent error message (BottomSheet)
      this.snackBar.open("Error ", "OK", {
        duration: 5000
      });
    }
  }

  get questions(): FormArray {
    return this.questPuzzleForm.get("details").get("questions") as FormArray;
  }

  /**
   * if some of sliders is left untouched (its value is null when unchanged, yet it's 0 if it was changed and returned to 0) then asks for confirmation
   */
  nextIfValidDetails():void{
    if(this.confirmedSDPillarsSliders ||
      (
        this.questPuzzleForm.get('details').get('environmentImpact').value !== null &&
        this.questPuzzleForm.get('details').get('economyImpact').value !== null &&
        this.questPuzzleForm.get('details').get('cultureImpact').value !== null &&
        this.questPuzzleForm.get('details').get('societyImpact').value !== null
      )
    ){
      this.myStepper.next();
    }else{
      this.dialogRef = Dialog.open(
        this.dialog,
        2,
        new DialogData("You have left some of the impact sliders unchanged. Please confirm that you meant them to be equal to 0 ", null, "Yes", "No", false),
        { disableClose: true },
        this.pillarsConfirmation.bind(this)
      )
    }
  }

  pillarsConfirmation(val:number):void{
    if(val === 1)
    {
      this.confirmedSDPillarsSliders = true;
      this.myStepper.next();
    }
  }


  show() {
    let questionsArray: any = [];
    this.questPuzzle.questions.forEach((question, index) =>
      questionsArray.push(new FormControl("", Validators.required))
    );
    //{'question_'+index :

    this.questPuzzleForm = this.fb.group({
      // name: ['', [Validators.required,
      //   CustomValidators.validateCharacters //example of using custom validator imported from other service
      // ]],
      //   "email": ['', [Validators.required, Validators.email]],
      general: new FormGroup({
        team: new FormControl(this.solution.teamHumanId ),
        round: new FormControl(this.solution.roundHumanId ),
        title: new FormControl(this.solution.title, [
          Validators.required,
          Validators.minLength(this.TITLE_MIN),
          Validators.maxLength(this.TITLE_MAX)
        ]),
        description: new FormControl(this.solution.description, [
          Validators.required,
          Validators.minLength(this.DESC_MIN),
          Validators.maxLength(this.DESC_MAX)
        ])
      }),
      details: new FormGroup({
        environmentImpact: new FormControl(this.solution.environmentImpact),
        economyImpact: new FormControl(this.solution.economyImpact),
        cultureImpact: new FormControl(this.solution.cultureImpact),
        societyImpact: new FormControl(this.solution.societyImpact),
        // question: new FormControl("", Validators.required)
        questions: new FormArray(questionsArray)
      })

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
  }

  close():void{
    this.dialogRef = Dialog.open(
      this.dialog,
      2,
      new DialogData("Are you sure you want to cancel?", null, "Yes", "No", false),
      { disableClose: true },
      this.closeConfirmation.bind(this)
    );
  }

  closeConfirmation(val:number):void {
    if(val === 1)
    {this.bottomSheetRef.dismiss();}
  }

  private playsustSent(result: boolean, error?: any): void {
    console.log("[playsustSent]", result, error);
  }

  log(msg: string): void {
    console.log(msg);
  }
}
