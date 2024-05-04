import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { QuestChallenge } from "../vos/questChallenge";
// import { CHALLENGE_RESOURCE_PATH } from "../vos/questChallenge";

@Component({
  selector: "questChallenge-show-puzzle",
  templateUrl: "./questChallenge-show.component.html",
  styleUrls: ["./questChallenge-show.component.scss"]
})
export class QuestChallengeShowComponent implements OnInit {
  @Input() public challenge:QuestChallenge;
  @Output() public editing:EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  public get imageUrl(): string {
    return this.challenge && this.challenge.image ? this.challenge.image.url : '';
  }

  ngOnInit() {}

  edit():void{
    this.editing.emit(this.challenge._id);
  }
}
