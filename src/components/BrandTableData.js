import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

function BrandTableData(props) {
  const navigate = useNavigate();

  return (
    <tr
      style={{cursor: 'pointer'}}
      id={props.id}
      onClick={() => navigate(props.id)}
    >
      <th scope="row">{props.index + 1}</th>
      <td>
        <img
          className="rounded-circle"
          src={props.brand.icon}
          alt=""
          style={{
            width: '32px',
            height: '32px',
            objectFit: 'cover',
          }}
        />
      </td>
      <td>{props.brand.name}</td>
    </tr>
  );
}

export default BrandTableData;
