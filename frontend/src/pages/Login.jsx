import { useState, useEffect } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

import { login, reset } from '../features/auth/authSlice';

import '../styles/LoginRegister.css'

function Login() {

  // load in state/redux vars and initialize nav/dispatch
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const {user, isLoading, isSuccess, isError, message} =
  useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    'email'       : '',
    'password'    : '',
  });

  const { email, password } = formData;

  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  // handle response from server to our login request
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      navigate(`/inventories/${user._id}`);
    }

    dispatch(reset());

  }, [user, isSuccess, isError, message, navigate, dispatch]);

  // update user input for display for all fields
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // handle login submit event
  const onSubmit = (e) => {
    e.preventDefault();

    // verify that both fields have been filled
    if (!email || !password) {
      toast.error('Please fill in both email and password.');
    } else if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
    } else {
      dispatch(login({ email, password }));
    }

  };

  // spin while waiting for server
  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Enter email address and password</p>
      </section>
      <section className="form login-register-form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type={'text'}
              className="form-control"
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email address'
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id='password'
              name='password'
              value={password}
              placeholder='Enter your password'
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button type="submit" className='btn btn-block'>
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Login