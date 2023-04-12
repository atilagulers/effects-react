import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useImmerReducer} from 'use-immer';
import Axios from 'axios';
import {uploadFile} from '../Helpers/uploadFile';
import {useNavigate, Link} from 'react-router-dom';
import BrandForm from './BrandForm';

function CreateBrand() {
  const navigate = useNavigate();
  const [iconUrl, setIconUrl] = useState();

  const originalState = {
    brand: {
      value: '',
      hasErrors: false,
      message: '',
    },

    icon: {
      value: null,
      hasErrors: false,
      message: '',
    },

    brands: {
      value: [],
      id: [],
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'BRAND_CHANGE':
        draft.brand.hasErrors = false;
        draft.brand.value = action.value;

        return;

      case 'ICON_CHANGE':
        draft.icon.hasErrors = false;
        draft.icon.value = action.value;
        return;

      case 'SUBMIT_REQUEST':
        if (!draft.brand.hasErrors && !draft.icon.hasErrors) {
          draft.sendCount++;
        } else toast.error('Please fill in the required information');
        return;

      case 'SAVE_REQUEST_STARTED':
        draft.isSaving = true;
        return;

      case 'SAVE_REQUEST_FINISHED':
        draft.isSaving = false;
        return;

      case 'BRAND_RULES':
        if (!action.value?.trim()) {
          draft.brand.hasErrors = true;
          draft.brand.message = 'You must provide a brand name';
        }
        return;

      case 'ICON_RULES':
        if (!action.value) {
          draft.icon.hasErrors = true;
          draft.icon.message = 'You must provide a icon';
        }
        return;

      default:
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, originalState);

  useEffect(() => {
    if (state.sendCount === 0) return;

    dispatch({type: 'SAVE_REQUEST_STARTED'});
    const brandRequest = Axios.CancelToken.source();
    const iconExt = state.icon.value.type.split('/').pop();

    async function createBrand() {
      try {
        const response = await Axios.post(
          `${process.env.REACT_APP_API_URL}/brands?iconExt=${iconExt}`,
          {
            name: state.brand.value,
          }
        );

        const iconPreSignedUrl = response.data.preSignedUrl;

        if (iconPreSignedUrl) {
          await uploadFile(state.icon.value, iconPreSignedUrl);
        }
        const brandId = response.data.data._id;

        dispatch({type: 'SAVE_REQUEST_FINISHED'});

        toast.success('The brand has been successfully created');
        navigate(`/brands/${brandId}`);
      } catch (error) {
        toast.error('Please fill in the required information');
        console.log('Something went wrong.');
      }
    }
    createBrand();

    return () => brandRequest.cancel();
  }, [state.sendCount]);

  function handleChangeIcon(e) {
    if (e.target.files && e.target.files.length > 0) {
      setIconUrl(URL.createObjectURL(e.target.files[0]));

      dispatch({type: 'ICON_CHANGE', value: e.target.files[0]});
    }
  }
  function handleSubmit(e) {
    e.preventDefault();

    dispatch({type: 'BRAND_RULES', value: state.brand.value});
    dispatch({type: 'ICON_RULES', value: state.icon.value});
    dispatch({type: 'SUBMIT_REQUEST'});
  }

  return (
    <div className="container">
      <div className="d-flex gap-4 align-items-center">
        <Link to="/brands" className="link-secondary text-decoration-none">
          {'< '}Back to results
        </Link>
      </div>
      <BrandForm
        state={state}
        dispatch={dispatch}
        iconUrl={iconUrl}
        editable={true}
        handleChangeIcon={handleChangeIcon}
        handleSubmit={handleSubmit}
        submitText={'Create Brand'}
      />
    </div>
  );
}

export default CreateBrand;
