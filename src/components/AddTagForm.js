import React, {useEffect} from 'react';

function AddTagForm(props) {
  return (
    <form
      id="create-tag-form"
      onSubmit={props.handleSubmit}
      className="d-flex gap-2 needs-validation "
    >
      <input
        type="text"
        name="tag"
        className="form-control"
        required
        id="tag"
        placeholder="Add Tag"
      />
      <button className="btn btn-primary m-0">Add</button>
    </form>
  );
}

export default AddTagForm;
