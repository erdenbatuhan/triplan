import * as React from 'react';
// import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import './App.css';
import BasicCard from './components/card-item';

function App() {
  // const c = <BasicCard />;

  // const p = React.cloneElement(c, {
  //   content: 'Good place to chill in summer.',
  //   title: 'English Garden'
  // });
  return (
    <div className="App">
      <BasicCard content="Good place to chill in summer." title="English Garden" type="place" />
    </div>
  );
}

export default App;
