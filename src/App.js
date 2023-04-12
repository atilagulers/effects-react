import {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {useImmerReducer} from 'use-immer';
//import {useAuth} from 'qreal-auth-provider/src';
import {ToastContainer, Slide} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import '../node_modules/react-bootstrap/dist/react-bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

// Authentication imports
//import {AuthProvider} from 'qreal-auth-provider/src';
//import {AuthProvider} from './Contexts/AuthProvider';
import {ProtectedRoute} from './Hooks/ProtectedRoute';

// Context Imports
import StateContext from './Contexts/StateContext';
import DispatchContext from './Contexts/DispatchContext';

// My Components
import SignIn from './components/SignIn';
import Header from './components/Header';
import Effects from './components/Effects';
import ViewSingleEffect from './components/ViewSingleEffect';
import CreateEffect from './components/CreateEffect';
import EditEffect from './components/EditEffect';
import Brands from './components/Brands';
import CreateBrand from './components/CreateBrand';
import ViewSingleBrand from './components/ViewSingleBrand';
import EditBrand from './components/EditBrand';

function App() {
  const initialState = {
    user: {
      token: localStorage.getItem('qrealEffectsToken'),
      email: localStorage.getItem('qrealEffectsEmail'),
      firstName: localStorage.getItem('qrealEffectsFirstName'),
      lastName: localStorage.getItem('qrealEffectsLastName'),
      username: localStorage.getItem('qrealEffectsUsername'),
      role: localStorage.getItem('qrealEffectsRole'),
      userAvatar: localStorage.getItem('qrealEffectsUserAvatar'),
      permissions: localStorage.getItem('qrealEffectsPermissions'),
    },
    loggedIn: Boolean(localStorage.getItem('qrealEffectsToken')),

    searchEffects: {
      query: '',
      results: [],
      page: 1,
      sort: 'name',
      submitCount: 0,
    },

    searchBrands: {
      query: '',
      results: [],
      page: 1,
      sort: 'name',
      submitCount: 0,
    },

    filterEffects: {
      brands: [],
      selectedBrands: [],
      team: '',
      category: '',
      lensType: '',
      startDate: '',
      endDate: '',
    },

    scrollPos: 0,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'LOGIN':
        draft.loggedIn = true;
        draft.user = action.data;
        return;

      case 'LOGOUT':
        draft.loggedIn = false;
        window.location.href = '/sign-in';
        return;

      case 'UPDATE_EFFECTS':
        draft.searchEffects.results = action.results;
        draft.searchEffects.page = action.page;
        draft.searchEffects.query = action.query;
        draft.searchEffects.sort = action.sort;
        draft.searchEffects.submitCount = action.submitCount;
        return;

      case 'UPDATE_BRANDS':
        draft.searchBrands.results = action.results;
        draft.searchBrands.page = action.page;
        draft.searchBrands.query = action.query;
        draft.searchBrands.sort = action.sort;
        draft.searchBrands.submitCount = action.submitCount;

        return;

      case 'UPDATE_EFFECTS_FILTER':
        draft.filterEffects.brands = action.brands;
        draft.filterEffects.selectedBrands = action.selectedBrands;
        draft.filterEffects.team = action.team;
        draft.filterEffects.category = action.category;
        draft.filterEffects.lensType = action.lensType;
        draft.filterEffects.startDate = action.startDate;
        draft.filterEffects.endDate = action.endDate;

        return;

      default:
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('qrealEffectsToken', state.user.token);
      localStorage.setItem('qrealEffectsEmail', state.user.email);
      localStorage.setItem('qrealEffectsFirstName', state.user.firstName);
      localStorage.setItem('qrealEffectsLastName', state.user.lastName);
      localStorage.setItem('qrealEffectsUsername', state.user.username);
      localStorage.setItem('qrealEffectsRole', state.user.role);
      localStorage.setItem('qrealEffectsUserAvatar', state.user.userAvatar);
      localStorage.setItem('qrealEffectsPermissions', state.user.permissions);
    } else {
      localStorage.removeItem('qrealEffectsToken');
      localStorage.removeItem('qrealEffectsEmail');
      localStorage.removeItem('qrealEffectsFirstName');
      localStorage.removeItem('qrealEffectsLastName');
      localStorage.removeItem('qrealEffectsUsername');
      localStorage.removeItem('qrealEffectsRole');
      localStorage.removeItem('qrealEffectsUserAvatar');
      localStorage.removeItem('qrealEffectsPermissions');
    }
  }, [state.loggedIn]);

  return (
    <div className="App">
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <Router>
            <Header />
            <Routes>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="*" element={<h1>Not Found :(</h1>} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <>
                      <div className="container-lg">
                        <h3>Welcome!</h3>
                      </div>
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/effects"
                element={
                  <ProtectedRoute>
                    <Effects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/effects/:id"
                element={
                  <ProtectedRoute>
                    <ViewSingleEffect editable={true} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/effects/create"
                element={
                  <ProtectedRoute>
                    <CreateEffect />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/effects/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditEffect />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/brands"
                element={
                  <ProtectedRoute>
                    <Brands />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/brands/:id"
                element={
                  <ProtectedRoute>
                    <ViewSingleBrand editable={true} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/brands/create"
                element={
                  <ProtectedRoute>
                    <CreateBrand />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/brands/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditBrand />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <div className="container-lg border-top mt-lg-5">
              {/*<small>FOOTER</small>*/}
            </div>
          </Router>

          <ToastContainer
            position="top-center"
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
            theme="light"
            autoClose={1500}
            transition={Slide}
          />
        </DispatchContext.Provider>
      </StateContext.Provider>
    </div>
  );
}

export default App;
