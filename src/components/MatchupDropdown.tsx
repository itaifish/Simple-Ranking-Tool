import { Button, FormGroup, Stack, TextField } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { playerManagerCtx } from "../App";
import { ControlledAutocomplete } from "./ControlledAutocomplete";

type strull = string | null;

function MatchupDropdown() {
	const [players, setPlayers] = React.useState<[strull, strull]>([
		null,
		null,
	]);
	const [score, setScore] = React.useState<[number, number]>([0, 0]);

	const playerManager = useContext(playerManagerCtx);

	const [allPlayers, setAllPlayers] = React.useState(
		playerManager.getPlayers()
	);

	const callbackFunc = () => {
		setAllPlayers([...playerManager.getPlayers()]);
	};

	useEffect(() => {
		playerManager.onUpdate(callbackFunc);
		return () => {
			playerManager.clearOnUpdate(callbackFunc);
		};
	}, []);
	return (
		<FormGroup>
			<Stack direction={"row"}>
				<ControlledAutocomplete
					value={players[0]}
					label="Player 1"
					onChange={(newValue) => {
						setPlayers((oldPlayers) => {
							return [newValue, oldPlayers[1]];
						});
					}}
					options={allPlayers
						.filter((player) => player.name != players[1])
						.map((player) => player.name)}
				/>
				<TextField
					id="outlined-number"
					label="Wins"
					type="number"
					value={score[0]}
					onChange={(e) => {
						setScore([+e.target.value, score[1]]);
					}}
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</Stack>
			<Stack direction={"row"}>
				<ControlledAutocomplete
					value={players[1]}
					label="Player 2"
					onChange={(newValue) => {
						setPlayers((oldPlayers) => {
							return [oldPlayers[0], newValue];
						});
					}}
					options={allPlayers
						.filter((player) => player.name != players[0])
						.map((player) => player.name)}
				/>
				<TextField
					label="Wins"
					type="number"
					value={score[1]}
					onChange={(e) => {
						setScore([score[0], +e.target.value]);
					}}
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</Stack>
			<Button
				onClick={() => {
					if (players[0] && players[1]) {
						const [p1, p2] = [
							playerManager.getPlayerId(players[0]),
							playerManager.getPlayerId(players[1]),
						];
						if (p1 >= 0 && p2 >= 0) {
							playerManager.setRecordBetween(p1, p2, score);
							setPlayers([null, null]);
							setScore([0, 0]);
						}
					}
				}}
			>
				Save
			</Button>
		</FormGroup>
	);
}

export default MatchupDropdown;
