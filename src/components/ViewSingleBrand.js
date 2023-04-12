import React, {useEffect, useState, useContext} from 'react';
import {useParams} from 'react-router-dom';
import BrandForm from './BrandForm';
import {useNavigate, Link} from 'react-router-dom';
import StateContext from '../Contexts/StateContext';
import LoadingSpinner from './LoadingSpinner';
import {useImmerReducer} from 'use-immer';
import Axios from 'axios';
import ConfirmModal from './ConfirmModal';
import {toast} from 'react-toastify';

function ViewSingleBrand() {
  const id = useParams().id;
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState();
  const [iconUrl, setIconUrl] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

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
    isUpdating: false,
    id: useParams().id,
    sendCount: 0,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'FETCH_COMPLETE':
        draft.brand.value = action.value;
        draft.isFetching = false;
        return;

      default:
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, originalState);

  useEffect(() => {
    const brandRequest = Axios.CancelToken.source();

    async function fetchEffect() {
      try {
        const response = await Axios.get(
          `${process.env.REACT_APP_API_URL}/brands/${state.id}`,
          {cancelToken: brandRequest.token}
        );

        const brandData = response.data.data;
        setIconUrl(brandData.icon);
        dispatch({
          type: 'FETCH_COMPLETE',
          value: brandData.name,
        });

        //setIconUrl(effectData.icon);
        //setPreviewUrl(effectData.preview);
      } catch (error) {
        console.log('Something went wrong');
      }
    }
    fetchEffect();

    return () => brandRequest.cancel();
  }, []);

  function handleClickEdit() {
    navigate('edit');
  }

  const handleClickDelete = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (isDeleting) return;
    setShowModal(false);
  };

  const handleConfirmModal = async () => {
    const brandRequest = Axios.CancelToken.source();

    try {
      setIsDeleting(true);
      const effectResponse = await Axios.delete(
        `${process.env.REACT_APP_API_URL}/brands/${state.id}`,
        {cancelToken: brandRequest.token}
      );

      toast.success('The Brand has been successfully deleted');
      setShowModal(false);
      setIsDeleting(false);
      navigate('/brands');
    } catch (error) {
      console.log('Something went wrong');
      toast.error('Something went wrong');
    }

    return () => brandRequest.cancel();
  };

  useEffect(() => {
    const permissions = appState.user.permissions;

    const editPermission = permissions.includes('QREAL_EFFECTS_BRAND_UPDATE');

    const deletePermission = permissions.includes('QREAL_EFFECTS_BRAND_DELETE');

    setShowEditButton(editPermission);
    setShowDeleteButton(deletePermission);
  }, []);

  if (state.isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container">
      <ConfirmModal
        title={`Are you sure?`}
        body={`"${state.brand.value}" will be deleted immediately. You can't undo this action.`}
        confirmText={'Delete Brand'}
        cancelText={'Cancel'}
        handleConfirm={handleConfirmModal}
        handleClose={handleCloseModal}
        show={showModal}
        isDeleting={isDeleting}
      />
      <div className="d-flex gap-4 align-items-center">
        <Link to="/brands" className="link-secondary text-decoration-none">
          {'< '}Back to results
        </Link>
        {showDeleteButton && (
          <i
            onClick={handleClickDelete}
            className="bi bi-trash ms-3"
            style={{fontSize: '24px', color: 'red'}}
            role="button"
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
          ></i>
        )}

        {showEditButton && (
          <i
            onClick={handleClickEdit}
            className="bi bi-pencil-square "
            style={{fontSize: '24px', color: 'blue'}}
            role="button"
            data-toggle="tooltip"
            data-placement="top"
            title="Edit"
          ></i>
        )}
      </div>
      <BrandForm
        state={state}
        dispatch={dispatch}
        iconUrl={iconUrl}
        editable={false}
        hideSubmit={true}
        //handleChangeIcon={handleChangeIcon}
        //handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default ViewSingleBrand;
