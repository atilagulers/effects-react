import React, {useEffect, useState} from 'react';
import EffectCard from './EffectCard';
import Tag from './Tag';
import Axios from 'axios';
import {useImmerReducer} from 'use-immer';
import LoadingSpinner from './LoadingSpinner';
import EffectForm from './EffectForm';
import AddTagForm from './AddTagForm';
import {uploadFile} from '../Helpers/uploadFile';
import {toast} from 'react-toastify';
import {Link, useNavigate, useParams} from 'react-router-dom';

function EditEffect() {
  const navigate = useNavigate();
  const id = useParams().id;
  const [previewUrl, setPreviewUrl] = useState();
  const [iconUrl, setIconUrl] = useState();

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
      value: [],
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
    isSaving: false,
    id: id,
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
      case 'BRAND_CHANGE':
        draft.brand.value = action.value;
        draft.brand.id = action.id;
        return;

      case 'NAME_CHANGE':
        draft.name.hasErrors = false;
        draft.name.value = action.value;
        return;

      case 'TEAM_CHANGE':
        draft.team.hasErrors = false;
        draft.team.value = action.value;
        return;

      case 'CATEGORY_CHANGE':
        draft.category.hasErrors = false;
        draft.category.value = action.value;
        return;

      case 'LIVE_DATE_CHANGE':
        draft.liveDate.hasErrors = false;
        draft.liveDate.value = action.value;
        return;

      case 'LENS_TYPE_CHANGE':
        draft.lensType.hasErrors = false;
        draft.lensType.value = action.value;
        return;

      case 'PREVIEW_CHANGE':
        draft.name.hasErrors = false;
        draft.preview.value = action.value;
        return;

      case 'ICON_CHANGE':
        draft.name.hasErrors = false;
        draft.icon.value = action.value;
        return;

      case 'DRIVE_URL_CHANGE':
        draft.driveUrl.hasErrors = false;
        draft.driveUrl.value = action.value;
        return;

      case 'EFFECT_URL_CHANGE':
        draft.effectUrl.hasErrors = false;
        draft.effectUrl.value = action.value;
        return;

      case 'VIDEO_URL_CHANGE':
        draft.videoUrl.hasErrors = false;
        draft.videoUrl.value = action.value;
        return;

      case 'TAGS_CHANGE':
        draft.tags.hasErrors = false;
        draft.tags.value = action.value;
        return;

      case 'SUBMIT_REQUEST':
        if (!draft.name.hasErrors) {
          draft.sendCount++;
        } else toast.error('Please fill in the required information');
        return;

      case 'SAVE_REQUEST_STARTED':
        draft.isSaving = true;
        return;

      case 'SAVE_REQUEST_FINISHED':
        draft.isSaving = false;
        return;

      case 'NAME_RULES':
        if (!action.value.trim()) {
          draft.name.hasErrors = true;
          draft.name.message = 'You must provide a name';
        }
        return;

      case 'DRIVE_URL_RULES':
        if (!action.value.trim()) {
          draft.driveUrl.hasErrors = true;
          draft.driveUrl.message = 'You must provide a drive url';
        }
        return;

      case 'EFFECT_URL_RULES':
        if (!action.value.trim()) {
          draft.effectUrl.hasErrors = true;
          draft.effectUrl.message = 'You must provide a effect url';
        }
        return;

      case 'VIDEO_URL_RULES':
        if (!action.value.trim()) {
          draft.videoUrl.hasErrors = true;
          draft.videoUrl.message = 'You must provide a video url';
        }
        return;

      default:
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, originalState);

  function handleChangePreview(e) {
    if (e.target.files && e.target.files.length > 0) {
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));

      dispatch({type: 'PREVIEW_CHANGE', value: e.target.files[0]});
    }
  }

  function handleChangeIcon(e) {
    if (e.target.files && e.target.files.length > 0) {
      setIconUrl(URL.createObjectURL(e.target.files[0]));

      dispatch({type: 'ICON_CHANGE', value: e.target.files[0]});
    }
  }

  function handleDeleteTag(e, tagId) {
    const updatedTags = state.tags.value.filter(
      (tag, index) => index !== tagId
    );

    dispatch({type: 'TAGS_CHANGE', value: updatedTags});
  }

  async function fetchBrandNameById(id) {
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_API_URL}/brands/${id}`
      );

      return await response.data.data.name;
    } catch (error) {
      console.log(error);
    }
  }

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
      }
    }
    fetchEffect();

    return () => effectRequest.cancel();
  }, []);

  useEffect(() => {
    if (state.sendCount === 0) return;

    dispatch({type: 'SAVE_REQUEST_STARTED'});
    const effectRequest = Axios.CancelToken.source();

    async function fetchEffect() {
      try {
        const patchData = {
          brand: state.brand.id,
          name: state.name.value,
          team: state.team.value,
          category: state.category.value,
          tags: state.tags.value,
          lensType: state.lensType.value,
          //icon: state.icon.value,
          //preview: state.preview.value,
          liveDate: state.liveDate.value,
          driveURL: state.driveUrl.value,
          effectURL: state.effectUrl.value,
          videoURL: state.videoUrl.value,
        };

        if (state.preview.value)
          patchData.preview = state.preview.value.name.split('.').pop();

        if (state.icon.value)
          patchData.icon = state.icon.value.name.split('.').pop();

        const response = await Axios.patch(
          `${process.env.REACT_APP_API_URL}/effects/${state.id}`,
          patchData,
          {cancelToken: effectRequest.token}
        );

        const {data} = response;
        const previewPreSignedUrl = data.previewPreSignedUrl;
        const iconPreSignedUrl = data.iconPreSignedUrl;

        if (previewPreSignedUrl) {
          await uploadFile(state.preview.value, previewPreSignedUrl);
        }

        if (iconPreSignedUrl) {
          await uploadFile(state.icon.value, iconPreSignedUrl);
        }

        toast.success('The effect has been successfully updated.');
        navigate(`/effects/${id}`);
      } catch (error) {
        console.log('Something went wrong');
        toast.error('Please fill in the required information');
      } finally {
        dispatch({type: 'SAVE_REQUEST_FINISHED'});
      }
    }
    fetchEffect();

    return () => effectRequest.cancel();
  }, [state.sendCount]);

  if (state.isFetching) {
    return <LoadingSpinner />;
  }

  function handleChangeBrand(e) {
    const options = e.target.selectedOptions[0];
    const value = options.value;
    const id = options.id;

    dispatch({type: 'BRAND_CHANGE', value, id});
  }

  function handleSubmitTag(e) {
    e.preventDefault();
    const inputTag = e.target.elements.tag.value;
    const updatedTags = [...state.tags.value, inputTag];

    dispatch({type: 'TAGS_CHANGE', value: updatedTags});

    e.target.reset();
  }

  function handleSubmitEffect(e) {
    e.preventDefault();

    dispatch({type: 'NAME_RULES', value: state.name.value});
    dispatch({type: 'DRIVE_URL_VALUES', value: state.driveUrl.value});
    dispatch({type: 'EFFECT_URL_VALUES', value: state.effectUrl.value});
    dispatch({type: 'VIDEO_URL_VALUES', value: state.videoUrl.value});
    dispatch({type: 'SUBMIT_REQUEST'});
  }

  return (
    <div
      className="container-sm  d-flex  
		justify-content-evenly"
    >
      <Link
        to={`/effects/${id}`}
        className="link-secondary text-decoration-none"
      >
        {'< '}Back
      </Link>
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

        <AddTagForm handleSubmit={handleSubmitTag} />

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
              onClick={handleDeleteTag}
              id={index}
              key={index}
              editable={true}
            />
          ))}
        </div>
      </div>

      <EffectForm
        handleSubmit={handleSubmitEffect}
        state={state}
        dispatch={dispatch}
        handleChangeBrand={handleChangeBrand}
        handleChangePreview={handleChangePreview}
        handleChangeIcon={handleChangeIcon}
        submitText={'Update Effect'}
        editable={true}
        isSaving={state.isSaving}
      />
    </div>
  );
}

export default EditEffect;
