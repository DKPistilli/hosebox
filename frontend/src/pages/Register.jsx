import { useState, useEffect } from 'react';
// selector allows us to select something from state, dispatch gives access to functions
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import { register, reset } from '../features/auth/authSlice';
import '../styles/LoginRegister.css';

import { toast } from 'react-toastify';

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

  // basic client-side username/email validation (NOT EXTREMELY THOROUGH!)
  const isValidUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]{5,}$/;
    return usernameRegex.test(username);
  };
  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  //setup use effect to [do thing x] when auth state changes  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate(`/inventories/${user._id}`);
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
    } else if (!isValidUsername(name)) {
      toast.error('Username must be at least 5 characters long and contain only letters and numbers.');
    } else if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
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
      <section className="form login-register-form">
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
            <input
              type="password"
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