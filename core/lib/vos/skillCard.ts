export const SKILL_RESOURCE_PATH: string = "assets/images/education/";

/**
 * @description Skill/Knowledge card
 */
export class SkillCard {
  static TYPE: string = "playsust.q.skill";

  public _id: string;
  public humanID: number;
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
