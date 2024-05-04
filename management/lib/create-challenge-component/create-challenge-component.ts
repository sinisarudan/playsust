import { Component, OnInit, Inject } from "@angular/core";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestChallenge } from "@colabo-playsust/f-core";
import { CHALLENGE_RESOURCE_PATH } from "@colabo-playsust/f-core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Dialog, Dialog1Btn, Dialog2Btn, DialogData } from "@colabo-utils/f-notifications";
import { UploadStatus, UploadResult } from "@colabo-media/f-upload";
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

// import { QuestSolution } from "@colabo-playsust/f-core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from "@angular/forms";

// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// import {GlobalEmittersArrayService} from '@colabo-puzzles/f-core/code/puzzles/globalEmitterServicesArray';
import { PlaySustService } from "@colabo-playsust/f-core";

@Component({
  selector: "playsust-create-challenge",
  templateUrl: "./create-challenge-component.html",
  styleUrls: ["./create-challenge-component.scss"]
})
export class CreateChallengeComponent implements OnInit {
    public DESC_MIN: number = 10;
    public DESC_MAX: number = 1000;
    public TITLE_MIN: number = 2;
    public TITLE_MAX: number = 100;
  
    
    public questChallenge: QuestChallenge;
    public questChallengePreview: QuestChallenge;
  
    public questChallengeForm: FormGroup;
    public submitted: boolean = false;
    public isPreviewing:boolean = false;
    public imgHolder:string = '/assets/images/img-holder.png';
    public noPhoto:boolean = false;
  
    dialogRef: MatDialogRef<Dialog1Btn | Dialog2Btn, any>;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public challengeEditingId: string,
    private playsustService: PlaySustService,
    private bottomSheet: MatBottomSheet,
    private fb: FormBuilder,
    private bottomSheetRef: MatBottomSheetRef<CreateChallengeComponent>,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.bottomSheetRef.afterDismissed().subscribe(this.dismissed.bind(this));
  }

  ngOnInit() {
    //TODO: should set it up from local storage (mobile) if got lost
    this.submitted = false;
    if(this.challengeEditingId){
      //TODO: Warning! So far is expected that the challenges are preloaded in the service
      this.questChallenge = this.playsustService.getQuestChallenge(this.challengeEditingId);
    }
    else{
      this.questChallenge = new QuestChallenge();
    }
    this.questChallengePreview = new QuestChallenge();

    this.show(); //MUST be called AFTER the SOLUTION is set up, because it references it
  }

  get imgName():string{
    //TODO: Replace "this.questChallengeForm.value.title.length >= this.TITLE_MIN" with somehow using the validator for that value 
    let result:string = (this.questChallengeForm.value.title && this.questChallengeForm.value.title.length) >= this.TITLE_MIN ? this.questChallengeForm.value.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'challenge_non_valid_title';
    return result;
  }

  uploadStatusChanged(uploadResult:UploadResult):void{
    if(uploadResult.status === UploadStatus.UPLOADED)
    {
      this.questChallenge.image = uploadResult.image;
      console.info("[CreateChallengeComponent:uploadStatusChanged] this.questChallenge.image: %s", this.questChallenge.image);
    }
  }

  public challengeIllustrationUrl(): string {
    return CHALLENGE_RESOURCE_PATH + this.questChallenge.image;
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


  /**
   *
   */
  onSubmit() {
    this.dialogRef = Dialog.open(
      this.dialog,
      2,
      new DialogData("Are you sure you want to submit?  Have you uploaded an image?!", null, "Yes", "No", false),
      { disableClose: true },
      this.submitConfirmation.bind(this)
    );
  }

  get isEditing():boolean{
    return this.challengeEditingId ? true : false;
  }

  submitConfirmation(val:number):void{
    // console.log('val',val);
    if(val === 1)
    {
      this.submitted = true;
      this.form2item(this.questChallenge);
      this.playsustService
      .saveQuestChallenge(this.questChallenge, this.isEditing)
      .subscribe(this.challengeSaved.bind(this));
    }
  }

  /**
   * @description fills the `questChallenge` with `questChallengeForm.value`
   * @param questChallenge 
   */
  protected form2item(questChallenge:QuestChallenge){
    console.log("questChallengeForm", this.questChallengeForm);
    questChallenge.title = this.questChallengeForm.value.title;
    questChallenge.description = this.questChallengeForm.value.description;
    // questChallenge.image = this.questChallengeForm.value.image;
  }

  protected challengeSaved(result: QuestChallenge): void {
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


  show() {
    this.questChallengeForm = this.fb.group({
        title: new FormControl(this.questChallenge.title, [
          Validators.required,
          Validators.minLength(this.TITLE_MIN),
          Validators.maxLength(this.TITLE_MAX)
        ]),
        description: new FormControl(this.questChallenge.description, [
          Validators.required,
          Validators.minLength(this.DESC_MIN),
          Validators.maxLength(this.DESC_MAX)
        ])
        // ,
        // noPhoto: [this.noPhoto, [this.photoValidator.bind(this)]] //eg: 5da112f36841c168dd06b150
    });
    // https://alligator.io/angular/reactive-forms-valuechanges/
    this.questChallengeForm.valueChanges.subscribe(function(this:CreateChallengeComponent){
      this.form2item(this.questChallengePreview);
    }.bind(this));
  }

  // protected photoValidator(control: FormControl) {
  //   let noPhotoC: boolean = control.value as boolean;
  //   if (!noPhotoC && (this.questChallenge && !this.questChallenge.image)) {  
  //   return
  //       noPhoto: {
  //         ["photo not uploaded"]
  //       };
  //   }
  //   else{
  //     return null;
  //   }
  // }

  private playsustSent(result: boolean, error?: any): void {
    console.log("[playsustSent]", result, error);
  }
}

