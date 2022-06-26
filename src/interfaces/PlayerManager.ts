import { EventEmitter } from "events";

export type RecordBetween = [number, number];
export type RecordResult = Array<Array<RecordBetween>>;
interface Player {
	name: string;
	wins: number;
	losses: number;
}

export class PlayerManager extends EventEmitter {
	private players: Player[];
	private record: RecordResult;

	constructor() {
		super();
		this.players = [];
		this.record = [[]];
	}

	getPlayerId(playerName: string) {
		return this.players.findIndex(player => player.name === playerName);
	}

	getPlayer(playerId: number) {
		return this.players[playerId];
	}

	getPlayers() {
		return this.players;
	}

	getRecordBetween(player1: number, player2: number): RecordBetween {
		return this.record[player1][player2];
	}

	setRecordBetween(
		player1: number,
		player2: number,
		recordBetween: RecordBetween
	) {
		const oldRecord = this.getRecordBetween(player1, player2);
		this.record[player1][player2] = [...recordBetween];
		this.record[player2][player1] = [recordBetween[1], recordBetween[0]];
		this.players[player1].wins += recordBetween[0] - oldRecord[0];
		this.players[player1].losses += recordBetween[1] - oldRecord[1];
		this.players[player2].wins += recordBetween[1] - oldRecord[1];
		this.players[player2].losses += recordBetween[0] - oldRecord[0];
		this.emit("update");
		return this.record;
	}

	addNewPlayer(playerName: string) {
		const newRecordArr: RecordBetween[] = [];
		this.record.forEach((recordLine) => {
			recordLine.push([0, 0]);
			newRecordArr.push([0, 0]);
		});
		this.record.push(newRecordArr);
		this.players.push({ name: playerName, wins: 0, losses: 0 });
		this.emit("update");
		return this.record.length;
	}

	removePlayer(player: number | string) {
		let playerId: number;
		if (typeof player === "string") {
			playerId = this.players.findIndex((element) => element.name === player);
		} else {
			playerId = player;
		}
		if (playerId < 0 || playerId > this.record.length) {
			return;
		}
		this.players.forEach((_player, index) => {
			this.setRecordBetween(playerId, index, [0, 0]);
		});
		this.players.splice(playerId, 1);
		let hasDeleted = false;
		for (let i = 0; i < this.record.length; i++) {
			if (i === playerId && !hasDeleted) {
				this.record.splice(playerId, 1);
				i--;
				hasDeleted = true;
				continue;
			}
			this.record[i].splice(playerId, 1);
		}
		this.emit("update");
	}

	getPlayerRankings() {
		return this.players.map((player, index) => {
			return {
				player: player.name,
				ranking: index + 1,
				id: index,
				record: `${player.wins}-${player.losses}`,
			};
		});
	}

	onUpdate(callbackFunction: () => void) {
		this.on("update", callbackFunction);
	}

	clearOnUpdate(callbackFunction: () => void) {
		this.removeListener("update", callbackFunction);
	}

	getUpsetMinimizationRanking() {
		// TODO
	}
}
