import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import SignUp from "./pages/SignUp.js";
import CreateStudyList from "./pages/CreateStudyList.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact  path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/create-study-list" element={<CreateStudyList />} />
      </Routes>
    </Router>
  );
}

export default App;
