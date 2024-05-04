import { MODULE_NAME } from "./params";
import { RimaAAAService } from "@colabo-rima/i-aaa";
import { Injectable, Inject } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";

import * as config from "@colabo-utils/i-config";

import { KNodeFrontend as KNode } from "@colabo-knalledge/f-core/vos";
import { KnalledgeNodeService } from "@colabo-knalledge/f-store_core";

import { QuestPuzzle } from "./vos/questPuzzle";

// import { KnalledgeMapPolicyService } from "@colabo-knalledge/f-view_enginee";
// import { GlobalEmittersArrayService } from "@colabo-puzzles/f-core/code/puzzles/globalEmitterServicesArray";
// import {Change, ChangeType, Domain, Event} from '@colabo-flow/f-change';
// import { CollaboGrammarService } from "@colabo-flow/f-core";
import { UtilsNotificationService, NotificationMsgType, NotificationMsg } from "@colabo-utils/f-notifications";
import { QuestSolution } from "./vos/questSolution";
import { QuestChallenge } from "./vos/questChallenge";
import { SkillCard } from "./vos/skillCard";
import { QuestPuzzleShowComponent } from "./quest-puzzle-show-component/quest-puzzle-show.component";

import { Request, RequestStatus } from "@colabo-knalledge/f-core";

@Injectable()
export class PlaySustService {
	protected static mapId: string = config.GetString("mapId");
	protected solutions: Request<QuestSolution> = new Request();
	protected challenges: Request<QuestChallenge> = new Request();
	protected skills: Request<SkillCard> = new Request();
	protected puzzles: Request<QuestPuzzle> = new Request();
	/**
	 * Service constructor
	 * @constructor
	 */
	constructor(
		// private knalledgeMapPolicyService: KnalledgeMapPolicyService,
		// private collaboGrammarService: CollaboGrammarService,
		// private globalEmittersArrayService: GlobalEmittersArrayService,
		private rimaAAAService: RimaAAAService,
		protected utilsNotificationService: UtilsNotificationService, // TODO: private knAllEdgeRealTimeService: KnAllEdgeRealTimeService,
		private knalledgeNodeService: KnalledgeNodeService
	) {
		// this.globalEmittersArrayService.register(
		//   this.showSubComponentInBottomPanelEvent
		// );
	}

	getQuestPuzle(puzzleId: string): QuestPuzzle {
		for (let i: number = 0; i < this.puzzles.data.length; i++) {
			if (this.puzzles.data[i]._id == puzzleId) {
				return this.puzzles.data[i];
			}
		}
		return null;
		// this.puzzles.data.find((puzzle:QuestPuzzle) => puzzle._id === puzzleId);
	}

	protected getQuestPuzleMockup(): QuestPuzzle {
		const questPuzzle = new QuestPuzzle();
		questPuzzle.challenge.title = "Flying Toilets";
		questPuzzle.challenge.description = "In Kinshasa, a city of 10 million with no sewage system, slum residents make “flying toilets” by throwing shit-filled plastic bags onto the top of the nearest roof—a less than ideal arrangement, since many must also sleep on the nearest roof.";
		questPuzzle.challenge.image = "flying-toilet.jpg";
		questPuzzle.skillCards[0].title = "Culture for Sustainability";
		questPuzzle.skillCards[0].description =
			"Culture encompasses the social behavior and norms found in human societies, as well as the knowledge, beliefs, arts, laws, customs, capabilities and habits of the individuals in these groups. The concept of material culture covers the physical expressions of culture, such as technology, architecture and art, whereas the immaterial aspects of culture such as principles of social organization (including practices of political organization and social institutions), mythology, philosophy, literature (both written and oral), and science comprise the intangible cultural heritage of a society.";
		questPuzzle.skillCards[0].image = "culture.jpg";
		questPuzzle.questions = ["What is your opinion on culture vs economy influence on this issue?", "Can solving of this challenge be economically sustainable?"];
		return questPuzzle;
	}

