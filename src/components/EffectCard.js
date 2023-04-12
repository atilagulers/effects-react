import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function EffectCard(props) {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  function handleClickCard(e) {
    if (props.disableClick) return;
    e.preventDefault();
    navigate(`${props.id}`);
  }

  return (
    <div
      onClick={handleClickCard}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`card col-auto  bg-light m-3 p-0 d-flex flex-column  ${
        hover ? 'shadow ' : ''
      }`}
      style={{
        minWidth: '180px',
        maxWidth: '180px',
        minHeight: '300px',
        maxHeight: '390px',
        cursor: 'pointer',
      }}
    >
      <div className="d-flex justify-content-center">
        <img
          //onLoad={(e) => console.log(e.target.src)}
          className="card-img-top"
          src={
            props.previewSrc ? props.previewSrc : 'https://placehold.co/180x300'
          }
          alt="Preview"
          style={{
            width: '180px',
            objectFit: 'cover',
            width: '180px',
            height: '300px',
          }}
        />
        <div className="d-flex rounded-circle position-absolute top-50 mt-5 ">
          <img
            className="rounded-circle mt-2"
            src={props.iconSrc ? props.iconSrc : 'https://placehold.co/64x64'}
            alt="Icon"
            style={{width: '64px', height: '64px', objectFit: 'cover'}}
          />
        </div>
      </div>

      {/*<div className="card-header">Nike March Madness</div>*/}
      <div className="card-body overflow-hidden d-flex flex-column align-items-center justify-content-center">
        <p
          className="card-title fw-bold text-center mb-sm-1 "
          style={{
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {props.name}
        </p>
        <p
          className="card-text text-center"
          style={{
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {props.brand}
        </p>
      </div>
    </div>
  );
}

export default EffectCard;
