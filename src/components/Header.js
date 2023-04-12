import React, {useContext, useEffect} from 'react';
import HeaderLoggedIn from './HeaderLoggedIn';
import HeaderLoggedOut from './HeaderLoggedOut';
import {Link} from 'react-router-dom';

import StateContext from '../Contexts/StateContext';

function Header() {
  const appState = useContext(StateContext);
  return appState.loggedIn ? <HeaderLoggedIn /> : <></>;

  //return <header>{appState.loggedIn ? <HeaderLoggedIn /> : <></>}</header>;
}

export default Header;

//{appState.loggedIn ? <HeaderLoggedIn /> : <></>}
