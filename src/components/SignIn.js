import React, {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Axios from 'axios';
import {toast} from 'react-toastify';

import StateContext from '../Contexts/StateContext';
import DispatchContext from '../Contexts/DispatchContext';

function SignIn() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (appState.loggedIn) {
    window.location.href = '/';
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await Axios.post(
        `${process.env.REACT_APP_AUTH_API}/auth/login`,
        {
          email,
          password,
          service: 'QREAL_EFFECTS',
        }
      );
      const authToken = response.data.data.authorization_token;

      const {data} = await Axios.get(
        `${process.env.REACT_APP_AUTH_API}/auth/permissions`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const userData = {
        token: authToken,
        email: data.data.user.email,
        firstName: data.data.user.first_name,
        lastName: data.data.user.last_name,
        username: data.data.user.username,
        role: data.data.user.role,
        userAvatar: data.data.user.user_avatar,
        permissions: data.data.permissions,
      };
      //console.log(userData);
      if (data) {
        appDispatch({type: 'LOGIN', data: userData});
        navigate(`/`);
        toast.success(`Welcome, ${data.data.user.first_name}`);
      }
    } catch (error) {
      toast.error('Wrong username or password.');
      console.log('There was  an error.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div onSubmit={handleSubmit} className="text-center">
      <form style={{maxWidth: '480px', margin: 'auto'}}>
        <h1 className="mt-5 mb-5">QReal Effects</h1>
        <div className="mb-3">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control"
            id="emailAddress"
            placeholder="Email Address"
            autoFocus
          />
        </div>
        <div className="mb-5">
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
          />
        </div>

        <button
          className="btn btn-lg btn-primary btn-block"
          style={{width: '100%'}}
          disabled={loading}
        >
          Log in
        </button>
      </form>
    </div>
  );
}

export default SignIn;
