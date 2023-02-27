import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import CardlistDisplay from '../components/CardlistDisplay';

function Dashboard() {

  //init navigation && find user
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  //if not logged in, navigate out of dashboard back to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // if no user, return spinner while waiting to be redirected to Login
  if (!user) {
    return <Spinner />
  }

  return (
    <div>
      <h1>{user.name}'s Dashboard</h1>
      <p> All your cards go here! </p>
      <CardlistDisplay />
    </div>
  )
}
export default Dashboard