	public saveQuestSolution(solution: QuestSolution, isEditing: boolean = false): Observable<QuestSolution> {
		console.log("saveQuestSolution:", solution);
		const solutionNode: KNode = new KNode();
		this.solution2Node(solution, solutionNode);

		if (isEditing) {
			solutionNode.state = KNode.STATE_SYNCED; //to avoid the `knalledgeNodeService` error of the KNode not being saved/created prior updating
			return this.knalledgeNodeService.update(solutionNode, KNode.UPDATE_TYPE_ALL).pipe(
				map((solutionNode) => this.node2Solution(solutionNode)),
				tap((solutionNode) => this.getQuestSolution(solutionNode._id).deserialize(solutionNode))
			);
		} else {
			delete solutionNode._id;
			return this.knalledgeNodeService.create(solutionNode).pipe(
				map((solutionNode) => this.node2Solution(solutionNode)),
				tap((solutionNode) => this.solutions.data.push(solutionNode))
			);
		}
	}

	saveQuestPuzzle(puzzle: QuestPuzzle, isEditing: boolean = false): Observable<QuestPuzzle> {
		console.log("saveQuestPuzzle:", puzzle);
		const puzzleNode: KNode = new KNode();
		this.puzzle2Node(puzzle, puzzleNode);

		// console.log("[saveQuestPuzzle] puzzleNode:", puzzleNode);
		if (isEditing) {
			puzzleNode.state = KNode.STATE_SYNCED; //to avoid the `knalledgeNodeService` error of the KNode not being saved/created prior updating
			return this.knalledgeNodeService.update(puzzleNode, KNode.UPDATE_TYPE_ALL).pipe(map((puzzleNode) => this.node2Puzzle(puzzleNode)));
		} else {
			delete puzzleNode._id;
			return this.knalledgeNodeService.create(puzzleNode).pipe(map((puzzleNode) => this.node2Puzzle(puzzleNode)));
		}
	}

	puzzle2Node(puzzle: QuestPuzzle, puzzleNode: KNode): KNode {
		puzzleNode.dataContent = puzzle.serialize();
		puzzleNode.type = QuestPuzzle.TYPE;
		puzzleNode.name = "Puzzle " + puzzle.humanID; //TODO: to see if we want this in a different way
		puzzleNode.mapId = PlaySustService.mapId;
		puzzleNode._id = puzzle._id;
		puzzleNode.iAmId = this.rimaAAAService.getUserId();
		return puzzleNode;
	}

	saveQuestChallenge(challenge: QuestChallenge, isEditing: boolean = false): Observable<QuestChallenge> {
		console.log("saveQuestChallenge:", challenge);
		const challengeNode: KNode = new KNode();
		this.challenge2Node(challenge, challengeNode);
		// console.log("[saveQuestChallenge] challengeNode:", challengeNode);
		if (isEditing) {
			challengeNode.state = KNode.STATE_SYNCED; //to avoid the `knalledgeNodeService` error of the KNode not being saved/created prior updating
			return this.knalledgeNodeService.update(challengeNode, KNode.UPDATE_TYPE_ALL).pipe(map((challengeNode) => this.node2Challenge(challengeNode)));
		} else {
			delete challengeNode._id;
			return this.knalledgeNodeService.create(challengeNode).pipe(map((challengeNode) => this.node2Challenge(challengeNode)));
		}
	}

	saveQuestSkill(skill: SkillCard, isEditing: boolean = false): Observable<SkillCard> {
		console.log("saveQuestSkill:", skill);
		const skillNode: KNode = new KNode();
		this.skill2Node(skill, skillNode);
		if (isEditing) {
			skillNode.state = KNode.STATE_SYNCED; //to avoid the `knalledgeNodeService` error of the KNode not being saved/created prior updating
			return this.knalledgeNodeService.update(skillNode, KNode.UPDATE_TYPE_ALL).pipe(map((skillNode) => this.node2Skill(skillNode)));
		}
		{
			delete skillNode._id;
			// console.log("[saveQuestSkill] challengeNode:", skillNode);
			return this.knalledgeNodeService.create(skillNode).pipe(map((skillNode) => this.node2Skill(skillNode)));
		}
	}

	/**
	 * returns the quest solution
	 * @param solutionId id of the quest solution we are asking for
	 */
	getQuestSolution(solutionId: string): QuestSolution {
		return this.solutions.data.find((solution: QuestSolution) => solution._id === solutionId);
		// return this.getQuestSolutionMockup(); //TODO: make getting real solutions
	}

	getQuestSolutionMockup(): QuestSolution {
		const solution: QuestSolution = new QuestSolution();
		solution.title = "toilet pipes";
		solution.description = "provide toilet pipes outside each building";

		solution.environmentImpact = 3;
		solution.economyImpact = 1;
		solution.cultureImpact = -2;
		solution.societyImpact = 2;

		return solution;
	}

