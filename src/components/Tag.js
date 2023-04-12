import React, {useEffect} from 'react';

function Tag(props) {
  return (
    <span className="badge bg-secondary d-flex justify-content-center align-items-center gap-2 d-inline-flex ">
      {props.tag}{' '}
      {props.editable ? (
        <i
          onClick={(e) => props.onClick(e, props.id)}
          role="button"
          className="bi bi-x-circle-fill "
        ></i>
      ) : (
        ''
      )}
    </span>
  );
}

export default Tag;
