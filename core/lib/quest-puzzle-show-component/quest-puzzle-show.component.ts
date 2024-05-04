import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { SKILL_RESOURCE_PATH, SkillCard } from "../vos/skillCard";
import { QuestPuzzle } from "../vos/questPuzzle";

@Component({
  selector: "quest-puzzle-show",
  templateUrl: "./quest-puzzle-show.component.html",
  styleUrls: ["./quest-puzzle-show.component.scss"]
})
export class QuestPuzzleShowComponent implements OnInit {
  @Input() public puzzle:QuestPuzzle;
  @Input() public puzzlesShowImages:boolean;
  @Input() public puzzlesShowDescriptions:boolean;
  @Output() public editing:EventEmitter<string> = new EventEmitter<string>();

  constructor(
  ) {
    // this.puzzle.challenge.title
  }

  get skill():SkillCard{
    return this.puzzle ? this.puzzle.skillCards[0] : null;
  }

  get skillTitle():string{
    return this.puzzle && this.puzzle.skillCards[0] ? this.puzzle.skillCards[0].title : 'undefined skill card';
  }

  get skillDescription():string{
    return this.puzzle && this.puzzle.skillCards[0] ? this.puzzle.skillCards[0].description : 'N/A';
  }

  public get challengeImageUrl(): string {
    return this.puzzle && this.puzzle.challenge && this.puzzle.challenge.image ? this.puzzle.challenge.image.url : 'https://colabo.space/data/images/logos/colabo-logo-with-url.png';
  }

  public get skillImageUrl(): string {
    return this.skill && this.skill.image ? this.skill.image.url : 'https://colabo.space/data/images/logos/colabo-logo-with-url.png';
  }

  // public illustrationUrl(): string {
  //   return this.puzzle ? (SKILL_RESOURCE_PATH + this.puzzle.image) : '';
  // }

  ngOnInit() {}

  edit():void{
    this.editing.emit(this.puzzle._id);
  }
}
