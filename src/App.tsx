import { Route, Routes } from "react-router-dom";
import { HomeScreen } from "./pages/HomeScreen";
import { StartLearningScreen } from "./pages/StartLearningScreen";
import { AddCardScreen } from "./pages/AddCardScreen";
import { ViewCardsScreen } from "./pages/ViewCardsScreen";
import { LearnScreen } from "./pages/LearnScreen";
import { ViewAllCardsScreen } from "./pages/ViewAllCardsScreen";
import { SignUpScreen } from "./pages/SignUpScreen";
import { LoadingDataScreen } from "./pages/LoadingDataScreen";
import { SignInScreen } from "./pages/SignInScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoadingDataScreen />} />
      <Route path="/sign-up" element={<SignUpScreen />} />
      <Route path="/sign-in" element={<SignInScreen />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route
        path="/start-learning"
        element={<StartLearningScreen />}
      />
      <Route path="/start-learning/words" element={<LearnScreen />} />
      <Route path="/add-card" element={<AddCardScreen />} />
      <Route
        path="/view-all-cards"
        element={<ViewAllCardsScreen />}
      />
      <Route
        path="/view-all-cards/view-cards"
        element={<ViewCardsScreen />}
      />
    </Routes>
  );
}

export default App;
