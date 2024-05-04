import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { PlaySustService } from "../playsust.service";
import { QuestSolution } from "../vos/questSolution";
import {KNodeFrontend as KNode} from '@colabo-knalledge/f-core';
import { Observable } from "rxjs";
import { RimaAAAService } from "@colabo-rima/i-aaa";
import { AvatarSize, AvatarType } from "@colabo-rima/f-aaa";

@Component({
  selector: "quest-solution-show",
  templateUrl: "./questSolution-show.component.html",
  styleUrls: ["./questSolution-show.component.scss"]
})
export class QuestSolutionShowComponent implements OnInit {
  @Input() public solution:QuestSolution;
  @Output() public editing:EventEmitter<string> = new EventEmitter<string>();
  @Output() public viewing:EventEmitter<string> = new EventEmitter<string>();
  @Output() public evaluating:EventEmitter<string> = new EventEmitter<string>();

  public AvatarSize = AvatarSize; //https://github.com/angular/angular/issues/35363
  public AvatarType = AvatarType;

  constructor(
    protected playSustService:PlaySustService,
    protected rimaAAAService:RimaAAAService
  ) {
    let questSolutionId:string = "5";
    this.solution = this.playSustService.getQuestSolution(questSolutionId);
  }

  ngOnInit() {}

  edit():void{
    this.editing.emit(this.solution._id);
  }

  view():void{
    this.viewing.emit(this.solution._id);
  }

  get isModerator() {
    return this.rimaAAAService.isModerator();
  }

  evaluate():void{
    this.evaluating.emit(this.solution._id);
  }

  solutionCreator():Observable<KNode>{
    return this.playSustService.getSolutionCreator(this.solution._id);
  }
}
