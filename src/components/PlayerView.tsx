import React, { useEffect } from "react";
import { playerManagerCtx } from "../App";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IconButton from "@mui/material/IconButton";

function PlayerView() {
	const playerManager = React.useContext(playerManagerCtx);

	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", width: 50 },
		{ field: "player", headerName: "Player", width: 130 },
		{ field: "ranking", headerName: "Ranking", width: 70 },
		{ field: "record", headerName: "Record", width: 70 },
		{
			field: "action",
			headerName: "",
			renderCell: (params) => {
				return (
					<IconButton
						onClick={() => {
							playerManager.removePlayer(params.row.id);
						}}
						color={"error"}
					>
						<DeleteForeverIcon />
					</IconButton>
				);
			},
		},
	];

	const [playersRanked, setPlayersRanked] = React.useState(
		playerManager.getPlayerRankings()
	);
	const callbackFunc = () => {
		setPlayersRanked([...playerManager.getPlayerRankings()]);
	};
	useEffect(() => {
		playerManager.onUpdate(callbackFunc);
		return () => {
			playerManager.clearOnUpdate(callbackFunc);
		};
	});
	return (
		<>
			<div style={{ height: 400, width: "400px" }}>
				<DataGrid
					rows={playersRanked}
					columns={columns}
					pageSize={5}
					rowsPerPageOptions={[5]}
				/>
			</div>
		</>
	);
}

export default PlayerView;
