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
import { useAuth } from "./contexts/AuthContext";

function App() {
  // function isAuthenticated() {
  //   // Vérifier si le JWT existe dans le stockage local
  //   const token = localStorage.getItem("user");
  //   return Boolean(token); // retourne true si le token existe, sinon false
  // }

  // function PrivateRoute({ children }) {
  //   return isAuthenticated() ? children : <Navigate to="/auth/sign-in" />;
  // }

  function ProtectedRoute({ children }) {
    const { isAuthenticated, initializing } = useAuth(); // 👈 depuis le Context
    if (initializing) return null; // ou un petit loader
    return isAuthenticated ? children : <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <div className="h-screen">
      <Header />

      <Routes>
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/horses/my-horse/my-horses"
          element={
            <ProtectedRoute>
              <MyHorses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/horses/my-horse/add-horse"
          element={
            <ProtectedRoute>
              <AddHorse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/horses/calculation/ChoiceHorse"
          element={
            <ProtectedRoute>
              <ChoiceHorse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/horses/my-horse/update-horse/:id"
          element={
            <ProtectedRoute>
              <UpdateHorse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/horses/follow/follow-weight"
          element={
            <ProtectedRoute>
              <FollowWeight />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/profile"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/horses/follow/evolution/weight/table/:id"
          element={
            <ProtectedRoute>
              <WeightTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/horses/follow/evolution/weight/graph/:id"
          element={
            <ProtectedRoute>
              <WeightGraph />
            </ProtectedRoute>
          }
        />
        <Route
          path="/horses/calculation/mensurations/:id"
          element={
            <ProtectedRoute>
              <Mensurations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/horses/calculation/ResultWeight/:id"
          element={
            <ProtectedRoute>
              <ResultWeight />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
