import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react';
import { privateRouter, publicRouter } from '~/routes';

import DefaultLayout from './layouts/DefaultLayout';

import DataProvider from './provider/DataProvider';
import ScrollToTop from './components/ScrollToTop';
function App() {
  return (
    <Router>
    <ScrollToTop /> 
      <DataProvider>
        <div className="App ">
          <Routes>

            {privateRouter.map(
              (route, index) => {
                const Page = route.component;
                let Layout = DefaultLayout;
                if (route.layout) {
                  Layout = route.layout;
                } else if (route.layout === null) {
                  Layout = Fragment
                }

                return (
                  <Route key={index} path={route.path} element={
                    <Layout>
                      <Page />
                    </Layout>
                  } />
                );
              }
            )}
          </Routes>
        </div>
      </DataProvider>
    </Router>
  );
}

export default App;
