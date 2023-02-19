import { useState, useEffect } from 'react';
import { FaSign, FaSignInAlt } from 'react-icons/fa';

function Login() {

  const [formData, setFormData] = useState({
    'email': '',
    'password': '',
  });

  const { email, password } = formData;

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
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Enter email address and password</p>
      </section>
      <section className="form">
        <form onSubmit={onSubmit}>
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