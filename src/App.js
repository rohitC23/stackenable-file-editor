import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Editor from './Editor';
import FileUpload from './FileUpload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="/file-upload" element={<FileUpload />} />
      </Routes>
    </Router>
  );
}

export default App;