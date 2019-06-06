import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const exampleInitialState = {
  error: null,
  department_id: null,
  category_id: null,
  page_count: 6,
  page_size: 10,
  page: 1
}

export const actionTypes = {
  TICK: 'TICK',
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  RESET: 'RESET',
  LOAD_EXAMPLE_DATA: 'LOAD_EXAMPLE_DATA',
  LOADING_DATA_FAILURE: 'LOADING_DATA_FAILURE',
  SELECT_DEPARTMENT: 'SELECT_DEPARTMENT',
  SELECT_CATEGORY: 'SELECT_CATEGORY',
  SET_PAGE: 'SET_PAGE',
  SET_PAGE_SIZE: 'SET_PAGE_SIZE',
  SET_PAGE_COUNT: 'SET_PAGE_COUNT'
}

// REDUCERS
export const reducer = (state = exampleInitialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_DEPARTMENT:
      return Object.assign({}, state, {
        department_id: action.department_id
      })
    case actionTypes.SELECT_CATEGORY:
      return Object.assign({}, state, {
        category_id: action.category_id
      })
    case actionTypes.SET_PAGE:
      return Object.assign({}, state, {
        page: action.page
      })
    case actionTypes.SET_PAGE_SIZE:
      return Object.assign({}, state, {
        page_size: action.page_size
      })
    case actionTypes.SET_PAGE_COUNT:
      return Object.assign({}, state, {
        page_count: action.page_count
      })
   
    default:
      return state
  }
}

// ACTIONS

export const selectDepartment = (department_id) =>{
  return { type: actionTypes.SELECT_DEPARTMENT, department_id }
}

export const selectCategory = (category_id) =>{
  return { type: actionTypes.SELECT_CATEGORY, category_id }
}

export const setPageSize = (page_size) =>{
  return { type: actionTypes.SET_PAGE_SIZE, page_size }
}
export const setPageCount = (page_count) =>{
  return { type: actionTypes.SET_PAGE_COUNT, page_count }
}
export const setPage = (page) =>{
  return { type: actionTypes.SET_PAGE, page }
}

const persistConfig = {
  key: 'primary',
  storage,
  whitelist: [] // place to select which state you want to persist
}

const persistedReducer = persistReducer(persistConfig, reducer)

export function initializeStore (initialState = exampleInitialState) {
  return createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware())
  )
}
