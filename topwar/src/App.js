import './App.css';

//loading router
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';

//loading bootstrap + bootswatch
import 'bootswatch/dist/sandstone/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.esm.js';

//loading components
import Menu from '@src/components/Menu';
import Home from '@src/components/screen/Home';
import BaseInformation from '@src/components/screen/information/BaseInformation';
import DecorInformation from '@src/components/screen/information/DecorInformation';
import JobInformation from '@src/components/screen/information/JobInformation';
import VitalCalculator from '@src/components/screen/calculator/VitalCalculator';
import GatheringCalculator from '@src/components/screen/calculator/GatheringCalculator';
import SkillCalculator from '@src/components/screen/calculator/SkillCalculator';
import Simulator from '@src/components/screen/Simulator';
import Developer from '@src/components/screen/Developer';
import { useRecoilState } from 'recoil';
import { counterState } from './recoil';

function App() {
  const [count, setCount] = useRecoilState(counterState);

  document.title = "Topwar Helper";

  return (
    <div className="container-fluid mt-5 pt-4">
      <HashRouter>
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
      </HashRouter>
    </div>
  );
}

export default App;
