console.log("STARTING TEST: QUEST-SOLUTION!");

// import {globalSet} from '../config/global-testing';

// "../../../dev_puzzles/playsust/core/lib/questSolution-show-component/questSolution-show.component._spec.ts",

import { } from 'jasmine'; //https://stackoverflow.com/questions/45431458/typescript-errors-in-spec-files-in-visual-studio-web-application
import { TestBed, async } from '@angular/core/testing';
import { QuestPuzzleShowComponent } from './quest-puzzle-show.component';

import { RouterTestingModule } from '@angular/router/testing';
import { PlaySustService } from "../playsust.service";

let playSustServiceSpy: jasmine.SpyObj<PlaySustService>;

import { GetPuzzle, GetGeneral } from "@colabo-utils/i-config";

describe('QuestPuzzleShowComponent', () => {
  beforeEach(async(() => {
    // create `getQuestSolution` spy on an object representing the PlaySustService
    const _playSustServiceSpy =
      jasmine.createSpyObj('PlaySustService', ['getQuestSolution']);

    TestBed.configureTestingModule({
      declarations: [
        QuestPuzzleShowComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
       {provide: PlaySustService, useValue: _playSustServiceSpy }
      ]
    }).compileComponents();
    // Inject services (that is what they say in testing tutorial, I think it is unecessary, only for accessing spyies it makes sense)
    playSustServiceSpy = TestBed.get(PlaySustService);
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(QuestPuzzleShowComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should call PlaySustService', async(() => {
    let branding:any = GetGeneral("branding");
    const stubValue = 'stub value';
    const fixture = TestBed.createComponent(QuestPuzzleShowComponent);
    const app = fixture.debugElement.componentInstance;
    expect(playSustServiceSpy.getQuestSolution.calls.count())
      .toBe(1, 'spy method was called once');
    // expect(playSustServiceSpy.getQuestSolution.calls.argsFor(0))
    //   .toEqual(
    //     [ // list of parameters for the 0th call
    //       {
    //     type: NotificationMsgType.Info,
    //     title: branding.title,
    //     msg: "starting ..."
    //   }]);
  }));
});
