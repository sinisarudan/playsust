import { Component, OnInit, Inject } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from "@angular/forms";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Dialog, Dialog1Btn, Dialog2Btn, DialogData } from "@colabo-utils/f-notifications";

import { SkillCard } from "@colabo-playsust/f-core";
import { SKILL_RESOURCE_PATH } from "@colabo-playsust/f-core";

import { PlaySustService } from "@colabo-playsust/f-core";
import { UploadStatus, UploadResult } from "@colabo-media/f-upload";
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

@Component({
  selector: "playsust-create-skill",
  templateUrl: "./create-skill-component.html",
  styleUrls: ["./create-skill-component.scss"]
})
export class CreateSkillComponent implements OnInit {
  public DESC_MIN: number = 10;
  public DESC_MAX: number = 1000;
  public TITLE_MIN: number = 2;
  public TITLE_MAX: number = 100;
  
    public questSkill: SkillCard;
    public questSkillPreview: SkillCard;
  
    public questSkillForm: FormGroup;
    public submitted: boolean = false;
    public isPreviewing:boolean = false;

    dialogRef: MatDialogRef<Dialog1Btn | Dialog2Btn, any>;

    public imgHolder:string = '/assets/images/img-holder.png';
    public noPhoto:boolean = false;


  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public skillEditingId: string,
    private playsustService: PlaySustService,
    private bottomSheet: MatBottomSheet,
    private fb: FormBuilder,
    private bottomSheetRef: MatBottomSheetRef<CreateSkillComponent>,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.bottomSheetRef.afterDismissed().subscribe(this.dismissed.bind(this));
  }

  ngOnInit() {
    this.submitted = false;
    if(this.skillEditingId)
    {
      this.questSkill = this.playsustService.getQuestSkill(this.skillEditingId);
    }else
    {this.questSkill = new SkillCard();}
    this.questSkillPreview = new SkillCard();

    this.submitted = false;
    this.show(); //MUST be called AFTER the SOLUTION is set up, because it references it
  }

  get imgName():string{
    //TODO: Replace "this.questSkillForm.value.title.length >= this.TITLE_MIN" with somehow using the validator for that value 
    let result:string = (this.questSkillForm.value.title && this.questSkillForm.value.title.length) >= this.TITLE_MIN ? this.questSkillForm.value.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'challenge_non_valid_title';
    return result;
  }

  uploadStatusChanged(uploadResult:UploadResult):void{
    if(uploadResult.status === UploadStatus.UPLOADED)
    {
      this.questSkill.image = uploadResult.image;
      console.info("[CreateChallengeComponent:uploadStatusChanged] this.questSkill.image: %s", this.questSkill.image);
    }
  }

  public challengeIllustrationUrl(): string {
    return SKILL_RESOURCE_PATH + this.questSkill.image;
  }

  dismissed(): void {
    console.log("[Form] dismissed");
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

  /**
   * Shows the preview dialogue for the entered entry
   */
  preview(){
    this.isPreviewing = true;
  }

  /**
   * Hides the preview dialogue for the entered entry and switches back to editing
   */
  edit(){
    this.isPreviewing = false;
  }

  get isEditing():boolean{
    return this.skillEditingId ? true : false;
  }

  /**
   *
   */
  onSubmit() {
    this.dialogRef = Dialog.open(
      this.dialog,
      2,
      new DialogData("Are you sure you want to submit? Have you uploaded an image?!", null, "Yes", "No", false),
      { disableClose: true },
      this.submitConfirmation.bind(this)
    );
  }

  submitConfirmation(val:number):void{
    // console.log('val',val);
    if(val === 1){
      this.submitted = true;
      this.form2item(this.questSkill);
      this.playsustService
      .saveQuestSkill(this.questSkill, this.isEditing)
      .subscribe(this.skillSaved.bind(this));
    }
  }

  /**
   * @description fills the `questSkill` with `questSkillForm.value`
   * @param questSkill 
   */
  protected form2item(questSkill:SkillCard){
    console.log("questSkillForm", this.questSkillForm);
    questSkill.title = this.questSkillForm.value.title;
    questSkill.description = this.questSkillForm.value.description;
    // questSkill.image = this.questSkillForm.value.image;
  }

  protected skillSaved(result: SkillCard): void {
    if (result) {
      this.snackBar.open("The Skill is saved ", "ID:"+result.humanID, {
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


  show() {
    this.questSkillForm = this.fb.group({
        title: new FormControl(this.questSkill.title, [
          Validators.required,
          Validators.minLength(this.TITLE_MIN),
          Validators.maxLength(this.TITLE_MAX)
        ]),
        description: new FormControl(this.questSkill.description, [
          Validators.required,
          Validators.minLength(this.DESC_MIN),
          Validators.maxLength(this.DESC_MAX)
        ])
    });
    // https://alligator.io/angular/reactive-forms-valuechanges/
    this.questSkillForm.valueChanges.subscribe(function(this:CreateSkillComponent){
      this.form2item(this.questSkillPreview);
    }.bind(this));
  }


  private playsustSent(result: boolean, error?: any): void {
    console.log("[playsustSent]", result, error);
  }
}

