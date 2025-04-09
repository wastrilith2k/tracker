import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './screens/MainPage';
import ItemPage from './screens/ItemPage';
import { auth } from './config/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MetricsPage } from './screens/MetricsPage';
import LoginPage from './screens/LoginPage';

const App: React.FC = () => {

  const [user] = useAuthState(auth);


  return (
    <Router>
      <Routes>
        {user ? (
          <Fragment>
            <Route path="/items/:name" element={<ItemPage />} />
            <Route path="/items/:name/metrics" element={<MetricsPage />} />
            <Route path="/items/:name/metrics/:metric" element={<MetricsPage />} />
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
