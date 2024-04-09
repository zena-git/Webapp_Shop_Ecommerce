import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react';
import { privateRouter, publicRouter } from '~/routes';
import './global.css'
import DefaultLayout from './components/Layout/DefaultLayout';


function App() {
  return (
    <Router>
      <div className="App ">
        {/* <DefaultLayout> */}
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
        {/* </DefaultLayout> */}
      </div>
    </Router>
  );
}

export default App;