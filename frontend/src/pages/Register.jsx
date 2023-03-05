import { useState, useEffect } from 'react';
// selector allows us to select something from state, dispatch gives access to functions
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import Spinner from '../components/Spinner';

import { register, reset } from '../features/auth/authSlice';

function Register() {

  const [formData, setFormData] = useState({
    'name': '',
    'email': '',
    'password': '',
    'password2': ''
  });

  const { name, email, password, password2 } = formData;

  // allow for navigation && dispatching functions
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user,
    isLoading,
    isError,
    isSuccess,
    message} = useSelector((state) => state.auth);

  //setup use effect to [do thing x] when auth state changes  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/inventory');
    }

    dispatch(reset());

  }, [user, isError, isSuccess, message, navigate, dispatch]);

  // update user input for display for all fields
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // handle registration submit event
  const onSubmit = (e) => {
    e.preventDefault();

    // verify "confirm password" and dispatch register function w/ inputted Data
    if (password !== password2) {
      toast.error('Passwords do not match.');
    } else {
      const userData = {
        'name': name,
        'email': email,
        'password': password,
      };

      dispatch(register(userData));
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>
      <section className="form">
        <form onSubmit={onSubmit}>
        <div className="form-group">
            <input
              type="text"
              className="form-control"
              id='name'
              name='name'
              value={name}
              placeholder='Enter your name'
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
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
              type="text"
              className="form-control"
              id='password'
              name='password'
              value={password}
              placeholder='Enter your password'
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id='password2'
              name='password2'
              value={password2}
              placeholder='Confirm password'
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

export default Register