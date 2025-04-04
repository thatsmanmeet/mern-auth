import React from 'react';
import Header from './components/Header';
import { Outlet } from 'react-router';
import { Container, ToastContainer } from 'react-bootstrap';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
      <Header />
      <Container className='my-2'>
        <Outlet />
      </Container>
      <Toaster position='top-right' />
    </>
  );
};

export default App;
