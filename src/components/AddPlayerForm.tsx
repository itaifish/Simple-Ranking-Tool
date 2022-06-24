import * as React from "react";
import { Stack, TextField } from "@mui/material";
import { useState } from "react";
import NewPlayerButton from "./NewPlayerButton";
import { playerManagerCtx } from "../App";

function AddPlayerForm() {
	const [value, setValue] = useState("");
	const playerManager = React.useContext(playerManagerCtx);
	return (
		<>
			<Stack direction={"row"}>
				<TextField
					id="outlined-basic"
					label="Player Name"
					variant="outlined"
					value={value}
					onChange={(event) => setValue(event.target.value)}
				/>
				<NewPlayerButton
					onClick={() => {
						if (value !== "") {
							playerManager.addNewPlayer(value);
							setValue("");
						}
					}}
				/>
			</Stack>
		</>
	);
}

export default AddPlayerForm;
