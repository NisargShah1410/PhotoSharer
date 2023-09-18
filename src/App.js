import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import AnimatedRoutes from './AnimatedRoutes';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;