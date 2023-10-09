import './App.css';

//loading bootstrap + bootswatch
import 'bootswatch/dist/sandstone/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.esm.js';

//loading components
import Menu from './components/Menu';

function App() {
  return (
    <div className="App">
      <Menu></Menu>
    </div>
  );
}

export default App;
