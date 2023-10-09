import './App.css';

//loading router
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//loading bootstrap + bootswatch
import 'bootswatch/dist/sandstone/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.esm.js';

//loading components
import Menu from './components/Menu';
import Home from './components/screen/Home';
import BaseInformation from './components/screen/information/BaseInformation';
import DecorInformation from './components/screen/information/DecorInformation';
import JobInformation from './components/screen/information/JobInformation';
import VitalCalculator from './components/screen/calculator/VitalCalculator';
import GatheringCalculator from './components/screen/calculator/GatheringCalculator';
import SkillCalculator from './components/screen/calculator/SkillCalculator';
import Simulator from './components/screen/Simulator';
import Developer from './components/screen/Developer';

function App() {
  return (
    <div className="container-fluid mt-5 pt-4">
      <BrowserRouter>
        <Menu></Menu>
        <div className="row">
          <div className="offset-md-1 col-md-10">
            <Routes>
              <Route exact path="/" element={<Home />}></Route>
              <Route path="/information/base" element={<BaseInformation/>}></Route>
              <Route path="/information/decor" element={<DecorInformation/>}></Route>
              <Route path="/information/job" element={<JobInformation/>}></Route>
              <Route path="/calculator/vital" element={<VitalCalculator/>}></Route>
              <Route path="/calculator/gathering" element={<GatheringCalculator/>}></Route>
              <Route path="/calculator/skill" element={<SkillCalculator/>}></Route>
              <Route path="/simulator" element={<Simulator/>}></Route>
              <Route path="/developer" element={<Developer/>}></Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
