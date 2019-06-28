import {initializeStore} from '../store'
import { render } from "@testing-library/react";
import { Provider } from 'react-redux'
import { Provider as UrqlProvider, createClient } from 'urql';


const __NEXT_REDUX_STORE_TEST__ = '__NEXT_REDUX_STORE_TEST__'

function getOrCreateStore (initialState) {
  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE_TEST__]) {
    window[__NEXT_REDUX_STORE_TEST__] = initializeStore(initialState)
  }
  return window[__NEXT_REDUX_STORE_TEST__]
}


const client = createClient({
 // use dev server 
 // TODO update for test server and launch to test server at the starting of test
  url: 'http://localhost:3000/graphql',
});


export function renderWithRedux(
  ui,
  {initialState, store = getOrCreateStore} = {},
) {
  return {
    ...render(
	        <UrqlProvider value={client}>
	          <Provider store={store(initialState)}>
	              {ui}
	          </Provider>
	        </UrqlProvider>
    	),
    store: store(),
  }
}