import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';
import { NO_USER_ERROR } from "@colabo-rima/i-aaa";

import { Component, OnInit } from "@angular/core";
import { RimaAAAService } from "@colabo-rima/i-aaa";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { BottomShDgData, BottomShDg } from "@colabo-utils/f-notifications";
import { PlaySustService } from "../playsust.service";
import { QuestSolution } from "../vos/questSolution";
import { AvatarSize } from "@colabo-rima/f-aaa";
declare let bb:any;
// import {bb} from "billboard.js";

@Component({
  selector: "ng-playsust-stats",
  templateUrl: "./playsust-stats.component.html",
  styleUrls: ["./playsust-stats.component.css"]
})
export class PlaySustStatsComponent implements OnInit {
  public AvatarSize = AvatarSize; //https://github.com/angular/angular/issues/35363
  solutions:QuestSolution[] = [];
  teamScores:any = {};
  impacts:any = {
    cultureImpact: 0,
    economyImpact: 0,
    societyImpact: 0,
    environmentImpact: 0
  };

  constructor(
    private rimaAAAService: RimaAAAService,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    private playsustService: PlaySustService
  ) {}

  ngOnInit() {
    this.refresh();
  }

  private solutionsReceivedError(error: string) {
    console.warn("solutionsReceivedError]", error);
    if (error === NO_USER_ERROR) {
      this.snackBar.open("Your need to login to acces this page", "", {
        duration: 3000
      });
    } else {
      this.snackBar.open(
        "There was an error in accessing solutions",
        "Refresh the App",
        { duration: 3000 }
      );
    }
  }

  private solutionsReceived(solutions: QuestSolution[]): void {
    // console.log("[solutionsReceived] solutions:", solutions);
    this.solutions = solutions;

    // callculate overall values
    for(let solution of solutions){
      // impacts
      this.impacts.economyImpact += solution.economyImpact;
      this.impacts.environmentImpact += solution.environmentImpact;
      this.impacts.societyImpact += solution.societyImpact;
      this.impacts.cultureImpact += solution.cultureImpact;

      let team:number = ('teamHumanId' in solution) ? solution.teamHumanId : -1;

      // scores
      if(team>=0){
        if(!(team in this.teamScores)){
          this.teamScores[team] = {
            team: team,
            roundsPlayed: 0,
            score: 0
          }
        }
        let teamScore:any = this.teamScores[team];
        teamScore.roundsPlayed += 1;
        teamScore.score += "TO BE DONE"; //solution.evaluation.score; //TODO: commented by @sir because of switching to the full evaluation model
      }
    }

    // normalize impacts
    this.impacts.economyImpact /= this.solutions.length;
    this.impacts.environmentImpact /= this.solutions.length;
    this.impacts.societyImpact /= this.solutions.length;
    this.impacts.cultureImpact /= this.solutions.length;

    // normalize scores and generate chart columns
    let scoreColumns = [];
    for(let teamScoreId in this.teamScores){
      let teamScore:any = this.teamScores[teamScoreId];
      teamScore.score /= teamScore.roundsPlayed;
      scoreColumns.push(["Team " + teamScore.team, teamScore.score]);
    }

    // generate the pillars chart
    var chart = bb.generate({
      data: {
        columns: [
          ["Economy", this.impacts.economyImpact],
          ["Environment", this.impacts.environmentImpact],
          ["Society", this.impacts.societyImpact],
          ["Culture", this.impacts.cultureImpact]
        ],
        type: "bar"
      },
      bar: {
        width: {
          ratio: 0.5
        }
      },
      bindto: "#pillarsChart"
    });

    // generate the pillars chart
    var chart = bb.generate({
      data: {
        columns: scoreColumns,
        type: "bar"
      },
      bar: {
        width: {
          ratio: 0.5
        }
      },
      bindto: "#teamsScoresChart"
    });

  }

  public refresh(){
    this.impacts = {
      cultureImpact: 0,
      economyImpact: 0,
      societyImpact: 0,
      environmentImpact: 0
    };

    this.playsustService
    .getSolutions(true)
    .subscribe(
      this.solutionsReceived.bind(this),
      this.solutionsReceivedError.bind(this)
    );
  }

  get isLoggedIn(): Boolean {
    return this.rimaAAAService.getUser() !== null;
  }

  get isModerator() {
    return this.rimaAAAService.isModerator();
  }

  canOpenPanel(): boolean {
    return true;
  }
}
