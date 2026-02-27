import React, { Fragment } from 'react';
import { createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType, BrowserRouter as Router, Route } from 'react-router-dom';
import MainPage from './screens/MainPage';
import ItemPage from './screens/ItemPage';
import { auth } from './config/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MetricsPage } from './screens/MetricsPage';
import LoginPage from './screens/LoginPage';
import { createReactRouterV6Options, getWebInstrumentations, initializeFaro, ReactIntegration, ReactRouterVersion, FaroRoutes } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { EditModeProvider } from './components/EditStateProvider';

const faroUrl = import.meta.env.VITE_FARO_URL;

initializeFaro({
  url: faroUrl,
  app: {
    name: 'tracker',
    version: '1.0.0',
    environment: 'production'
  },

  instrumentations: [
    // Mandatory, omits default instrumentations otherwise.
    ...getWebInstrumentations(),

    // Tracing package to get end-to-end visibility for HTTP requests.
    new TracingInstrumentation(),

    // React integration for React applications.
    new ReactIntegration({
      router: createReactRouterV6Options({
        createRoutesFromChildren,
        matchRoutes,
        Routes,
        useLocation,
        useNavigationType,
      }),
    }),
  ],
});

const App: React.FC = () => {

  const [user] = useAuthState(auth);


  return (
    <EditModeProvider>
      <Router>
        <FaroRoutes>
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
        </FaroRoutes>
      </Router>
    </EditModeProvider>
  );
};

export default App;
