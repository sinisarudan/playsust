import { Component, OnInit } from "@angular/core";
import { RimaAAAService } from "@colabo-rima/i-aaa";
import {
	MatBottomSheet,
	// MatBottomSheetRef
} from "@angular/material/bottom-sheet";
// import { BottomShDgData, BottomShDg } from "@colabo-utils/f-notifications";
// import { PlaySustPanelComponent } from "../playsust-panel/playsust-panel.component";
// import { CreateChallengeComponent } from "@colabo-playsust/f-management";
import { PlaySustService, QuestChallenge, SkillCard, QuestPuzzle, QuestSolution } from "@colabo-playsust/f-core";
import { CreateChallengeComponent } from "../create-challenge-component/create-challenge-component";
import { CreateSkillComponent } from "../create-skill-component/create-skill-component";
import { CreatePuzzleComponent } from "../createPuzzle-component/createPuzzle.component";
import { NO_USER_ERROR } from "@colabo-rima/i-aaa";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Quest } from "@colabo-playsust/f-core";
// import { PlaysustQuestSolutionFullShowComponent, PlaysustQuestSolutionShowMode } from "@colabo-playsust/f-core";

@Component({
	selector: "ng-playsust-m",
	templateUrl: "./playsust-m.component.html",
	styleUrls: ["./playsust-m.component.scss"],
})
export class PlaySustMComponent implements OnInit {
	public puzzlesShowImages: boolean = true;
	public puzzlesShowDescriptions: boolean = true;

	challenges: QuestChallenge[] = [];
	skills: SkillCard[] = [];
	puzzles: QuestPuzzle[] = [];
	quests: Quest[] = [];
	solutions: QuestSolution[] = [];
	protected leftToLoadPuzzle: number;

	constructor(private rimaAAAService: RimaAAAService, private bottomSheet: MatBottomSheet, private playsustService: PlaySustService, private snackBar: MatSnackBar) {}

	ngOnInit(): void {
		this.leftToLoadPuzzle = 2; //SKILLS + CHALLENGES
		this.playsustService.getQuestChallenges().subscribe(this.challengesReceived.bind(this), this.challengesError.bind(this));
		this.playsustService.getQuestSkills().subscribe(this.skillsReceived.bind(this), this.skillsError.bind(this));
		this.playsustService.getSolutions().subscribe(this.solutionsReceived.bind(this), this.solutionsError.bind(this));
		// this.playsustService
		// .getQuests()
		// .subscribe(
		//   this.questsReceived.bind(this),
		//   this.questsError.bind(this)
		// );
	}

	public refreshSolution(): void {
		this.playsustService.getSolutions(true).subscribe(this.solutionsReceived.bind(this), this.solutionsError.bind(this));
	}

	get isLoggedIn(): boolean {
		return this.rimaAAAService.getUser() !== null;
	}

	get isModerator(): boolean {
		return this.rimaAAAService.isModerator();
	}

	public puzzlesShowImagesChanged(): void {
		this.puzzlesShowImages = !this.puzzlesShowImages;
	}

	public puzzlesShowDescriptionsChanged(): void {
		this.puzzlesShowDescriptions = !this.puzzlesShowDescriptions;
	}

	private solutionsError(error: string): void {
		console.warn("solutionsError]", error);
		if (error === NO_USER_ERROR) {
			this.snackBar.open("Your need to login to acces this page", "", {
				duration: 3000,
			});
		} else {
			this.snackBar.open("There was an error in getting solutions", "Refresh the App", { duration: 3000 });
		}
	}

	private solutionsReceived(solutions: QuestSolution[]): void {
		// console.log("[solutionsReceived] solutions:", solutions);
		this.solutions = solutions.sort(
			(a: QuestSolution, b: QuestSolution) => a.title.localeCompare(b.title, "en", { sensitivity: "base" })
			//a.title.toLowerCase() < b.title.toLowerCase() ? -1 : (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : 0)
		);
	}

	editSolution(solutionId: string): void {
		// const bottomSheetRef: MatBottomSheetRef = this.bottomSheet.open(PlaysustQuestSolutionFullShowComponent, { data: { solutionId: solutionId, mode: PlaysustQuestSolutionShowMode.EDIT }, disableClose: true });
		// this.snackBar.open("Solutions editing not supported yet", "", {
		//   duration: 3000
		// });
		/*
    this.bottomSheet.open(
      CreateSolutionComponent,
      { data:solutionId , disableClose: true }
    )
    .afterDismissed().subscribe((solutionEdited:QuestSolution) => {
      console.log("editSolution", solutionEdited);
      let solutionLocal:QuestSolution = this.solutions.find((solution:QuestSolution) => solution._id === solutionEdited._id);
      if(solutionLocal)
      {
        solutionLocal = solutionEdited;
      }
    });
    */
	}

