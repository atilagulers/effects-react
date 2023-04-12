import React, {useEffect} from 'react';

function LoadingSpinner() {
  return (
    <div className="d-flex align-items-center justify-content-center col-12">
      <div
        className="spinner-border ml-auto"
        role="status"
        aria-hidden="true"
      ></div>
    </div>
  );
}

export default LoadingSpinner;
