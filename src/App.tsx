import { Box } from "@mantine/core";
import React from "react";
import "./App.css";
import OptionA from "./OptionA";
import OptionB from "./OptionB";

function App() {
  return (
    <Box className="App">
      <OptionA />
      <OptionB />
    </Box>
  );
}

export default App;
