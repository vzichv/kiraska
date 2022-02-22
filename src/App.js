import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Avito from './Avito';
import Changes from './Changes';

import Header from './components/header';
import Footer from './components/footer';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Header />
        <Routes>
          <Route exact path='/' element={<Avito />} />
          <Route exact path='/changes' element={<Changes />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    );
  }
}

export default App;
