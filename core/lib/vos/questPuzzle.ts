import { QuestChallenge } from "./questChallenge";
import { QuestSolution } from "./questSolution";
import { SkillCard } from "./skillCard";

export class QuestPuzzle {
  static TYPE: string = "playsust.q.puzzle";
  public _id: string;
  public humanID: number;
  challenge: QuestChallenge;
  skillCards: SkillCard[] = [];
  // solution: QuestSolution;
  questions: string[];

  constructor() {
    this.challenge = new QuestChallenge();
    this.skillCards[0] = new SkillCard();
    // this.solution = new QuestSolution();
    this.questions = new Array<string>();
  }
  
  serialize(): any {
    const reducer = (accumulatedIds:string[], current:SkillCard) => { if(current._id) {accumulatedIds.push(current._id)}; return accumulatedIds};
    return {
      humanID: this.humanID,
      challengeId: this.challenge ? this.challenge._id : null,
      skillCardIds: this.skillCards ? this.skillCards.reduce(reducer, []) : [], //packing skillCards as an array of their ids
      questions: this.questions
    };
  }

  //TODO: FIX to generate Challenges and Sills:
  deserialize(obj:any): void {
    if(obj){
      if("humanID" in obj){this.humanID = obj.humanID;}
      
      if("challengeId" in obj){this.challenge = new QuestChallenge(); this.challenge._id = obj.challengeId;}
      if("skillCardIds" in obj){
        this.skillCards = []; 
        for(var i:number = 0; i<obj.skillCardIds.length; i++)
        {
          this.skillCards[i] = new SkillCard(); this.skillCards[i]._id = obj.skillCardIds[i];
        }
      }
      if("questions" in obj){this.questions = obj.questions;}
    }
  }
}