	viewSolution(solutionId: string): void {
		/*
    TODO: @sir hardcoded in DB `questStepId` to the puzzle._Id:
    "questStepId" : "5e0666a4dcaab2134b27d8c0"
    */
		// const bottomSheetRef: MatBottomSheetRef = this.bottomSheet.open(PlaysustQuestSolutionFullShowComponent, { data: { solutionId: solutionId, mode: PlaysustQuestSolutionShowMode.VIEW } });
	}

	evaluateSolution(solutionId: string): void {
		// const bottomSheetRef: MatBottomSheetRef = this.bottomSheet.open(PlaysustQuestSolutionFullShowComponent, { data: { solutionId: solutionId, mode: PlaysustQuestSolutionShowMode.EVALUATE }, disableClose: true });
	}

	private challengesError(error: string): void {
		console.warn("challengesError]", error);
		if (error === NO_USER_ERROR) {
			this.snackBar.open("Your need to login to acces this page", "", {
				duration: 3000,
			});
		} else {
			this.snackBar.open("There was an error in getting challenges", "Refresh the App", { duration: 3000 });
		}
	}

	private challengesReceived(challenges: QuestChallenge[]): void {
		// console.log("[challengesReceived] challenges:", challenges);
		this.challenges = challenges.sort(
			(a: QuestChallenge, b: QuestChallenge) => a.title.localeCompare(b.title, "en", { sensitivity: "base" })
			//a.title.toLowerCase() < b.title.toLowerCase() ? -1 : (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : 0)
		);
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
			this.snackBar.open("There was an error in getting skills", "Refresh the App", { duration: 3000 });
		}
	}

	private skillsReceived(skills: QuestChallenge[]): void {
		// console.log("[skillsReceived] skills:", skills);
		this.skills = skills.sort((a: SkillCard, b: SkillCard) => (a.title.toLowerCase() < b.title.toLowerCase() ? 1 : a.title.toLowerCase() > b.title.toLowerCase() ? -1 : 0));
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
	}

	addChallenge(): void {
		// let bottomSheetRef: MatBottomSheetRef =
		this.bottomSheet
			.open(CreateChallengeComponent, { disableClose: true })
			.afterDismissed()
			.subscribe((challenge: QuestChallenge) => {
				console.log("addChallenge", challenge);
				this.challenges.unshift(challenge);
			});
	}

	editChallenge(challengeId: string): void {
		this.bottomSheet
			.open(CreateChallengeComponent, { data: challengeId, disableClose: true })
			.afterDismissed()
			.subscribe((challengeEdited: QuestChallenge) => {
				console.log("editChallenge", challengeEdited);
				if (challengeEdited) {
					let challengeLocal: QuestChallenge = this.challenges.find((challenge: QuestChallenge) => challenge._id === challengeEdited._id);
					if (challengeLocal) {
						challengeLocal = challengeEdited;
					}
				}
			});
	}

	addSkillCard(): void {
		// let bottomSheetRef: MatBottomSheetRef =
		this.bottomSheet
			.open(CreateSkillComponent, { disableClose: true })
			.afterDismissed()
			.subscribe((skill: SkillCard) => {
				console.log("addSkillCard", skill);
				this.skills.unshift(skill);
			});
	}

	editSkillCard(skillId: string): void {
		this.bottomSheet
			.open(CreateSkillComponent, { data: skillId, disableClose: true })
			.afterDismissed()
			.subscribe((skillEdited: SkillCard) => {
				if (skillEdited) {
					console.log("editskill", skillEdited);
					let skillLocal: SkillCard = this.skills.find((skill: SkillCard) => skill._id === skillEdited._id);
					if (skillLocal) {
						skillLocal = skillEdited;
					}
				}
			});
	}

	addSPuzzle(): void {
		// let bottomSheetRef: MatBottomSheetRef =
		this.bottomSheet
			.open(CreatePuzzleComponent, { disableClose: true })
			.afterDismissed()
			.subscribe((puzzle: QuestPuzzle) => {
				console.log("addQuestPuzzle", puzzle);
				this.puzzles.unshift(puzzle);
			});
	}

	editPuzzle(puzzleId: string): void {
		this.bottomSheet
			.open(CreatePuzzleComponent, { data: puzzleId, disableClose: true })
			.afterDismissed()
			.subscribe((puzzleEdited: QuestPuzzle) => {
				console.log("editpuzzle", puzzleEdited);
				if (puzzleEdited) {
					let puzzleLocal: QuestPuzzle = this.puzzles.find((puzzle: QuestPuzzle) => puzzle._id === puzzleEdited._id);
					if (puzzleLocal) {
						puzzleLocal = puzzleEdited;
					}
				}
			});
	}

	// showPanel(): void {
	//   let bottomSheetRef: MatBottomSheetRef = this.bottomSheet.open(
	//     PlaySustQuestPuzzleFormComponent,
	//     { disableClose: true }
	//   );
	// }

	canOpenPanel(): boolean {
		return true;
		// (
		//   this.playsustService.playsust &&
		//   this.playsustService.playsust.phase !==
		//     PlaySustPhase.INACTIVE
		// );
	}
}
