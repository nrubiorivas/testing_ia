import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import { WorkoutProvider } from './app/WorkoutContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WorkoutProvider>
      <App />
    </WorkoutProvider>
  </React.StrictMode>
);
