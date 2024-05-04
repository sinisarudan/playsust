import { Component, OnInit, Inject } from "@angular/core";
import { PlaySustService, QuestChallenge, SkillCard, QuestPuzzle } from "@colabo-playsust/f-core";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { BottomShDgData, BottomShDg } from "@colabo-utils/f-notifications";
import { MatSnackBar } from '@angular/material/snack-bar';
import { NO_USER_ERROR } from "@colabo-rima/i-aaa";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Dialog, Dialog1Btn, Dialog2Btn, DialogData } from "@colabo-utils/f-notifications";
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from "@angular/forms";

@Component({
  selector: "playsust-create-puzzle",
  templateUrl: "./createPuzzle.component.html",
  styleUrls: ["./createPuzzle.component.css"]
})
export class CreatePuzzleComponent implements OnInit {

  challenges: QuestChallenge[] = [];
  skills: SkillCard[] = [];

  public questPuzzle:QuestPuzzle;
  public questPuzzleForm: FormGroup;
  public submitted: boolean = false;
  dialogRef: MatDialogRef<Dialog1Btn | Dialog2Btn, any>;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public puzzleEditingId: string,
    private playsustService: PlaySustService,
    private bottomSheetRef: MatBottomSheetRef<CreatePuzzleComponent>,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    if(this.puzzleEditingId){
      //TODO: Warning! So far is expected that the challenges are preloaded in the service
      this.questPuzzle = this.playsustService.getQuestPuzle(this.puzzleEditingId);
    }
    else{
      this.questPuzzle = new QuestPuzzle();
    }
    this.playsustService
        .getQuestChallenges()
        .subscribe(
          this.challengesReceived.bind(this),
          this.challengesError.bind(this)
        );
    this.playsustService
    .getQuestSkills()
    .subscribe(
      this.skillsReceived.bind(this),
      this.skillsError.bind(this)
    );
    this.show();
  }

  get isEditing():boolean{
    return this.puzzleEditingId ? true : false;
  }

  show() {
    this.questPuzzleForm = this.fb.group({
      challenge: new FormControl(this.questPuzzle.challenge, [
          Validators.required]),
        skill: new FormControl(this.questPuzzle.skillCards[0], [
          Validators.required])
    });
    // https://alligator.io/angular/reactive-forms-valuechanges/
    // this.questPuzzleForm.valueChanges.subscribe(function(this:CreatePuzzleComponent){
    //   this.form2item(this.questChallengePreview);
    // }.bind(this));
  }

  private challengesError(error: string) {
    console.warn("challengesError]", error);
    if (error === NO_USER_ERROR) {
      this.snackBar.open("Your need to login to acces this page", "", {
        duration: 3000
      });
    } else {
      this.snackBar.open(
        "There was an error in accessing challenges",
        "Refresh the App",
        { duration: 3000 }
      );
    }
  }

  private challengesReceived(challenges: QuestChallenge[]): void {
    // console.log("[challengesReceived] challenges:", challenges);
    this.challenges = challenges.sort( (a:QuestChallenge, b:QuestChallenge) => a.title < b.title ? -1 : (a.title === b.title ? 0 : 1));
  }

  private skillsError(error: string) {
    console.warn("skillsError]", error);
    if (error === NO_USER_ERROR) {
      this.snackBar.open("Your need to login to acces this page", "", {
        duration: 3000
      });
    } else {
      this.snackBar.open(
        "There was an error in accessing skills",
        "Refresh the App",
        { duration: 3000 }
      );
    }
  }

  private skillsReceived(skills: SkillCard[]): void {
    // console.log("[skillsReceived] skills:", skills);
    this.skills = skills.sort( (a:SkillCard, b:SkillCard) => a.title < b.title ? -1 : (a.title === b.title ? 0 : 1));
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
   * @description fills the `questPuzzle` with `questPuzzleForm.value`
   * @param questPuzzle
   */
  protected form2item(questPuzzle:QuestPuzzle){
    console.log("questPuzzleForm", this.questPuzzleForm);
    questPuzzle.challenge = this.challenges.find( (el:QuestChallenge) => el._id === this.questPuzzleForm.value.challenge);
    questPuzzle.skillCards[0] = this.skills.find( (el:SkillCard) => el._id === this.questPuzzleForm.value.skill);
    // questPuzzle.image = this.questPuzzleForm.value.image;
  }

  submitConfirmation(val:number):void{
    // console.log('val',val);
    if(val === 1)
    {
      this.submitted = true;
      this.form2item(this.questPuzzle);
      this.playsustService
      .saveQuestPuzzle(this.questPuzzle, this.isEditing)
      .subscribe(this.puzzleSaved.bind(this));
    }
  }

  protected puzzleSaved(result: QuestPuzzle): void {
    if (result) {
      this.snackBar.open("The Challenge is saved ", "ID:"+result.humanID, {
        duration: 5000
      });
      this.bottomSheetRef.dismiss(result);
    } else {
      this.submitted = false;
      //TODO: to see if we close it here to, or?
      //TODO: to use a permanent error message (BottomSheet)
      this.snackBar.open("Error ", "OK", {
        duration: 5000
      });
    }
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
}
