import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./Pages/Auth/SignIn";
import SignUp from "./Pages/Auth/SignUp";
import Home from "./Pages/Home/Home";
import AddHorse from "./Pages/Horses/MyHorse/AddHorse";
import Header from "./components/Header";
import ChoiceHorse from "./Pages/Horses/Calculation/ChoiceHorse";
import FollowWeight from "./Pages/Horses/Follow/FollowWeight";
import Account from "./Pages/Users/Account";
import UpdateHorse from "./Pages/Horses/MyHorse/UpdateHorse";
import WeightTable from "./Pages/Horses/Follow/EvolutionWeightTable";
import WeightGraph from "./Pages/Horses/Follow/EvolutionWeightGraph";
import Mensurations from "./Pages/Horses/Calculation/MensurationsHorse";
import MyHorses from "./Pages/Horses/MyHorse/MyHorses";
import ResultWeight from "./Pages/Horses/Calculation/ResultWeightHorse";

function App() {
  function isAuthenticated() {
    // Vérifier si le JWT existe dans le stockage local
    const token = localStorage.getItem("user");
    return Boolean(token); // retourne true si le token existe, sinon false
  }

  function PrivateRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/SignIn" />;
  }

  return (
    <div>
      <Header />
      <Router>
        <Routes>
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/MyHorses"
            element={
              <PrivateRoute>
                <MyHorses />
              </PrivateRoute>
            }
          />
          <Route
            path="/AddHorse"
            element={
              <PrivateRoute>
                <AddHorse />
              </PrivateRoute>
            }
          />
          <Route
            path="/ChoiceHorse"
            element={
              <PrivateRoute>
                <ChoiceHorse />
              </PrivateRoute>
            }
          />
          <Route
            path="/UpdateHorse/:id"
            element={
              <PrivateRoute>
                <UpdateHorse />
              </PrivateRoute>
            }
          />
          <Route
            path="/FollowWeight"
            element={
              <PrivateRoute>
                <FollowWeight />
              </PrivateRoute>
            }
          />
          <Route
            path="/Profile"
            element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            }
          />
          <Route
            path="/WeightTable/:id"
            element={
              <PrivateRoute>
                <WeightTable />
              </PrivateRoute>
            }
          />
          <Route
            path="/WeightGraph/:id"
            element={
              <PrivateRoute>
                <WeightGraph />
              </PrivateRoute>
            }
          />
          <Route
            path="/Mensurations/:id"
            element={
              <PrivateRoute>
                <Mensurations />
              </PrivateRoute>
            }
          />
          <Route
            path="/ResultWeight/:id"
            element={
              <PrivateRoute>
                <ResultWeight />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
