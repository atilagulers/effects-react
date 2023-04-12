import React, {useContext, useState, useEffect} from 'react';
import EffectsSideBar from './EffectsSidebar';
import EffectCard from './EffectCard';
import Axios from 'axios';
import StateContext from '../Contexts/StateContext';
import DispatchContext from '../Contexts/DispatchContext';
import LoadingSpinner from './LoadingSpinner';
import {useInView} from 'react-intersection-observer';
import {useNavigate} from 'react-router-dom';

function Effects() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const {results, page, query, sort, submitCount} = appState.searchEffects;

  const [showCreateButton, setShowCreateButton] = useState(false);

  const {brands, selectedBrands, team, category, lensType, startDate, endDate} =
    appState.filterEffects;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState();
  const [hasMore, setHasMore] = useState(true);

  const {ref, inView} = useInView({
    threshold: 0,
  });

  const fetchBrandNameById = async (id) => {
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_API_URL}/brands/${id}`
      );

      const brandName = await response.data.data.name;

      return brandName;
    } catch (error) {
      return 'DELETED BRAND';
      //console.log(error);
    }
  };

  const fetchEffects = async () => {
    if (isLoading || !hasMore) return;

    const effectsRequest = Axios.CancelToken.source();

    try {
      setIsLoading(true);

      const brand = selectedBrands.length === 0 ? '' : selectedBrands;
      const response = await Axios.get(
        `${process.env.REACT_APP_API_URL}/effects?fields=name,brand,preview,icon&limit=20&page=${appState.searchEffects.page}&brand=${brand}&name=${query}&team=${team}&category=${category}&lensType=${lensType}&startDate=${startDate}&endDate=${endDate}&sort=${sort}`,
        {cancelToken: effectsRequest.token}
      );

      const effectData = response.data.data;

      const effectsWithBrandName = await Promise.all(
        effectData.map(async (data) => {
          const brandName = await fetchBrandNameById(data.brand);
          data.brand = brandName;
          return data;
        })
      );

      if (effectsWithBrandName.length === 0) {
        setHasMore(false);
      }

      appDispatch({
        type: 'UPDATE_EFFECTS',
        results: [...results, ...effectsWithBrandName],
        page: page + 1,
        query,
        sort,
        submitCount,
      });

      setIsLoading(false);

      return () => effectsRequest.cancel();
    } catch (error) {
      console.log('Something went wrong.');
    }
  };

  useEffect(() => {
    if (!inView) return;

    fetchEffects();
  }, [inView]);

  useEffect(() => {
    if (submitCount === 0) return;

    fetchEffects();
  }, [submitCount]);

  useEffect(() => {
    const permissions = appState.user.permissions;
    const createPermission = permissions.includes(
      'QREAL_EFFECTS_CREATE_EFFECT'
    );
    setShowCreateButton(createPermission);
  }, []);

  //useEffect(() => {
  //  console.log('fetch sort');
  //  fetchEffects();
  //}, [sort]);

  const handleChangeSearch = (e) => {
    e.preventDefault();
    setHasMore(true);

    appDispatch({
      type: 'UPDATE_EFFECTS',
      results,
      page,
      submitCount,
      query: e.target.value,
      sort,
    });
  };

  const handleChangeSort = (e) => {
    e.preventDefault();

    setHasMore(true);
    appDispatch({
      type: 'UPDATE_EFFECTS',
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
      type: 'UPDATE_EFFECTS',
      results: [],
      page: 1,
      submitCount: submitCount + 1,
      query,
      sort,
    });
    setHasMore(true);
  };

  //if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mb-5">
      {/*Search bar*/}

      <form
        className="d-flex justify-content-center mb-3 
      gap-3"
      >
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
          className="btn btn-primary "
        >
          Search
        </button>
        {showCreateButton && (
          <button
            onClick={() => navigate('/effects/create')}
            className="btn btn-success"
          >
            Create Effect
          </button>
        )}

        {/*SORT*/}
        <select
          onChange={handleChangeSort}
          defaultValue={sort}
          className="form-select form-select-sm"
          style={{maxWidth: '200px'}}
          //aria-label=".form-select-sm example"
        >
          <option value="name -liveDate">Name (A to Z)</option>
          <option value="-name -liveDate">Name (Z to A)</option>
          <option value="-liveDate name">Newest to Oldest</option>
          <option value="liveDate name">Oldest to Newest</option>
        </select>
      </form>

      <div className="d-flex">
        <div className="col-md-3 mt-3" style={{maxWidth: '200px'}}>
          <EffectsSideBar />
        </div>
        {/*Grid Area*/}

        <div className="container row row-cols-4 overflow-auto">
          {results?.map((effect, index) => {
            return (
              <EffectCard
                key={effect._id}
                id={effect._id}
                previewSrc={effect.preview}
                iconSrc={effect.icon}
                name={effect.name}
                brand={effect.brand}
                effects={appState.searchEffects.results}
              />
            );
          })}

          {isLoading && <LoadingSpinner />}
        </div>
      </div>
      <p ref={ref} disabled>
        {/*Load More*/}
      </p>
    </div>
  );
}

export default Effects;
