import React, {useEffect} from 'react';
import DatePicker from 'react-datepicker';

function FilterDatePicker(props) {
  return (
    <div className="accordion-body pb-0">
      <div className="form-check mb-2 ">
        <input
          onChange={props.handleChangeCheck}
          className="form-check-input"
          type="checkbox"
          value=""
          id={props.checkboxText}
          checked={props.checked}
        />
        <label className="form-check-label" htmlFor={props.checkboxText}>
          {props.checkboxText}
        </label>
      </div>
      <div className={`${props.showDate ? '' : 'd-none'} border-bottom `}>
        <small className="datepicker__title" htmlFor={props.checkboxText}>
          {' '}
          (MM/DD/YY)
        </small>
        <DatePicker
          id="startDate"
          selected={props.selected}
          onChange={props.handleChangeDate}
          selectsStart
          startDate={props.startDate}
          endDate={props.endDate}
          className={'mb-3 mt-1'}
          showPopper={false}
        />
      </div>
    </div>
  );
}

export default FilterDatePicker;