	/**
	 * @description WARNING! expects that `challenges` and `skills` are already loaded! Explained further in the #556
	 */
	getQuestPuzzles(forceRefresh: boolean = false): Observable<QuestPuzzle[]> {
		if (forceRefresh || this.puzzles.status !== RequestStatus.RECEIVED) {
			if (this.puzzles.status !== RequestStatus.PENDING) {
				this.puzzles.status = RequestStatus.PENDING;
				this.puzzles.response = this.knalledgeNodeService.queryInMapofType(PlaySustService.mapId, QuestPuzzle.TYPE).pipe(
					map((nodes) => this.nodes2Puzzles(nodes)),
					tap(() => (this.puzzles.status = RequestStatus.RECEIVED)),
					tap((nodes) => this.puzzlesReceived(nodes))
				);
			}
			return this.puzzles.response;
		} else {
			return of(this.puzzles.data);
		}
	}

	public node2Puzzle(node: KNode): QuestPuzzle {
		const puzzle: QuestPuzzle = new QuestPuzzle();
		if (node) {
			puzzle.deserialize(node.dataContent);
			puzzle._id = node._id;
			puzzle.challenge = this.getQuestChallenge(puzzle.challenge._id);
			for (let i: number = 0; i < puzzle.skillCards.length; i++) {
				puzzle.skillCards[i] = this.getQuestSkill(puzzle.skillCards[i]._id);
			}
		}
		return puzzle;
	}

	nodes2Puzzles(nodes: KNode[]): QuestPuzzle[] {
		const puzzles: QuestPuzzle[] = [];
		if (nodes) {
			for (let i: number = 0; i < nodes.length; i++) {
				puzzles.push(this.node2Puzzle(nodes[i]));
			}
		}
		return puzzles;
	}

	protected puzzlesReceived(puzzles: QuestPuzzle[]): void {
		this.puzzles.data = puzzles;
	}

	/**
	 * returns the quest challenge
	 * WARNING! So far is expected that the challenges are preloaded in the service
	 * @param challengeId id of the quest challenge we are asking for
	 */
	getQuestChallenge(challengeId: string): QuestChallenge {
		return this.challenges.data.find((challenge: QuestChallenge) => challenge._id === challengeId);
	}

	/**
	 * returns the quest Skill
	 * @param skillId id of the quest Skill we are asking for
	 */
	getQuestSkill(skillId: string): SkillCard {
		return this.skills.data.find((skill: SkillCard) => skill._id === skillId);
	}

	getQuestChallengeMockup(challengeId: string = null): QuestChallenge {
		const challenge: QuestChallenge = new QuestChallenge();
		challenge.title = "toilet pipes";
		challenge.description = "provide toilet pipes outside each building";

		challenge.image = "https://colabo.space/data/images/logos/colabo-logo-with-url.png";

		return challenge;
	}

	getQuestChallenges(forceRefresh: boolean = false): Observable<QuestChallenge[]> {
		if (forceRefresh || this.challenges.status !== RequestStatus.RECEIVED) {
			if (this.challenges.status !== RequestStatus.PENDING) {
				this.challenges.status = RequestStatus.PENDING;
				this.challenges.response = this.knalledgeNodeService.queryInMapofType(PlaySustService.mapId, QuestChallenge.TYPE).pipe(
					map((nodes) => this.nodes2Challenges(nodes)),
					tap(() => (this.challenges.status = RequestStatus.RECEIVED)),
					tap((nodes) => this.challengesReceived(nodes))
				);
			}
			return this.challenges.response;
		} else {
			return of(this.challenges.data);
		}
	}

	public node2Challenge(node: KNode): QuestChallenge {
		const challenge: QuestChallenge = new QuestChallenge();
		if (node) {
			challenge.deserialize(node.dataContent);
			challenge._id = node._id;
		}
		return challenge;
	}

	nodes2Challenges(nodes: KNode[]): QuestChallenge[] {
		const challenges: QuestChallenge[] = [];
		if (nodes) {
			for (let i: number = 0; i < nodes.length; i++) {
				challenges.push(this.node2Challenge(nodes[i]));
			}
		}
		return challenges;
	}

