import React from "react";
import { Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function NewPlayerButton(props: { onClick: () => void }) {
	return (
		<Button
			variant="outlined"
			startIcon={<AddCircleIcon />}
			onClick={props.onClick}
		>
			Add
		</Button>
	);
}

export default NewPlayerButton;
