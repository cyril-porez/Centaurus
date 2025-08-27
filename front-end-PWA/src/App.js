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
    return isAuthenticated() ? children : <Navigate to="/auth/sign-in" />;
  }

  return (
    <div className="h-screen">
      <Header />
      <Router>
        <Routes>
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/horses/my-horse/my-horses"
            element={
              <PrivateRoute>
                <MyHorses />
              </PrivateRoute>
            }
          />
          <Route
            path="/horses/my-horse/add-horse"
            element={
              <PrivateRoute>
                <AddHorse />
              </PrivateRoute>
            }
          />
          <Route
            path="/horses/calculation/ChoiceHorse"
            element={
              <PrivateRoute>
                <ChoiceHorse />
              </PrivateRoute>
            }
          />
          <Route
            path="/horses/my-horse/update-horse/:id"
            element={
              <PrivateRoute>
                <UpdateHorse />
              </PrivateRoute>
            }
          />
          <Route
            path="/horses/follow/follow-weight"
            element={
              <PrivateRoute>
                <FollowWeight />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/profile"
            element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            }
          />
          <Route
            path="/horses/follow/evolution/weight/table/:id"
            element={
              <PrivateRoute>
                <WeightTable />
              </PrivateRoute>
            }
          />
          <Route
            path="/horses/follow/evolution/weight/graph/:id"
            element={
              <PrivateRoute>
                <WeightGraph />
              </PrivateRoute>
            }
          />
          <Route
            path="/horses/calculation/mensurations/:id"
            element={
              <PrivateRoute>
                <Mensurations />
              </PrivateRoute>
            }
          />
          <Route
            path="/horses/calculation/ResultWeight/:id"
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
