import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home, About, ContactUs, SignIn, SignUp, Error,Editor, Dashboard, Chatbot } from './Pages';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='' element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/editor/:meetingId" element={<Editor />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/chatbot/" element={<Chatbot/>} />
        <Route path="*" element={<Error />} />
      </Routes>

    </Router>
  );
};

export default App;
