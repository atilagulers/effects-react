import React, {useEffect} from 'react';

function Radio(props) {
  const capitalizeFirstLetter = (word) => {
    if (word.length <= 2) return word.toUpperCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return (
    <div className="form-check">
      <input
        onChange={props.handleChange}
        className="form-check-input"
        type="radio"
        name={props.name}
        id={props.value}
        value={props.value}
        checked={props.selectedValue === props.value}
      />
      <label className="form-check-label" htmlFor={props.value}>
        {props.value === '' ? 'All' : capitalizeFirstLetter(props.value)}
      </label>
    </div>
  );
}

export default Radio;
