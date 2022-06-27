import { Autocomplete, TextField } from "@mui/material";
import React from "react";

interface ControlledAutocompleteProps {
	options: string[];
	label: string;
	onChange: (newValue: string) => void;
	value: string | null;
}

export function ControlledAutocomplete(props: ControlledAutocompleteProps) {
	const [inputValue, setInputValue] = React.useState("");

	return (
		<>
			<Autocomplete
				value={props.value}
				onChange={(event: any, newValue: string | null) => {
					props.onChange(newValue || "");
				}}
				inputValue={inputValue}
				onInputChange={(event, newInputValue) => {
					setInputValue(newInputValue);
				}}
				options={props.options}
				sx={{ width: 300 }}
				renderInput={(params) => (
					<TextField {...params} label={props.label} />
				)}
			/>
		</>
	);
}
