import React, {useContext, useState, useEffect} from 'react';
import AccordionItemBrand from './AccordionItemBrand';
import AccordionItemTeam from './AccordionItemTeam';
import AccordionItemCategory from './AccordionItemCategory';
import AccordionitemLensType from './AccordionItemLensType';
import AccordionItemLiveDate from './AccordionItemLiveDate';

import StateContext from '../Contexts/StateContext';
import DispatchContext from '../Contexts/DispatchContext';
import Axios from 'axios';

function EffectsSideBar() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const {brands, selectedBrands, team, category, lensType, startDate, endDate} =
    appState.filterEffects;
  const [isLoading, setIsLoading] = useState();
  const fetchBrands = async () => {
    if (isLoading) return;
    const brandRequest = Axios.CancelToken.source();

    try {
      setIsLoading(true);

      const response = await Axios.get(
        `${process.env.REACT_APP_API_URL}/brands?page=1&limit=99999&sort=name`
      );

      const brandsData = response.data.data.data;

      appDispatch({
        type: 'UPDATE_EFFECTS_FILTER',
        brands: brandsData,
        selectedBrands,
        team,
        category,
        lensType,
        startDate,
        endDate,
      });

      setIsLoading(false);

      return () => brandRequest.cancel();
    } catch (error) {
      console.log('Something went wrong.');
    }
  };

  const handleClickReset = () => {
    appDispatch({
      type: 'UPDATE_EFFECTS_FILTER',
      brands: [],
      selectedBrands: [],
      team: '',
      category: '',
      lensType: '',
      startDate: '',
      endDate: '',
    });

    appDispatch({
      type: 'UPDATE_EFFECTS',
      results: [],
      page: 1,
      submitCount: 0,
      query: '',
      sort: 'name',
    });

    window.location.reload();
  };

  useEffect(() => {
    fetchBrands();
  }, [brands.results]);

  return (
    <div className="accordion" id="accordion">
      <button onClick={handleClickReset} className="btn btn-secondary mb-3">
        Reset Filters
      </button>

      <AccordionItemBrand
        header={'Brands'}
        appState={appState}
        appDispatch={appDispatch}
      />
      <AccordionItemTeam
        header={'Team'}
        appState={appState}
        appDispatch={appDispatch}
      />
      <AccordionItemCategory
        header={'Category'}
        appState={appState}
        appDispatch={appDispatch}
      />
      <AccordionitemLensType
        header={'Lens Type'}
        appState={appState}
        appDispatch={appDispatch}
      />
      <AccordionItemLiveDate
        header={'Live Date'}
        appState={appState}
        appDispatch={appDispatch}
      />
    </div>
  );
}

export default EffectsSideBar;

// filterEffects: {
//    brands: {
//      value: [],
//      id: [],
//      selected: [],
//    },
//    team: '',
//    category: '',
//    startDate: new Date(),
//    endDate: new Date(),
//  },
