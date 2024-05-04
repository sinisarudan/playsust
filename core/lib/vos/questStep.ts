import {Quest} from './quest';
import { QuestPuzzle } from './questPuzzle';

export class QuestStep {
  static TYPE: string = "playsust.q.step";
  public _id: string;
  public humanID: number;
  public questId: string; //Quest;
  public questPuzzleId: string; //QuestPuzzle;

  constructor() {
    // this.quest = new Quest();
    // this.questPuzzle = new QuestPuzzle();
  }
}