	protected challengesReceived(challenges: QuestChallenge[]): void {
		this.challenges.data = challenges;
	}

	challenge2Node(challenge: QuestChallenge, challengeNode: KNode): KNode {
		challengeNode.dataContent = challenge.serialize();
		challengeNode.type = QuestChallenge.TYPE;
		challengeNode.name = challenge.title;
		challengeNode.mapId = PlaySustService.mapId;
		challengeNode._id = challenge._id;
		challengeNode.iAmId = this.rimaAAAService.getUserId();
		return challengeNode;
	}

	getSolutions(forceRefresh: boolean = false): Observable<QuestSolution[]> {
		if (forceRefresh || this.solutions.status !== RequestStatus.RECEIVED) {
			if (this.solutions.status !== RequestStatus.PENDING) {
				this.solutions.status = RequestStatus.PENDING;
				this.solutions.response = this.knalledgeNodeService.queryInMapofType(PlaySustService.mapId, QuestSolution.TYPE).pipe(
					map((nodes) => this.nodes2Solutions(nodes)),
					tap(() => (this.solutions.status = RequestStatus.RECEIVED)),
					tap((nodes) => this.solutionsReceived(nodes))
				);
			}
			return this.solutions.response;
		} else {
			return of(this.solutions.data);
		}
	}

	public node2Solution(node: KNode): QuestSolution {
		const solution: QuestSolution = new QuestSolution();
		if (node) {
			solution.deserialize(node.dataContent);
			solution._id = node._id;
		}
		return solution;
	}

	nodes2Solutions(nodes: KNode[]): QuestSolution[] {
		const solutions: QuestSolution[] = [];
		if (nodes) {
			for (let i: number = 0; i < nodes.length; i++) {
				solutions.push(this.node2Solution(nodes[i]));
			}
		}
		return solutions;
	}

	solution2Node(solution: QuestSolution, solutionNode: KNode): KNode {
		solutionNode.dataContent = solution.serialize();
		solutionNode.type = QuestSolution.TYPE;
		solutionNode.name = solution.title;
		solutionNode.mapId = PlaySustService.mapId;
		solutionNode._id = solution._id;
		solutionNode.iAmId = this.rimaAAAService.getUserId();
		return solutionNode;
	}

	getSolutionCreator(solutionId: string): Observable<KNode> {
		// TODO: this.knalledgeNodeService.getById(solutionId).pipe(
		//   (solution:KNode) => {
		//     this.rimaAAAService.getOUserId();
		//   }
		// )
		return of(null);
	}

	getQuestSkills(forceRefresh: boolean = false): Observable<SkillCard[]> {
		if (forceRefresh || this.skills.status !== RequestStatus.RECEIVED) {
			if (this.skills.status !== RequestStatus.PENDING) {
				this.skills.status = RequestStatus.PENDING;
				this.skills.response = this.knalledgeNodeService.queryInMapofType(PlaySustService.mapId, SkillCard.TYPE).pipe(
					map((nodes) => this.nodes2Skills(nodes)),
					tap(() => (this.skills.status = RequestStatus.RECEIVED)),
					tap((nodes) => this.skillsReceived(nodes))
				);
			}
			return this.skills.response;
		} else {
			return of(this.skills.data);
		}
	}

	public node2Skill(node: KNode): SkillCard {
		const skill: SkillCard = new SkillCard();
		if (node) {
			skill.deserialize(node.dataContent);
			skill._id = node._id;
		}
		return skill;
	}

	nodes2Skills(nodes: KNode[]): SkillCard[] {
		const skills: SkillCard[] = [];
		if (nodes) {
			for (let i: number = 0; i < nodes.length; i++) {
				skills.push(this.node2Skill(nodes[i]));
			}
		}
		return skills;
	}

	protected skillsReceived(skills: SkillCard[]): void {
		this.skills.data = skills;
	}

	skill2Node(skill: SkillCard, skillNode: KNode): KNode {
		skillNode.dataContent = skill.serialize();
		skillNode.type = SkillCard.TYPE;
		skillNode.name = skill.title;
		skillNode.mapId = PlaySustService.mapId;
		skillNode._id = skill._id;
		skillNode.iAmId = this.rimaAAAService.getUserId();
		return skillNode;
	}

	protected solutionsReceived(solutions: QuestSolution[]): void {
		this.solutions.data = solutions;
	}
}
