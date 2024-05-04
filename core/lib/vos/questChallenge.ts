export const CHALLENGE_RESOURCE_PATH: string =
  "assets/images/quests/challenges/";

export class QuestChallenge {
  static TYPE: string = "playsust.q.challenge";

  public _id: string;
  public humanID: number; //TODO: FIX IT automatically

  public title: string;
  public description: string;
  public image: any;

  serialize(): any {
    return {
      humanID: this.humanID,
      title: this.title,
      description: this.description,
      image: this.image,
    };
  }

  deserialize(obj:any): void {
    if(obj){
      if("humanID" in obj){this.humanID = obj.humanID;}
      if("title" in obj){this.title = obj.title;}
      if("description" in obj){this.description = obj.description;}
      if("image" in obj){this.image = obj.image;}
    }
  }
}
