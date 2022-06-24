import React, { createContext } from "react";
import "./App.css";
import { Container } from "@mui/material";
import { PlayerManager } from "./interfaces/PlayerManager";
import AddPlayerForm from "./components/AddPlayerForm";
import PlayerView from "./components/PlayerView";

const playerManager = new PlayerManager();
export const playerManagerCtx = createContext<PlayerManager>(playerManager);

function App() {
	return (
		<>
			<playerManagerCtx.Provider value={playerManager}>
				<Container>
					<AddPlayerForm />
					<PlayerView />
				</Container>
			</playerManagerCtx.Provider>
		</>
	);
}

export default App;
