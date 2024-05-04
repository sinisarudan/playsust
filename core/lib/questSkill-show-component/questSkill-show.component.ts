import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { SkillCard } from "../vos/skillCard";
import { SKILL_RESOURCE_PATH } from "../vos/skillCard";

@Component({
  selector: "questSkill-show-puzzle",
  templateUrl: "./questSkill-show.component.html",
  styleUrls: ["./questSkill-show.component.scss"]
})
export class QuestSkillShowComponent implements OnInit {
  @Input() public skill:SkillCard;
  @Output() public editing:EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  public get imageUrl(): string {
    return this.skill && this.skill.image ? this.skill.image.url : '';
  }

  ngOnInit() {}

  edit():void{
    this.editing.emit(this.skill._id);
  }
}
