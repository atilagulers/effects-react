import React, {useEffect, useState} from 'react';
import Radio from './Radio';

function AccordionItemTeam(props) {
  const [isActive, setIsActive] = useState(true);
  //const [isLoading, setIsLoading] = useState();

  const {brands, selectedBrands, team, category, lensType, startDate, endDate} =
    props.appState.filterEffects;
  const appDispatch = props.appDispatch;

  const handleClick = () => {
    setIsActive((current) => !current);
  };

  const handleChangeTeam = (e) => {
    appDispatch({
      type: 'UPDATE_EFFECTS_FILTER',
      brands,
      selectedBrands,
      team: e.target.value,
      category,
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
            selectedValue={team}
            name={'team'}
            handleChange={handleChangeTeam}
          />
          <Radio
            value={'contact'}
            selectedValue={team}
            name={'team'}
            handleChange={handleChangeTeam}
          />
          <Radio
            value={'neuromancer'}
            selectedValue={team}
            name={'team'}
            handleChange={handleChangeTeam}
          />
          <Radio
            value={'ubik'}
            selectedValue={team}
            name={'team'}
            handleChange={handleChangeTeam}
          />
        </div>
      </div>
    </div>
  );
}

export default AccordionItemTeam;
//      onChange={(e) => console.log(e.target.value)}
