import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import ItemPage from './components/ItemPage';
import {auth} from './config/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import LoginPage from './components/LoginPage';

const App: React.FC = () => {

  const[user] = useAuthState(auth);


  return (
    <Router>
      <Routes>
        {user ? (
          <Fragment>
            <Route path="/items/:name" element={<ItemPage />} />
            <Route path="/" element={<MainPage />} />
          </Fragment>
        ) : (
            <Route path="*" element={<LoginPage />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
