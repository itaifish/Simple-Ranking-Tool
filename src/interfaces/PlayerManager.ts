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
		const upsetMinimzation = this.getUpsetMinimizationRanking();
		const winMaximization = this.getWinMaximizationRanking();
		upsetMinimzation.sort((player1, player2) => player1.id - player2.id);
		winMaximization.sort((player1, player2) => player1.id - player2.id);
		return upsetMinimzation.map((player) => {
			return {
				...player,
				idir: winMaximization[player.id].mmr
			}
		});
	}

	onUpdate(callbackFunction: () => void) {
		this.on("update", callbackFunction);
	}

	clearOnUpdate(callbackFunction: () => void) {
		this.removeListener("update", callbackFunction);
	}

	getUpsetMinimizationRanking() {
		const rankings: { id: number }[] = [];
		const players = this.players.map((player, index) => {
			return { name: player.name, wins: player.wins, losses: player.losses, id: index }
		});
		while(players.length > 0) {
			players.sort((player1, player2) => {
				let diff =  player1.losses - player2.losses;
				if(diff != 0 ){
					return diff;
				}
				diff = player2.wins - player1.wins;
				if(diff != 0) {
					return diff;
				}
				const recordBetween = this.getRecordBetween(player1.id, player2.id);
				diff = recordBetween[1] - recordBetween[0];
				if(diff != 0) {
					return diff;
				}
				return player1.name.localeCompare(player2.name);

			});
			const bestPlayer = players.shift() as {
				name: string;
				wins: number;
				losses: number;
				id: number;
			};
			rankings.push({id: bestPlayer.id});
			players.forEach((playerToAdjustLosses) => {
				const recordBetween = this.getRecordBetween(playerToAdjustLosses.id, bestPlayer.id);
				playerToAdjustLosses.wins -= recordBetween[0];
				playerToAdjustLosses.losses -= recordBetween[1];
			})
		}
		return rankings.map((upset, index) => {
			const player = this.getPlayer(upset.id);
			return {
				player: player.name,
				ranking: index + 1,
				id: upset.id,
				record: `${player.wins}-${player.losses}`,
			};
		})
	}

	getWinMaximizationRanking() {
		const players = this.players.map((player, index) => {
			return { name: player.name, wins: player.wins, losses: player.losses, id: index }
		});
		const firstPassthrough =  players.sort((player1, player2) => {
			let diff: number = (player2.wins - player2.losses) - (player1.wins - player1.losses);
			if(diff != 0) {
				return diff;
			}
			const recordBetween = this.getRecordBetween(player1.id, player2.id);
			diff = recordBetween[1] - recordBetween[0];
			if(diff != 0) {
				return diff;
			}
			diff = ((player2.wins - player2.losses)/(player2.wins + player2.losses)) - ((player1.wins - player1.losses)/(player1.wins + player1.losses));
			if(diff != 0) {
				return diff;
			}
			return player1.name.localeCompare(player2.name);
		});
		const fptCopy = [...firstPassthrough];
		let eloPassthrough = firstPassthrough.map((player, rank) => {
			const mmr = 1500 - (100 * (rank - 1)/(players.length - 1));
			let expectedScore = 0;
			let actualScore = 0;
			fptCopy.forEach((otherPlayer, otherRank) => {
				if(player.id == otherPlayer.id) {
					return;
				}
				const otherMmr = 1500 - (100 * (otherRank - 1)/(players.length - 1));
				const recordBetween = this.getRecordBetween(player.id, otherPlayer.id);
				const gamesPlayed = recordBetween[0] + recordBetween[1];
				expectedScore += gamesPlayed * (1/(1 + (Math.pow(10, (otherMmr - mmr) / 400))));
				actualScore += recordBetween[0];
			});
			const newMmr = mmr + 1 * (actualScore - expectedScore);
			return {
				...player,
				mmr: newMmr,
			}
		});

		for(let i = 0; i < 3; i++) {
			const ept = [...eloPassthrough];
			eloPassthrough = eloPassthrough.map((player) => {
				let expectedScore = 0;
				let actualScore = 0;
				ept.forEach((otherPlayer) => {
					if(player.id == otherPlayer.id) {
						return;
					}
					const recordBetween = this.getRecordBetween(player.id, otherPlayer.id);
					const gamesPlayed = recordBetween[0] + recordBetween[1];
					expectedScore += gamesPlayed * (1/(1 + (Math.pow(10, (otherPlayer.mmr - player.mmr) / 400))));
					actualScore += recordBetween[0];
				});
				const newMmr = player.mmr + 1 * (actualScore - expectedScore);
				return {
					...player,
					mmr: newMmr,
				}
			});
		}

		return eloPassthrough.map((player) => {
			return {
				player: player.name,
				mmr: player.mmr,
				id: player.id,
				record: `${player.wins}-${player.losses}`,
			};
		});
	}
}
