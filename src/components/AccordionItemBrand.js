import React, {useEffect, useState, useContext} from 'react';
import CheckboxBrand from './CheckboxBrand';

function AccordionItemBrand(props) {
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState();
  const {brands} = props.appState.filterEffects;

  function handleClick() {
    setIsActive((current) => !current);
  }

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
      <div
        className={`accordion-collapse collapse ms-3 ${isActive ? '' : 'show'}`}
      >
        <div
          className="accordion-body overflow-scroll"
          style={{maxHeight: '300px'}}
        >
          {brands?.map((brand) => {
            return (
              <CheckboxBrand
                name={brand.name}
                id={brand._id}
                key={brand._id}
                appState={props.appState}
                appDispatch={props.appDispatch}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AccordionItemBrand;
