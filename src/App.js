import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodaySales from './components/Dashboard1/TodaySales';
import DateComparison from './components/Dashboard2/DateComparison';
import NoPage from './components/NoPage/NoPage';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<TodaySales />} />
          <Route path="/comparison" element={<DateComparison />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
