import React, {useContext, useEffect, useState} from 'react';
import StateContext from '../Contexts/StateContext';
import DispatchContext from '../Contexts/DispatchContext';
import {useNavigate} from 'react-router-dom';
import Axios from 'axios';
import {useInView} from 'react-intersection-observer';
import LoadingSpinner from './LoadingSpinner';
import BrandTableData from './BrandTableData';

function Brands() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const {results, page, query, sort, submitCount} = appState.searchBrands;
  const [showCreateButton, setShowCreateButton] = useState(false);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const {ref, inView} = useInView({
    threshold: 0,
  });

  const fetchBrands = async (e) => {
    if (isLoading || !hasMore) return;
    const brandRequest = Axios.CancelToken.source();

    try {
      setIsLoading(true);

      const response = await Axios.get(
        `${process.env.REACT_APP_API_URL}/brands?page=${page}&limit=20&sort=${sort}&name=${query}`
      );
      const brandsData = response.data.data.data;

      if (brandsData.length === 0) {
        setHasMore(false);
      }

      appDispatch({
        type: 'UPDATE_BRANDS',
        results: [...results, ...brandsData],
        page: page + 1,
        query,
        sort,
        submitCount,
      });

      setIsLoading(false);

      return () => brandRequest.cancel();
    } catch (error) {
      console.log('Something went wrong.');
    }
  };

  useEffect(() => {
    if (!inView) return;
    fetchBrands();
  }, [inView]);

  useEffect(() => {
    if (submitCount === 0) return;

    fetchBrands();
  }, [submitCount]);

  useEffect(() => {
    fetchBrands();
  }, [sort]);

  useEffect(() => {
    const permissions = appState.user.permissions;
    const createPermission = permissions.includes(
      'QREAL_EFFECTS_CREATE_EFFECT'
    );
    setShowCreateButton(createPermission);
  }, []);

  const handleChangeSort = (e) => {
    e.preventDefault();

    appDispatch({
      type: 'UPDATE_BRANDS',
      results: [],
      page: 1,
      submitCount,
      query,
      sort: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    appDispatch({
      type: 'UPDATE_BRANDS',
      results: [],
      page: 1,
      submitCount: submitCount + 1,
      query,
      sort,
    });
    setHasMore(true);
  };

  const handleChangeSearch = (e) => {
    e.preventDefault();

    appDispatch({
      type: 'UPDATE_BRANDS',
      results,
      page,
      submitCount,
      query: e.target.value,
      sort,
    });
  };

  //if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mb-5" style={{maxWidth: '900px'}}>
      {/*Search bar*/}
      {/*<button onClick={handleClickLoad}>Load More</button>*/}
      <form className="d-flex justify-content-center mb-4 gap-3">
        <input
          onChange={handleChangeSearch}
          defaultValue={query}
          type="text"
          style={{maxWidth: '25rem'}}
          className="form-control"
          placeholder="Search"
        />
        <button
          onClick={handleSubmit}
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          Search
        </button>
        {showCreateButton && (
          <button
            onClick={() => navigate('/brands/create')}
            type="button"
            className="btn btn-success"
          >
            Create Brand
          </button>
        )}
        {/*SORT*/}

        <select
          onChange={handleChangeSort}
          defaultValue={sort}
          className="form-select form-select-sm "
          style={{maxWidth: '200px'}}
          //aria-label=".form-select-sm example"
        >
          <option
            //data-content={'<i class="bi bi-sort-alpha-down"></i>'}
            value="name"
          >
            Name (A to Z)
          </option>
          <option
            //data-content={'<i class="bi bi-sort-alpha-down"></i>'}
            value="-name"
          >
            Name (Z to A)
          </option>
        </select>
      </form>

      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Icon</th>
            <th scope="col">Brand</th>
          </tr>
        </thead>
        <tbody>
          {results?.map((brand, index) => {
            return (
              <BrandTableData
                brand={brand}
                index={index}
                key={brand._id}
                id={brand._id}
              />
            );
          })}
        </tbody>
      </table>
      {isLoading && <LoadingSpinner />}
      <p ref={ref} disabled>
        {/*Load More*/}
      </p>
    </div>
  );
}

export default Brands;
