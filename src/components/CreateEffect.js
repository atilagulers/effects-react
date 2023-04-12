import React, {useState, useEffect} from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import EffectCard from './EffectCard';
import Axios from 'axios';
import Tag from './Tag';
import {useImmerReducer} from 'use-immer';
import {useParams} from 'react-router-dom';
import EffectForm from './EffectForm';
import {uploadFile} from '../Helpers/uploadFile';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

function CreateEffect() {
  const navigate = useNavigate();
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
    id: useParams().id,
    sendCount: 0,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'BRANDS_FETCH_COMPLETE':
        draft.brands.value = action.value;
        draft.brands.id = action.id;
        return;

      case 'BRAND_CHANGE':
        draft.brand.hasErrors = false;
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
        draft.preview.hasErrors = false;
        draft.preview.value = action.value;
        return;

      case 'ICON_CHANGE':
        draft.icon.hasErrors = false;
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
        draft.tags.value = action.value;
        return;

      case 'SUBMIT_REQUEST':
        if (
          !draft.brand.hasErrors &&
          !draft.name.hasErrors &&
          !draft.team.hasErrors &&
          !draft.category.hasErrors &&
          !draft.liveDate.hasErrors &&
          !draft.lensType.hasErrors &&
          !draft.preview.hasErrors &&
          !draft.icon.hasErrors &&
          !draft.driveUrl.hasErrors &&
          !draft.effectUrl.hasErrors &&
          !draft.videoUrl.hasErrors
        ) {
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
          draft.brand.message = 'You must provide a brand';
        }
        return;

      case 'NAME_RULES':
        if (!action.value?.trim()) {
          draft.name.hasErrors = true;
          draft.name.message = 'You must provide a name';
        }
        return;

      case 'TEAM_RULES':
        if (!action.value?.trim()) {
          draft.team.hasErrors = true;
          draft.team.message = 'You must provide a team';
        }
        return;

      case 'CATEGORY_RULES':
        if (!action.value?.trim()) {
          draft.category.hasErrors = true;
          draft.category.message = 'You must provide a category';
        }
        return;

      case 'LENS_TYPE_RULES':
        if (!action.value?.trim()) {
          draft.lensType.hasErrors = true;
          draft.lensType.message = 'You must provide a lens type';
        }
        return;

      case 'LIVE_DATE_RULES':
        if (!action.value) {
          draft.liveDate.hasErrors = true;
          draft.liveDate.message = 'You must provide a live date';
        }
        return;

      case 'PREVIEW_RULES':
        if (!action.value) {
          draft.preview.hasErrors = true;
          draft.preview.message = 'You must provide a preview image';
        }
        return;

      case 'ICON_RULES':
        if (!action.value) {
          draft.icon.hasErrors = true;
          draft.icon.message = 'You must provide a icon';
        }
        return;

      case 'DRIVE_URL_RULES':
        if (!action.value?.trim()) {
          draft.driveUrl.hasErrors = true;
          draft.driveUrl.message = 'You must provide a drive url';
        }
        return;

      case 'EFFECT_URL_RULES':
        if (!action.value?.trim()) {
          draft.effectUrl.hasErrors = true;
          draft.effectUrl.message = 'You must provide a effect url';
        }
        return;

      case 'VIDEO_URL_RULES':
        if (!action.value?.trim()) {
          draft.videoUrl.hasErrors = true;
          draft.videoUrl.message = 'You must provide a video url';
        }
        return;

      default:
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, originalState);

  useEffect(() => {
    async function fetchBrands() {
      const brandsResponse = await Axios.get(
        `${process.env.REACT_APP_API_URL}/brands?limit=999999&sort=name`
      );

      const brands = brandsResponse.data.data.data;
      const brandNames = brands.map((brand) => brand.name);
      const brandIds = brands.map((brand) => brand._id);

      dispatch({
        type: 'BRANDS_FETCH_COMPLETE',
        value: brandNames,
        id: brandIds,
      });
    }
    fetchBrands();
  });

  //async function fetchBrandNameById(id) {
  //  try {
  //    const response = await Axios.get(
  //      `${process.env.REACT_APP_API_URL}/brands/${id}`
  //    );

  //    return await response.data.data.name;
  //  } catch (error) {
  //    console.log(error);
  //  }
  //}

  function handleChangeBrand(e) {
    const options = e.target.selectedOptions[0];
    const value = options.value;
    const id = options.id;

    dispatch({type: 'BRAND_CHANGE', value, id});
  }

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

  function handleSubmitEffect(e) {
    e.preventDefault();

    dispatch({type: 'BRAND_RULES', value: state.brand.value});
    dispatch({type: 'NAME_RULES', value: state.name.value});
    dispatch({type: 'TEAM_RULES', value: state.team.value});
    dispatch({type: 'CATEGORY_RULES', value: state.category.value});
    dispatch({type: 'LENS_TYPE_RULES', value: state.lensType.value});
    dispatch({type: 'LIVE_DATE_RULES', value: state.liveDate.value});
    dispatch({type: 'PREVIEW_RULES', value: state.preview.value});
    dispatch({type: 'ICON_RULES', value: state.icon.value});
    dispatch({type: 'DRIVE_URL_RULES', value: state.driveUrl.value});
    dispatch({type: 'EFFECT_URL_RULES', value: state.effectUrl.value});
    dispatch({type: 'VIDEO_URL_RULES', value: state.videoUrl.value});

    dispatch({type: 'SUBMIT_REQUEST'});
  }

  useEffect(() => {
    if (state.sendCount === 0) return;

    dispatch({type: 'SAVE_REQUEST_STARTED'});
    const effectRequest = Axios.CancelToken.source();

    async function createEffect() {
      try {
        const response = await Axios.post(
          `${process.env.REACT_APP_API_URL}/effects?iconExt=${state.icon.value.type}&previewExt=${state.preview.value.type}`,
          {
            brand: state.brand.id,
            name: state.name.value,
            team: state.team.value,
            category: state.category.value,
            tags: state.tags.value,
            lensType: state.lensType.value,
            liveDate: state.liveDate.value,
            driveURL: state.driveUrl.value,
            effectURL: state.effectUrl.value,
            videoURL: state.videoUrl.value,
          },
          {cancelToken: effectRequest.token}
        );
        const previewPreSignedUrl = response.data.previewPreSignedUrl;
        const iconPreSignedUrl = response.data.iconPreSignedUrl;

        if (previewPreSignedUrl) {
          await uploadFile(state.preview.value, previewPreSignedUrl);
        }

        if (iconPreSignedUrl) {
          await uploadFile(state.icon.value, iconPreSignedUrl);
        }
        const effectId = response.data.data._id;

        toast.success('The effect has been successfully created');
        navigate(`/effects/${effectId}`);
      } catch (error) {
        toast.error('Please fill in the required information');
        console.log('Something went wrong.');
      } finally {
        dispatch({type: 'SAVE_REQUEST_FINISHED'});
      }
    }
    createEffect();

    return () => effectRequest.cancel();
  }, [state.sendCount]);

  function handleSubmitTag(e) {
    e.preventDefault();
    const inputTag = e.target.elements.tag.value;
    const updatedTags = [...state.tags.value, inputTag];

    dispatch({type: 'TAGS_CHANGE', value: updatedTags});

    e.target.reset();
  }

  function handleDeleteTag(e, tagId) {
    const updatedTags = state.tags.value.filter(
      (tag, index) => index !== tagId
    );

    dispatch({type: 'TAGS_CHANGE', value: updatedTags});
  }

  return (
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
        <form
          id="create-tag-form"
          onSubmit={handleSubmitTag}
          className="d-flex gap-2 needs-validation"
        >
          <input
            type="text"
            name="tag"
            className="form-control"
            required
            id="tag"
            placeholder="Add Tag"
          />
          <button className="btn btn-primary">Add</button>
        </form>

        <div
          className="d-flex gap-3 flex-lg-wrap"
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
        submitText={'Create Effect'}
        editable={true}
        isSaving={state.isSaving}
      />
    </div>
  );
}

export default CreateEffect;
