import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from './components/authentication/Login';
import Register from './components/authentication/Registration';
import HomePage from "./components/HomePage";
import CreateGroup from "./components/CreateGroup";
import ViewGroup from "./components/ViewGroup";
import CreateInvite from "./components/CreateInvite";
import ViewInvite from "./components/ViewInvite";


function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateGroup />} />
        <Route path="/view" element={<ViewGroup />} />
        <Route path="/invite" element={<CreateInvite />} />
        <Route path="/viewinvite" element={<ViewInvite />} />
      </Routes>
      </AnimatePresence>
  );
}

export default AnimatedRoutes;