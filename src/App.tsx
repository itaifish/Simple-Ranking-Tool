import React, { createContext } from "react";
import "./App.css";
import { Container, Stack } from "@mui/material";
import { PlayerManager } from "./interfaces/PlayerManager";
import AddPlayerForm from "./components/AddPlayerForm";
import PlayerView from "./components/PlayerView";
import MatchupDropdown from "./components/MatchupDropdown";

const playerManager = new PlayerManager();
export const playerManagerCtx = createContext<PlayerManager>(playerManager);

function App() {
	return (
		<>
			<playerManagerCtx.Provider value={playerManager}>
				<Container>
					<Stack direction={"row"}>
						<Stack direction={"column"}>
							<AddPlayerForm />
							<PlayerView />
						</Stack>
						<MatchupDropdown />
					</Stack>
				</Container>
			</playerManagerCtx.Provider>
		</>
	);
}

export default App;
