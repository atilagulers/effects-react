import React, {useEffect, useState} from 'react';
import FilterDatePicker from './FilterDatePicker';

function AccordionItemLiveDate(props) {
  const [isActive, setIsActive] = useState(true);
  //const [isLoading, setIsLoading] = useState();

  const {brands, selectedBrands, team, category, lensType, startDate, endDate} =
    props.appState.filterEffects;
  const appDispatch = props.appDispatch;

  const [showStartDate, setShowStartDate] = useState(startDate);
  const [showEndDate, setShowEndDate] = useState(endDate);

  const handleClick = () => {
    setIsActive((current) => !current);
  };

  const handleChangeStartDate = (date) => {
    appDispatch({
      type: 'UPDATE_EFFECTS_FILTER',
      brands,
      selectedBrands,
      team,
      category,
      lensType,
      startDate: date,
      endDate,
    });
  };

  const handleChangeEndDate = (date) => {
    appDispatch({
      type: 'UPDATE_EFFECTS_FILTER',
      brands,
      selectedBrands,
      team,
      category,
      lensType,
      startDate,
      endDate: date,
    });
  };

  const handleChangeStartCheck = (e) => {
    const checked = e.target.checked;

    if (checked) {
      appDispatch({
        type: 'UPDATE_EFFECTS_FILTER',
        brands,
        selectedBrands,
        team,
        category,
        lensType,
        startDate: new Date('12-01-2000'),
        endDate,
      });
      setShowStartDate(true);
    } else {
      appDispatch({
        type: 'UPDATE_EFFECTS_FILTER',
        brands,
        selectedBrands,
        team,
        category,
        lensType,
        startDate: '',
        endDate,
      });
      setShowStartDate(false);
    }
  };

  const handleChangeEndCheck = (e) => {
    const checked = e.target.checked;

    if (checked) {
      appDispatch({
        type: 'UPDATE_EFFECTS_FILTER',
        brands,
        selectedBrands,
        team,
        category,
        lensType,
        startDate,
        endDate: new Date(),
      });
      setShowEndDate(true);
    } else {
      appDispatch({
        type: 'UPDATE_EFFECTS_FILTER',
        brands,
        selectedBrands,
        team,
        category,
        lensType,
        startDate,
        endDate: '',
      });
      setShowEndDate(false);
    }
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
        <FilterDatePicker
          isStartDate={true}
          handleChangeCheck={handleChangeStartCheck}
          handleChangeDate={handleChangeStartDate}
          startDate={startDate}
          endDate={endDate}
          showDate={showStartDate}
          checked={startDate}
          selected={startDate}
          checkboxText="Start Date"
        />

        <FilterDatePicker
          isStartDate={false}
          handleChangeCheck={handleChangeEndCheck}
          handleChangeDate={handleChangeEndDate}
          startDate={startDate}
          endDate={endDate}
          showDate={showEndDate}
          checked={endDate}
          selected={endDate}
          checkboxText="End Date"
        />
      </div>
    </div>
  );
}

export default AccordionItemLiveDate;

// {
//   /*<div className="form-check mb-2 ">
//          <input
//            className="form-check-input"
//            type="checkbox"
//            value=""
//            id="endDate"
//            checked={endDate}
//          />
//          <label className="form-check-label" htmlFor="endDate">
//            End Date
//          </label>
//        </div>
//        <div>
//          <small className="datepicker__title" htmlFor="endDate">
//            {' '}
//            End Date (MM/DD/YY)
//          </small>

//          <DatePicker
//            id="endDate"
//            selected={endDate}
//            onChange={handleChangeEndDate}
//            selectsEnd
//            startDate={startDate}
//            endDate={endDate}
//            minDate={startDate}
//          />
//        </div>*/
// }
