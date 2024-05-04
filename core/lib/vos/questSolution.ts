import { QuestStep } from "./questStep";
import {SolutionEvaluation} from "./solutionEvaluation";

// export interface QuestSolutionEvaluation{
//   score:number;
// }

export class QuestSolution {
  static TYPE: string = "playsust.q.solution";
  public _id: string;
  public humanID: number; //TODO: FIX IT automatically

  //general:
  public title: string;
  public description: string;
  public image: any;

  //details:
  public environmentImpact: number;
  public economyImpact: number;
  public cultureImpact: number;
  public societyImpact: number;
  public answers: string[]; //answers on questions from the `QuestPuzzle`
  public teamHumanId:number;
  public roundHumanId:number;
  public evaluation:SolutionEvaluation;

  public teamId: string; //TODO: probably change to a reference to the team VO
  public questStep: QuestStep;

  constructor() {
    this.questStep = new QuestStep();
    this.evaluation = new SolutionEvaluation();
  }

  serialize(): any {
    return {
      humanID: this.humanID,
      title: this.title,
      description: this.description,
      image: this.image,
      environmentImpact: this.environmentImpact,
      economyImpact: this.economyImpact,
      cultureImpact: this.cultureImpact,
      societyImpact: this.societyImpact,
      answers: this.answers,
      teamId: this.teamId,
      questStepId: this.questStep._id,
      teamHumanId: this.teamHumanId,
      roundHumanId: this.roundHumanId,
      evaluation: this.evaluation
    };
  }

  deserialize(obj:any): void {
    if(obj){
      if("humanID" in obj){this.humanID = obj.humanID;}
      if("title" in obj){this.title = obj.title;}
      if("description" in obj){this.description = obj.description;}
      if("image" in obj){this.image = obj.image;}
      if("environmentImpact" in obj){this.environmentImpact = obj.environmentImpact;}
      if("economyImpact" in obj){this.economyImpact = obj.economyImpact;}
      if("societyImpact" in obj){this.societyImpact = obj.societyImpact;}
      if("cultureImpact" in obj){this.cultureImpact = obj.cultureImpact;}
      if("teamId" in obj){this.teamId = obj.teamId;}
      if("answers" in obj){this.answers = obj.answers;}
      if("teamHumanId" in obj){this.teamHumanId = obj.teamHumanId;}
      if("roundHumanId" in obj){this.roundHumanId = obj.roundHumanId;}
      if("evaluation" in obj){
        this.evaluation = Object.assign(new SolutionEvaluation(), obj.evaluation);
      }
      if("questStepId" in obj){
        //TODO
        this.questStep = new QuestStep();
        this.questStep._id = obj.questStepId;
      }
    }
  }
}
