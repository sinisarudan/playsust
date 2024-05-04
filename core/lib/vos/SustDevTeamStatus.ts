import {KNodeFrontend as KNode} from '@colabo-knalledge/f-core';

export class SustDevTeamStatus {
  static TYPE: string = "sust.dev.team.status";
  public _id: string;
  cwcs: KNode[] = [];
  sdgs: number[];


  constructor() {
  }

  serialize(): any {
    return {
      //TODO:
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
