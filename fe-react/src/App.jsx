import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './view/home/Home';
import NotFound from './view/notFound/NotFound';
import User from './view/user/User';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/catalog" element={<Home />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <span className='content'>hiền hihi</span>
    </>
  );
}

export default App;
