import { QuestSolution } from "./questSolution";
/**
 * value of NaN for evaluations means it is NOT evaluated yet. Evaluated values go from 1 to 5
 */
export class SolutionEvaluation {
  static TYPE: string = "playsust.s.evaluation";
  public _id: string;

  public originality: number = NaN;
  public knowledgeAcquisition: number = NaN;
  public applicability: number = NaN;
  public visualization: number = NaN; //how well players have illustrated the solution (by drawing or a crafting)
  public sdPillarsAssesment: number = NaN; //how well players have assessed impact of their solution on SD pillars

  // public solution: QuestSolution;

  constructor() {
    // this.solution = new QuestSolution();
  }

  get totalScore():number{
    return (this.originality + this.knowledgeAcquisition + this.applicability + this.visualization + this.sdPillarsAssesment) / 5;
  }
  get isEvaluated():boolean{
    return this.totalScore !== 0 && !isNaN(this.totalScore);
  }

  /**
   * TO BE DONE
   */
  serialize(): any {
    return {
      // humanID: this.humanID,
      // title: this.title,
      // description: this.description,
      // image: this.image,
      // environmentImpact: this.environmentImpact,
      // economyImpact: this.economyImpact,
      // cultureImpact: this.cultureImpact,
      // societyImpact: this.societyImpact,
      // answers: this.answers,
      // teamId: this.teamId,
      // questStepId: this.questStep._id
    };
  }
}
