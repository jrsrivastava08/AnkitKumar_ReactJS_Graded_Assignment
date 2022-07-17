import React from 'react'; 
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MoviesPane from './components/MoviesPane';
import ToastMessage from './components/ToastMessage';



function App() {
  return (
    <div className="App">

      <MoviesPane/>
    </div>
  );
}

export default App;
