import React, {useEffect} from 'react';
import DatePicker from 'react-datepicker';
import FormError from './FormError';

function EffectForm(props) {
  const state = props.state;
  const dispatch = props.dispatch;

  return (
    <form className="needs-validation" style={{maxWidth: '480px'}}>
      {/* BRAND */}
      <div className="mb-3">
        {state.brand.hasErrors && <FormError message={state.brand.message} />}
        <select
          onBlur={(e) => dispatch({type: 'BRAND_RULES', value: e.target.value})}
          onChange={props.handleChangeBrand}
          className="form-select"
          defaultValue={state.brand.value}
          required
          disabled={!props.editable}
        >
          <option value="" disabled>
            Select Brand
          </option>
          {state.brands.value.map((brandName, index) => (
            <option
              value={brandName}
              id={state.brands.id[index]}
              key={state.brands.id[index]}
            >
              {brandName}
            </option>
          ))}
        </select>
      </div>

      {/* NAME */}
      <div className="mb-3">
        {state.name.hasErrors && <FormError message={state.name.message} />}

        <input
          onBlur={(e) => dispatch({type: 'NAME_RULES', value: e.target.value})}
          onChange={(e) =>
            dispatch({type: 'NAME_CHANGE', value: e.target.value})
          }
          value={state.name.value}
          type="text"
          className="form-control"
          id="name"
          required={true}
          placeholder="Effect Name"
          disabled={!props.editable}
        />
      </div>

      {/* TEAM */}
      <div className="mb-3">
        {state.team.hasErrors && <FormError message={state.team.message} />}
        <select
          onBlur={(e) => dispatch({type: 'TEAM_RULES', value: e.target.value})}
          onChange={(e) =>
            dispatch({type: 'TEAM_CHANGE', value: e.target.value})
          }
          className="form-select"
          defaultValue={state.team.value}
          required
          disabled={!props.editable}
        >
          <option value="" disabled>
            Select Team
          </option>
          <option value="Contact">Contact</option>
          <option value="Neuromancer">Neuromancer</option>
          <option value="Ubik">Ubik</option>
        </select>
      </div>
      {/* CATEGORY */}
      <div className="mb-3">
        {state.category.hasErrors && (
          <FormError message={state.category.message} />
        )}
        <select
          onBlur={(e) =>
            dispatch({type: 'CATEGORY_RULES', value: e.target.value})
          }
          onChange={(e) =>
            dispatch({type: 'CATEGORY_CHANGE', value: e.target.value})
          }
          className="form-select"
          defaultValue={state.category.value}
          required
          disabled={!props.editable}
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="Beauty">Beauty</option>
          <option value="Consumer Goods">Consumer Goods</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Retail">Retail</option>
          <option value="Technology">Technology</option>
          <option value="Other">Other</option>
        </select>
      </div>
      {/* LENS TYPE */}
      <div className="mb-3">
        {state.lensType.hasErrors && (
          <FormError message={state.lensType.message} />
        )}
        <select
          onBlur={(e) =>
            dispatch({type: 'LENS_TYPE_RULES', value: e.target.value})
          }
          onChange={(e) =>
            dispatch({type: 'LENS_TYPE_CHANGE', value: e.target.value})
          }
          className="form-select"
          defaultValue={state.lensType.value}
          required
          disabled={!props.editable}
        >
          <option value="" disabled>
            Select Lens Type
          </option>
          <option value="LL">LL</option>
          <option value="Core">Core</option>
          <option value="Bespoke">Bespoke</option>
          <option value="Innovation">Innovation</option>
        </select>
      </div>

      {/* LIVE DATE */}
      <div className="mb-3">
        {state.liveDate.hasErrors && (
          <FormError message={state.liveDate.message} />
        )}
        <DatePicker
          onBlur={(e) =>
            dispatch({type: 'LIVE_DATE_RULES', value: e.target.value})
          }
          onChange={(date) => {
            dispatch({type: 'LIVE_DATE_CHANGE', value: date});
          }}
          //value={selectedLiveDate}
          selected={state.liveDate.value}
          value={state.liveDate.value}
          className=""
          wrapperClassName="datePicker"
          required
          disabled={!props.editable}
          //selected={startDate}
          //onChange={(date) => setSelectedLiveDate(date)}
        />
      </div>

      {/* PREVIEW */}
      <div className="mb-3">
        {state.preview.hasErrors && (
          <FormError message={state.preview.message} />
        )}
        <label htmlFor="previewFile" className="form-label m-0 mb-1">
          Preview Image
        </label>
        <input
          onBlur={(e) =>
            dispatch({type: 'PREVIEW_RULES', value: e.target.value})
          }
          onChange={props.handleChangePreview}
          className="form-control"
          type="file"
          id="previewFile"
          accept="image/jpg, image/jpeg, image/png"
          //required
          disabled={!props.editable}
        />
      </div>
      {/* ICON */}
      <div className="mb-3">
        {state.icon.hasErrors && <FormError message={state.icon.message} />}
        <label htmlFor="iconFile" className="form-label m-0">
          Effect Icon
        </label>
        <input
          onBlur={(e) => dispatch({type: 'ICON_RULES', value: e.target.value})}
          onChange={props.handleChangeIcon}
          className="form-control"
          type="file"
          id="iconFile"
          accept="image/png"
          //required
          disabled={!props.editable}
        />
      </div>

      {/* DRIVE URL */}
      <div className="mb-3">
        {state.driveUrl.hasErrors && (
          <FormError message={state.driveUrl.message} />
        )}
        <input
          onBlur={(e) =>
            dispatch({type: 'DRIVE_URL_RULES', value: e.target.value})
          }
          onChange={(e) =>
            dispatch({type: 'DRIVE_URL_CHANGE', value: e.target.value})
          }
          defaultValue={state.driveUrl.value}
          type="text"
          className="form-control"
          id="drive-url"
          placeholder="Drive Url"
          required
          disabled={!props.editable}
        />
      </div>
      {/* EFFECT URL */}
      <div className="mb-3">
        {state.effectUrl.hasErrors && (
          <FormError message={state.effectUrl.message} />
        )}

        <input
          onBlur={(e) =>
            dispatch({type: 'EFFECT_URL_RULES', value: e.target.value})
          }
          onChange={(e) =>
            dispatch({type: 'EFFECT_URL_CHANGE', value: e.target.value})
          }
          defaultValue={state.effectUrl.value}
          type="text"
          className="form-control"
          id="effect-url"
          placeholder="Effect Url"
          required
          disabled={!props.editable}
        />
      </div>
      {/* VIDEO URL */}
      {state.videoUrl.hasErrors && (
        <FormError message={state.videoUrl.message} />
      )}
      <div className="mb-3">
        <input
          onBlur={(e) =>
            dispatch({type: 'VIDEO_URL_RULES', value: e.target.value})
          }
          onChange={(e) =>
            dispatch({type: 'VIDEO_URL_CHANGE', value: e.target.value})
          }
          defaultValue={state.videoUrl.value}
          type="text"
          className="form-control"
          id="video-url"
          placeholder="Video Url"
          disabled={!props.editable}
        />
      </div>
      {/* SUBMIT BUTTON */}
      <div className="mb-3">
        {props.hideSubmit ? (
          ''
        ) : (
          <button
            onClick={props.handleSubmit}
            type="click"
            className="btn btn-primary btn btn-block"
            style={{minWidth: '480px', margin: 'auto'}}
            disabled={state.isSaving}
          >
            {props.submitText}
          </button>
        )}
      </div>
    </form>
  );
}

export default EffectForm;
