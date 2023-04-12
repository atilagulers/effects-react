import React, {useEffect, useState} from 'react';
import FormError from './FormError';
import Axios from 'axios';

function BrandForm(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState([]);

  const fetchBrands = async () => {
    if (isLoading) return;
    const brandRequest = Axios.CancelToken.source();

    try {
      setIsLoading(true);

      const response = await Axios.get(
        `${process.env.REACT_APP_API_URL}/brands?page=1&limit=999999`
      );
      const brandsData = response.data.data.data;

      setBrands(brandsData);
      setIsLoading(false);

      return () => brandRequest.cancel();
    } catch (error) {
      console.log(error);
      console.log('Something went wrong.');
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  function handleBrandChange(event) {
    const brandName = event.target.value.trim();
    const similarBrand = brands.find(
      (brand) => brand.name.toLowerCase() === brandName.toLowerCase()
    );

    if (similarBrand) {
      props.dispatch({
        type: 'BRAND_RULES',
        value: brandName,
        hasErrors: true,
        message:
          'A similar brand already exists. Please choose a different name.',
      });
    } else {
      props.dispatch({type: 'BRAND_RULES', value: brandName, hasErrors: false});
    }
    props.dispatch({type: 'BRAND_CHANGE', value: brandName});
  }

  return (
    <div>
      <div className="container mt-lg-5 d-flex flex-column align-items-center justify-content-center gap-lg-5">
        {/*PREVIEW*/}
        <img
          className="rounded-circle shadow-lg"
          src={props.iconUrl ? props.iconUrl : 'https://placehold.co/128x128'}
          alt=""
          style={{width: '128px', height: '128px', objectFit: 'cover'}}
        />
        <form className="needs-validation">
          {/* BRAND */}
          <div className="mb-3">
            {props.state.brand.hasErrors && (
              <FormError message={props.state.brand.message} />
            )}

            <input
              onBlur={(e) =>
                props.dispatch({type: 'BRAND_RULES', value: e.target.value})
              }
              onChange={handleBrandChange}
              defaultValue={props.state.brand.value}
              type="text"
              className="form-control"
              id="name"
              required={true}
              placeholder="Brand Name"
              disabled={!props.editable}
              autoFocus
            />
          </div>
          {/* ICON */}
          <div className="">
            {props.state.icon.hasErrors && (
              <FormError message={props.state.icon.message} />
            )}
            <label htmlFor="iconFile" className="form-label m-0">
              Icon Image
            </label>
            <input
              onBlur={(e) =>
                props.dispatch({type: 'ICON_RULES', value: e.target.value})
              }
              onChange={props.handleChangeIcon}
              className="form-control mb-lg-4"
              type="file"
              id="iconFile"
              accept="image/png"
              required
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
                disabled={props.state.isSaving}
              >
                {props.submitText}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default BrandForm;
