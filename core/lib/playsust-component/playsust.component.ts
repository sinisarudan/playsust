import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSelectChange } from "@angular/material/select";
import { NO_USER_ERROR } from "@colabo-rima/i-aaa";

import { Component, OnInit } from "@angular/core";
import { RimaAAAService } from "@colabo-rima/i-aaa";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { BottomShDgData, BottomShDg } from "@colabo-utils/f-notifications";
import { PlaySustQuestPuzzleFormComponent } from "../playsust-quest-puzzle-form/playsust-quest-puzzle-form.component";
// import { PlaySustPanelComponent } from "../playsust-panel/playsust-panel.component";
// import { CreateChallengeComponent } from "@colabo-playsust/f-management";
import { PlaySustService } from "../playsust.service";
import { QuestPuzzle } from "../vos/questPuzzle";
import { QuestChallenge } from "../vos/questChallenge";
import { SkillCard } from "../vos/skillCard";
import { AvatarSize } from "@colabo-rima/f-aaa";

import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";

@Component({
	selector: "ng-playsust",
	templateUrl: "./playsust.component.html",
	styleUrls: ["./playsust.component.css"],
})
export class PlaySustComponent implements OnInit {
	puzzles: QuestPuzzle[] = [];
	challenges: QuestChallenge[] = [];
	skills: SkillCard[] = [];
	protected leftToLoadPuzzle: number;
	public form: FormGroup;
	public puzzlesLoaded: boolean;
	public AvatarSize = AvatarSize; //https://github.com/angular/angular/issues/35363

	constructor(private rimaAAAService: RimaAAAService, private bottomSheet: MatBottomSheet, private snackBar: MatSnackBar, private playsustService: PlaySustService, private fb: FormBuilder) {}

	ngOnInit() {
		this.leftToLoadPuzzle = 2;
		this.playsustService.getQuestChallenges().subscribe(this.challengesReceived.bind(this), this.challengesError.bind(this));
		this.playsustService.getQuestSkills().subscribe(this.skillsReceived.bind(this), this.skillsError.bind(this));
		this.form = this.fb.group({
			puzzle: new FormControl(),
		});
	}

	public puzzleSelected(event: MatSelectChange): void {
		console.log("puzzleSelected", event);
		const bottomSheetRef: MatBottomSheetRef = this.bottomSheet.open(PlaySustQuestPuzzleFormComponent, { disableClose: true, data: { _id: event.value } });
	}

	private challengesError(error: string) {
		console.warn("challengesError]", error);
		if (error === NO_USER_ERROR) {
			this.snackBar.open("Your need to login to acces this page", "", {
				duration: 3000,
			});
		} else {
			this.snackBar.open("There was an error in accessing challenges", "Refresh the App", { duration: 3000 });
		}
	}

	private challengesReceived(challenges: QuestChallenge[]): void {
		// console.log("[challengesReceived] challenges:", challenges);
		this.challenges = challenges;
		this.leftToLoadPuzzle--;
		if (this.leftToLoadPuzzle === 0) {
			this.loadPuzzles();
		}
	}

	private skillsError(error: string): void {
		console.warn("skillsError]", error);
		if (error === NO_USER_ERROR) {
			this.snackBar.open("Your need to login to acces this page", "", {
				duration: 3000,
			});
		} else {
			this.snackBar.open("There was an error in accessing skills", "Refresh the App", { duration: 3000 });
		}
	}

	private skillsReceived(skills: SkillCard[]): void {
		// console.log("[skillsReceived] skills:", skills);
		this.skills = skills;
		this.leftToLoadPuzzle--;
		if (this.leftToLoadPuzzle === 0) {
			this.loadPuzzles();
		}
	}

	loadPuzzles(): void {
		this.playsustService.getQuestPuzzles().subscribe(this.puzzlesReceived.bind(this), this.puzzlesError.bind(this));
	}

	private puzzlesError(error: string): void {
		console.warn("puzzlesError]", error);
		if (error === NO_USER_ERROR) {
			this.snackBar.open("Your need to login to acces this page", "", {
				duration: 3000,
			});
		} else {
			this.snackBar.open("There was an error in accessing puzzles", "Refresh the App", { duration: 3000 });
		}
	}

	private puzzlesReceived(puzzles: QuestPuzzle[]): void {
		// console.log("[puzzlesReceived] puzzles:", puzzles);
		this.puzzles = puzzles;
		this.puzzlesLoaded = true;
	}

	get isLoggedIn(): boolean {
		return this.rimaAAAService.getUser() !== null;
	}

	get isModerator(): boolean {
		return this.rimaAAAService.isModerator();
	}

	// playsustFormClosed:void{

	// }

	showPlaySustForm(): void {
		// let playsustFormData:BottomShDgData = {
		// ...
		//   callback: this.playsustFormClosed.bind(this)
		// };
		// let bottomSheetRef: MatBottomSheetRef = this.bottomSheet.open(
		//   PlaySustQuestPuzzleFormComponent
		//   // ,
		//   // { data: playsustFormData, disableClose: true }
		// );
	}

	// addChallenge(): void{
	//   let bottomSheetRef: MatBottomSheetRef = this.bottomSheet.open(
	//     CreateChallengeComponent,
	//     { disableClose: true }
	//   );
	// }

	public showPanel(): void {
		const bottomSheetRef: MatBottomSheetRef = this.bottomSheet.open(PlaySustQuestPuzzleFormComponent, { disableClose: true });
	}

	canOpenPanel(): boolean {
		return true;
		// (
		//   this.playsustService.playsust &&
		//   this.playsustService.playsust.phase !==
		//     PlaySustPhase.INACTIVE
		// );
	}
}
