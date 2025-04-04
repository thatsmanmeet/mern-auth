import { Container, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <div className=' py-5'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
          <h1 className='text-center mb-4'>MERN Authentication</h1>
          <p className='text-center mb-4'>
            This codebase demonstrates how the authentication works using
            JsonWebToken using MERN Stack + Redux Toolkit Query Library
          </p>
          <div className='d-flex'>
            {userInfo ? (
              <p>Welcome {userInfo.name}</p>
            ) : (
              <>
                <Button variant='primary' href='/login' className='me-3'>
                  Sign In
                </Button>
                <Button variant='secondary' href='/register'>
                  Register
                </Button>
              </>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
