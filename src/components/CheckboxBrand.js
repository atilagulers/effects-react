import React, {useEffect, useContext} from 'react';

function CheckboxBrand(props) {
  const {brands, selectedBrands, team, category, lensType, startDate, endDate} =
    props.appState.filterEffects;

  const handleChange = (e) => {
    const checked = e.target.checked;
    const brandId = props.id;

    if (checked) {
      props.appDispatch({
        type: 'UPDATE_EFFECTS_FILTER',
        brands,
        selectedBrands: [...selectedBrands, brandId],
        team,
        category,
        lensType,
        startDate,
        endDate,
      });
    } else {
      const updatedBrands = removeMatchingValue(selectedBrands, brandId);

      props.appDispatch({
        type: 'UPDATE_EFFECTS_FILTER',
        brands,
        selectedBrands: updatedBrands,
        team,
        category,
        lensType,
        startDate,
        endDate,
      });
    }
  };

  const removeMatchingValue = (arr, value) =>
    arr.filter((item) => item !== value);

  return (
    <div className="form-check">
      <input
        onChange={handleChange}
        className="form-check-input"
        type="checkbox"
        value=""
        id={props.id}
        //checked={false}
      />
      <label className="form-check-label" htmlFor={props.id}>
        {props.name}
      </label>
    </div>
  );
}

export default CheckboxBrand;
