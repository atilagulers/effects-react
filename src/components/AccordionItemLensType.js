import React, {useEffect, useState} from 'react';
import Radio from './Radio';

function AccordionItemCategory(props) {
  const [isActive, setIsActive] = useState(true);
  //const [isLoading, setIsLoading] = useState();

  const {brands, selectedBrands, team, category, lensType, startDate, endDate} =
    props.appState.filterEffects;
  const appDispatch = props.appDispatch;

  const handleClick = () => {
    setIsActive((current) => !current);
  };

  const handleChangeLensType = (e) => {
    console.log(e.target.value);
    appDispatch({
      type: 'UPDATE_EFFECTS_FILTER',
      brands,
      selectedBrands,
      team,
      category,
      lensType: e.target.value,
      startDate,
      endDate,
    });
  };

  return (
    <div className="accordion-item ">
      <h2 className="accordion-header">
        <button
          onClick={handleClick}
          className={`accordion-button ${isActive ? 'collapsed' : ''}`}
          type="button"
        >
          {props.header}
        </button>
      </h2>
      <div className={`accordion-collapse collapse  ${isActive ? '' : 'show'}`}>
        <div className="accordion-body">
          <Radio
            value={''}
            selectedValue={lensType}
            name={'lensType'}
            handleChange={handleChangeLensType}
          />
          <Radio
            value={'ll'}
            selectedValue={lensType}
            name={'lensType'}
            handleChange={handleChangeLensType}
          />
          <Radio
            value={'core'}
            selectedValue={lensType}
            name={'lensType'}
            handleChange={handleChangeLensType}
          />
          <Radio
            value={'bespoke'}
            selectedValue={lensType}
            name={'lensType'}
            handleChange={handleChangeLensType}
          />
          <Radio
            value={'innovation'}
            selectedValue={lensType}
            name={'lensType'}
            handleChange={handleChangeLensType}
          />
        </div>
      </div>
    </div>
  );
}

export default AccordionItemCategory;
//      onChange={(e) => console.log(e.target.value)}
