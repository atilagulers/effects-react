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

  const handleChangeCategory = (e) => {
    appDispatch({
      type: 'UPDATE_EFFECTS_FILTER',
      brands,
      selectedBrands,
      team,
      category: e.target.value,
      lensType,
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
            selectedValue={category}
            name={'category'}
            handleChange={handleChangeCategory}
          />
          <Radio
            value={'beauty'}
            selectedValue={category}
            name={'category'}
            handleChange={handleChangeCategory}
          />
          <Radio
            value={'consumer goods'}
            selectedValue={category}
            name={'category'}
            handleChange={handleChangeCategory}
          />
          <Radio
            value={'entertainment'}
            selectedValue={category}
            name={'category'}
            handleChange={handleChangeCategory}
          />
          <Radio
            value={'healthcare'}
            selectedValue={category}
            name={'category'}
            handleChange={handleChangeCategory}
          />
          <Radio
            value={'restaurant'}
            selectedValue={category}
            name={'category'}
            handleChange={handleChangeCategory}
          />
          <Radio
            value={'retail'}
            selectedValue={category}
            name={'category'}
            handleChange={handleChangeCategory}
          />
          <Radio
            value={'technology'}
            selectedValue={category}
            name={'category'}
            handleChange={handleChangeCategory}
          />
          <Radio
            value={'other'}
            selectedValue={category}
            name={'category'}
            handleChange={handleChangeCategory}
          />
        </div>
      </div>
    </div>
  );
}

export default AccordionItemCategory;
//      onChange={(e) => console.log(e.target.value)}
