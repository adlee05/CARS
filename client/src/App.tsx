import "./styles/App.css";
import Login from "./components/login/Login";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Login />
      </ThemeProvider>
    </>
  );
}

export default App;
