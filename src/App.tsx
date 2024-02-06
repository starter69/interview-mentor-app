import React from "react";
import { Container } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

import ResponsiveAppBar from "./layout/ResponsiveAppBar";
import AppRoutes from "./routes";
import { SnackbarProvider } from "providers/SnackbarProvider";
import { ProfileProvider } from "providers/ProfileProvider";
import "./App.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <SnackbarProvider>
          <ProfileProvider>
            <>
              <header>
                <ResponsiveAppBar />
              </header>
              <main>
                <Container maxWidth="xl">
                  <AppRoutes />
                </Container>
              </main>
            </>
          </ProfileProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
