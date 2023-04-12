import Axios from 'axios';

export const fetchBrands = async (
  e,
  appState,
  appDispatch,
  isLoading,
  setIsLoading,
  hasMore,
  setHasMore
) => {
  if (isLoading || !hasMore) return;
  const brandRequest = Axios.CancelToken.source();

  try {
    setIsLoading(true);
    //console.log(appState.searchBrands);
    console.log('FETCHING');
    //console.log(appState.searchBrands);
    const response = await Axios.get(
      `${process.env.REACT_APP_API_URL}/brands?page=${appState.searchBrands.page}&limit=20&sort=${appState.searchBrands.sort}&name=${appState.searchBrands.query}`
    );
    const brandsData = response.data.data.data;

    appDispatch({
      type: 'UPDATE_BRANDS',
      results: [...appState.searchBrands.results, ...brandsData],
      query: appState.searchBrands.query,
      page: appState.searchBrands.page + 1,
      sort: appState.searchBrands.sort,
    });

    if (brandsData.length === 0) {
      setHasMore(false);
    }

    setIsLoading(false);

    //appDispatch({
    //  type: 'UPDATE_BRANDS_PAGE',
    //  page: appState.searchBrands.page + 1,
    //});

    return () => brandRequest.cancel();
  } catch (error) {
    console.log(error);
    console.log('Something went wrong.');
  }
};
