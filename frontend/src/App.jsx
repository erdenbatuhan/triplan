import * as React from 'react';
// import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import './App.css';
// import TripPlanningCard from './components/card-item';
import TripPlanningList from './components/list';

function App() {
  return (
    <div className="App">
      {/* <TripPlanningCard
        content="Good place to chill in summer."
        title="English Garden"
        type="place"
      /> */}
      <TripPlanningList />
    </div>
  );
}

export default App;
