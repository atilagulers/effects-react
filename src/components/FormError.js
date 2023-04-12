import React, {useEffect} from 'react';

function FormError(props) {
  return (
    <div
      className="alert alert-danger small liveValidateMessage m-0 p-0"
      style={{height: '24px'}}
    >
      {props.message}
    </div>
  );
}

export default FormError;
