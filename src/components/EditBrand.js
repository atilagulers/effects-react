import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import BrandForm from './BrandForm';
import {useParams} from 'react-router-dom';
import {useImmerReducer} from 'use-immer';
import LoadingSpinner from './LoadingSpinner';
import Axios from 'axios';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {uploadFile} from '../Helpers/uploadFile';

function EditBrand() {
  const navigate = useNavigate();
  const {id} = useParams();
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

    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'FETCH_COMPLETE':
        draft.brand.value = action.value;

        draft.isFetching = false;
        return;

      case 'BRAND_CHANGE':
        draft.brand.value = action.value;
        return;

      case 'ICON_CHANGE':
        draft.icon.value = action.value;
        return;

      case 'BRAND_RULES':
        if (!action.value?.trim()) {
          draft.brand.hasErrors = true;
          draft.brand.message = 'You must provide a brand name';
        }
        return;

      //case 'ICON_RULES':
      //  if (!action.value) {
      //    draft.icon.hasErrors = true;
      //    draft.icon.message = 'You must provide a icon';
      //  }
      //  return;

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

      default:
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, originalState);

  useEffect(() => {
    const brandRequest = Axios.CancelToken.source();

    async function fetchBrand() {
      try {
        const response = await Axios.get(
          `${process.env.REACT_APP_API_URL}/brands/${id}`,
          {cancelToken: brandRequest.token}
        );

        const brandData = response.data.data;
        setIconUrl(brandData.icon);
        dispatch({
          type: 'FETCH_COMPLETE',
          value: brandData.name,
        });

        setIconUrl(brandData.icon);
      } catch (error) {
        console.log('Something went wrong');
      }
    }
    fetchBrand();

    return () => brandRequest.cancel();
  }, []);

  useEffect(() => {
    if (state.sendCount === 0) return;

    dispatch({type: 'SAVE_REQUEST_STARTED'});
    const brandRequest = Axios.CancelToken.source();

    async function fetchEffect() {
      try {
        const iconExt = state.icon.value?.type.split('/').pop();
        const patchData = {
          name: state.brand.value,
        };
        if (iconExt) patchData.extent = iconExt;

        const response = await Axios.patch(
          `${process.env.REACT_APP_API_URL}/brands/${state.id}`,
          patchData,
          {cancelToken: brandRequest.token}
        );
        console.log(response);
        const {data} = response;

        const iconPreSignedUrl = data.preSignedUrl;

        if (iconPreSignedUrl) {
          await uploadFile(state.icon.value, iconPreSignedUrl);
        }

        dispatch({type: 'SAVE_REQUEST_FINISHED'});
        toast.success('The brand has been successfully updated.');
        navigate(`/brands/${id}`);
      } catch (error) {
        console.log(error);
        console.log('Something went wrong');
      }
    }
    fetchEffect();

    return () => brandRequest.cancel();
  }, [state.sendCount]);

  function handleChangeIcon(e) {
    if (e.target.files && e.target.files.length > 0) {
      setIconUrl(URL.createObjectURL(e.target.files[0]));

      dispatch({type: 'ICON_CHANGE', value: e.target.files[0]});
    }
  }

  function handleSubmitBrand(e) {
    e.preventDefault();

    dispatch({type: 'BRAND_RULES', value: state.brand.value});
    //dispatch({type: 'ICON_RULES', value: state.icon.value});
    dispatch({type: 'SUBMIT_REQUEST'});
  }

  if (state.isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container">
      {' '}
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
        hideSubmit={false}
        handleChangeIcon={handleChangeIcon}
        handleSubmit={handleSubmitBrand}
        submitText={'Update Brand'}
      />
    </div>
  );
}

export default EditBrand;
