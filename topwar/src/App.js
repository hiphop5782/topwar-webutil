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
import JobInformation from '@src/components/screen/information/JobInformation';
import VitalCalculator from '@src/components/screen/calculator/VitalCalculator';
import GatheringCalculator from '@src/components/screen/calculator/GatheringCalculator';
import SkillCalculator from '@src/components/screen/calculator/SkillCalculator';
import RandomSimulator from '@src/components/screen/simulator/RandomSimulator';
import Developer from '@src/components/screen/Developer';
import { useRecoilState } from 'recoil';
import { counterState } from './recoil';
import HeroSimulator from '@src/components/screen/simulator/HeroSimulator';

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
              {/* <Route path="/information/hero" element={<HeroInformation/>}></Route> */}
              {/* <Route path="/information/decor" element={<DecorInformation/>}></Route> */}
              <Route path="/information/job" element={<JobInformation/>}></Route>
              <Route path="/calculator/vital" element={<VitalCalculator/>}></Route>
              <Route path="/calculator/gathering" element={<GatheringCalculator/>}></Route>
              <Route path="/calculator/skill" element={<SkillCalculator/>}></Route>
              <Route path="/simulator/random" element={<RandomSimulator/>}></Route>
              {/* <Route path="/simulator/hero" element={<HeroSimulator/>}></Route> */}
              <Route path="/developer" element={<Developer/>}></Route>
            </Routes>
          </div>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;
