import {useContext, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';

import DispatchContext from '../Contexts/DispatchContext';

function HeaderLoggedIn() {
  const appDispatch = useContext(DispatchContext);
  const location = useLocation();

  function handleLogout(e) {
    e.preventDefault();

    appDispatch({type: 'LOGOUT'});
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom border-2 mb-3">
      <div className="container-fluid">
        <Link className="navbar-brand ms-2" to="/">
          QReal Effects
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
            <li className="nav-item">
              <Link
                className={`nav-link p ms-1 ${
                  location.pathname === '/' && 'active'
                }`}
                aria-current="page"
                to="/"
              >
                Home
              </Link>
            </li>

            <li className="nav-item ms-1">
              <Link
                onClick={() => appDispatch({type: 'REFRESH_BRANDS'})}
                className={`nav-link ${
                  location.pathname === '/brands' && 'active'
                }`}
                to="/brands"
              >
                Brands
              </Link>
            </li>
            <li className="nav-item">
              <Link
                onClick={() => appDispatch({type: 'REFRESH_EFFECTS'})}
                className={`nav-link ms-1  ${
                  location.pathname === '/effects' && 'active'
                }`}
                to="/effects"
              >
                Effects
              </Link>
            </li>
          </ul>
          <button onClick={handleLogout} className="btn btn-secondary me-3">
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default HeaderLoggedIn;
