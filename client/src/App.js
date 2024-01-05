import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
