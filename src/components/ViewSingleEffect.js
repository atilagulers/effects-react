import React, {useState, useEffect, useContext} from 'react';
import {useParams} from 'react-router-dom';
import Axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import {useNavigate, Link} from 'react-router-dom';
import {useImmerReducer} from 'use-immer';
import StateContext from '../Contexts/StateContext';
import EffectCard from './EffectCard';
import EffectForm from './EffectForm';
import Tag from './Tag';
import ConfirmModal from './ConfirmModal';
import {toast} from 'react-toastify';

function ViewSingleEffect(props) {
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
      id: '',
      hasErrors: false,
      message: '',
    },
    name: {
      value: '',
      hasErrors: false,
      message: '',
    },
    team: {
      value: '',
      hasErrors: false,
      message: '',
    },
    category: {
      value: '',
      hasErrors: false,
      message: '',
    },
    lensType: {
      value: '',
      hasErrors: false,
      message: '',
    },
    liveDate: {
      value: '',
      hasErrors: false,
      message: '',
    },
    preview: {
      value: null,
      hasErrors: false,
      message: '',
    },
    icon: {
      value: null,
      hasErrors: false,
      message: '',
    },
    tags: {
      value: '',
      hasErrors: false,
      message: '',
    },
    driveUrl: {
      value: '',
      hasErrors: false,
      message: '',
    },
    effectUrl: {
      value: '',
      hasErrors: false,
      message: '',
    },
    videoUrl: {
      value: '',
      hasErrors: false,
      message: '',
    },
    brands: {
      value: [],
      id: [],
    },
    isFetching: true,
    isUpdating: false,
    id: useParams().id,
    sendCount: 0,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'FETCH_COMPLETE':
        draft.brand.value = action.brandName;
        draft.brand.id = action.value.brand;
        draft.brands.value = action.brandNames;
        draft.brands.id = action.brandIds;
        draft.name.value = action.value.name;
        draft.team.value = action.value.team;
        draft.category.value = action.value.category;
        draft.lensType.value = action.value.lensType;
        draft.liveDate.value = Date.parse(`${action.value.liveDate}`);
        //draft.preview.value = action.value.preview;
        //draft.icon.value = action.value.icon;
        draft.tags.value = action.value.tags;
        draft.driveUrl.value = action.value.driveURL;
        draft.effectUrl.value = action.value.effectURL;
        draft.videoUrl.value = action.value.videoURL;
        draft.isFetching = false;
        return;

      default:
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, originalState);

  const fetchBrandNameById = async (id) => {
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_API_URL}/brands/${id}`
      );

      return await response.data.data.name;
    } catch (error) {
      console.log('Something went wrong.');
    }
  };

  useEffect(() => {
    const effectRequest = Axios.CancelToken.source();

    async function fetchEffect() {
      try {
        const effectResponse = await Axios.get(
          `${process.env.REACT_APP_API_URL}/effects/${state.id}`,
          {cancelToken: effectRequest.token}
        );

        const effectData = effectResponse.data.data;

        const brandsResponse = await Axios.get(
          `${process.env.REACT_APP_API_URL}/brands?limit=999999&sort=name`
        );

        const effectBrandName = await fetchBrandNameById(effectData.brand);

        const brands = brandsResponse.data.data.data;
        const brandNames = brands.map((brand) => brand.name);
        const brandIds = brands.map((brand) => brand._id);

        dispatch({
          type: 'FETCH_COMPLETE',
          value: effectData,
          brandName: effectBrandName,
          brandNames,
          brandIds,
        });

        setIconUrl(effectData.icon);
        setPreviewUrl(effectData.preview);
      } catch (error) {
        console.log('Something went wrong');
        toast.error('Someting went wrong.');
      }
    }
    fetchEffect();

    return () => effectRequest.cancel();
  }, []);

  const handleClickEdit = () => navigate('edit');

  const handleClickDelete = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (isDeleting) return;
    setShowModal(false);
  };

  const handleConfirmModal = async () => {
    const effectRequest = Axios.CancelToken.source();

    try {
      setIsDeleting(true);
      const effectResponse = await Axios.delete(
        `${process.env.REACT_APP_API_URL}/effects/${state.id}`,
        {cancelToken: effectRequest.token}
      );

      toast.success('The Effect has been successfully deleted');
      setShowModal(false);
      setIsDeleting(false);
      navigate('/effects');
    } catch (error) {
      console.log('Something went wrong');
      toast.error('Something went wrong');
    }

    return () => effectRequest.cancel();
  };

  useEffect(() => {
    const permissions = appState.user.permissions;

    const editPermission = permissions.includes('QREAL_EFFECTS_UPDATE_EFFECT');

    const deletePermission = permissions.includes(
      'QREAL_EFFECTS_DELETE_EFFECT'
    );

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
        body={`"${state.name.value}" will be deleted immediately. You can't undo this action.`}
        confirmText={'Delete Effect'}
        cancelText={'Cancel'}
        handleConfirm={handleConfirmModal}
        handleClose={handleCloseModal}
        show={showModal}
        isDeleting={isDeleting}
      />
      <div className="d-flex gap-4 align-items-center">
        <Link to="/effects" className="link-secondary text-decoration-none">
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
      <div
        className="container-sm  d-flex
  	justify-content-evenly"
      >
        {/* EFFECT PREVIEW */}
        <div className="d-flex flex-column gap-5  align-items-center">
          <div className="" style={{position: 'static'}}>
            <EffectCard
              name={state.name.value ? state.name.value : 'Effect Name'}
              brand={state.brand.value ? state.brand.value : 'Brand Name'}
              disableClick={true}
              previewSrc={previewUrl}
              iconSrc={iconUrl}
            />
          </div>

          {/*<AddTagForm handleSubmit={handleSubmitTag} />*/}

          <div
            className="d-flex gap-3 flex-md-wrap"
            style={{
              maxWidth: '350px',
              minWidth: '350px',
            }}
          >
            {state.tags.value.map((tag, index) => (
              <Tag
                tag={tag}
                //onClick={handleDeleteTag}
                id={index}
                key={index}
                class
                editable={false}
              />
            ))}
          </div>
        </div>

        <EffectForm
          //onSubmit={handleSubmitEffect}
          state={state}
          dispatch={dispatch}
          //handleChangeBrand={handleChangeBrand}
          //handleChangePreview={handleChangePreview}
          //handleChangeIcon={handleChangeIcon}
          //handleSubmit={handleSubmitEffect}
          submitText={'Update Effect'}
          hideSubmit={true}
          editable={false}
        />
      </div>
    </div>
  );
}

export default ViewSingleEffect;
