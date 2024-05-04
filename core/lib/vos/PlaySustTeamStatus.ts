import { QuestStep } from "./questStep";
import { SustDevTeamStatus } from "./SustDevTeamStatus";

export class PlaySustTeamStatus extends SustDevTeamStatus {
  static TYPE: string = "playsust.team.status";
  questStep: QuestStep;
  // quest: Quest; //TODO: should we add it or all through the `QuestStep`
  public achievements: string[]; //answers on questions from the `QuestPuzzle`

  constructor() {
    super();
  }

  serialize(): any {
    let obj: any = super.serialize();
    //TODO: obj.questStep = this.questStep._id,
    return obj;
  }
}
