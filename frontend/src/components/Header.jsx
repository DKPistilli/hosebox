// eslint-disable-next-line
import {FaSignInAlt, FaSignOutAlt, FaUser} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {logout, reset} from '../features/auth/authSlice';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    // Login/Register buttons for anonymous user
    const loginAndRegisterHeader = (
        <>
            <li>
                <Link to='/login'>
                    <FaSignInAlt /> Login
                </Link>
            </li>
            <li>
                <Link to='/register'>
                    <FaUser /> Register
                </Link>
            </li>
        </>
    );

    // Logout button for authenticated user
    const logoutHeader = (
        <li>
            <button className='btn' onClick={handleLogout}>
                <FaSignOutAlt /> Logout
            </button>
        </li>
    );

    return (
        <header className='header'>
            <div className="logo">
                <Link to='/'>
                    Hosebox.net
                </Link>
            </div>
            <ul>{user ? logoutHeader : loginAndRegisterHeader}</ul>
        </header>
    )
}

export default Header