import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import SignUp from "./pages/SignUp.js";
import CreateStudyList from "./pages/CreateStudyList.js";
import TermsOfService from "./pages/TermsOfService.js";
import Contact from "./pages/Contact.js";
import Privacy from "./pages/Privacy.js";
import AppWrapper from "./components/AppWrapper.js";

function App() {
  return (
    <AppWrapper>
      <Router>
        <Routes>
          <Route exact  path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/create-study-list" element={<CreateStudyList />} />
          <Route exact path="/privacy" element={<Privacy />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/termsofservice" element={<TermsOfService />} />
        </Routes>
      </Router>
    </AppWrapper>
  );
}

export default App;
