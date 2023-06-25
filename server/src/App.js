import {VendorUI} from './components/vendor.jsx'
import { AuthorityUI } from './components/authority.jsx';
import {useState, useEffect} from 'react'
import './App.css';

function App() {
  const [toggleView, setToggleView] = useState(true);

  const changeView = () => {
    setToggleView(!toggleView);
  }

  return (
    <div className="App">
      <button onClick={changeView}>Switch View</button>
      {
        toggleView ? <VendorUI/> : <AuthorityUI/>
      }
    </div>
  );
}

export default App;
