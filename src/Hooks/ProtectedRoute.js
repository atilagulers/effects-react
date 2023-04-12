import {useContext, useEffect} from 'react';
import StateContext from '../Contexts/StateContext';
import DispatchContext from '../Contexts/DispatchContext';
import {Navigate} from 'react-router-dom';
import {useAuth} from 'qreal-auth-provider/src';

export const ProtectedRoute = ({children}) => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const {token} = appState.user;

  useEffect(() => {
    if (!token) {
      appDispatch({type: 'logout'});
    }
  }, []);

  if (!token) {
    return <Navigate to="/sign-in" />;
  }

  return children;
};
