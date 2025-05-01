import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import StatisticQuestions from './pages/Statistic_questions'
import OverviewQuestions from "./pages/Overview_questions";
import SelectSubject from './pages/Select_subject';
import DetailedQuestions from './pages/Detailed_questions';
import EndingScreen from './pages/Ending_screen';
import './styles/App.css'

function App() {
  return (
    <Router>
      <div className="root">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Statistic_questions" element={<StatisticQuestions />} />
          <Route path="/Overview_questions" element={<OverviewQuestions />} />
          <Route path="/Select_subject" element={<SelectSubject />} />
          <Route path="/Detailed_questions" element={<DetailedQuestions />} />
          <Route path="/Ending_screen" element={<EndingScreen />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
