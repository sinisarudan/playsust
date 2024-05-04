import { QuestStep } from "./questStep";

export class Quest {
  public static TYPE:string = 'playsust.q.quest';
  public _id: string;
  public humanID: number;
  public sdgs: number[] = []; //one quest might be applicable for several SDGs
  public title: string; //might be same as the SDG's motto/goal
  public questSteps:QuestStep[];
  public stepConnections: any;
  
  constructor() {
    this.stepConnections = {};
  }
}
