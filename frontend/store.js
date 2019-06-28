import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// generate 32 char for cart_id
function generateCardId(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return r.toString(16);
    });
    return uuid;
}

const exampleInitialState = {
  error: null,
  department_id: null,
  category_id: null,
  page_count: 6,
  page_size: 10,
  page: 1,
  cart_id: generateCardId(),
  cart_update: null,
  cart_attributes: "Size: S, Color: White",
  customer: null,
  checkout_step: 0,
  step_action: null,
  shipping_id: '0',
  checkout_error: null,
  keyword: '',
  price_range: [1,100]
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
  SET_PAGE_COUNT: 'SET_PAGE_COUNT',
  UPDATE_CART: 'UPDATE_CART',
  UPDATE_CART_ATTRIBUTES: 'UPDATE_CART_ATTRIBUTES',
  SAVE_USER: 'SAVE_USER',
  SET_CHECKOUT_STEP: 'SET_CHECKOUT_STEP',
  SET_SHIPPING_ID: 'SET_SHIPPING_ID',
  SET_CHECKOUT_ERROR: 'SET_CHECKOUT_ERROR',
  SET_KEYWORD: 'SET_KEYWORD',
  SET_PRICE_RANGE: 'SET_PRICE_RANGE',

  // action to trigger on the checkout steps
  // 0: trigger address submission, 1: trigger review , 2: trigger payment
  // this can be managed by a list of steps actions ... but we keep it simple for now

  SET_STEP_ACTION: 'SET_STEP_ACTION',
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
    case actionTypes.UPDATE_CART:
      return Object.assign({}, state, {
        cart_update: action.cart_update
      })
    case actionTypes.UPDATE_CART_ATTRIBUTES:
      return Object.assign({}, state, {
        cart_attributes: action.cart_attributes
      })
    case actionTypes.SAVE_USER:
      return Object.assign({}, state, {
        customer: action.customer
      })
    case actionTypes.SET_CHECKOUT_STEP:
      return Object.assign({}, state, {
        checkout_step: action.checkout_step
      })
    case actionTypes.SET_STEP_ACTION:
      return Object.assign({}, state, {
        step_action: action.step_action
      })
    case actionTypes.SET_SHIPPING_ID:
      return Object.assign({}, state, {
        shipping_id: action.shipping_id
      })
    case actionTypes.SET_CHECKOUT_ERROR:
      return Object.assign({}, state, {
        checkout_error: action.checkout_error
      })
    case actionTypes.SET_KEYWORD:
      return Object.assign({}, state, {
        keyword: action.keyword
      })
    case actionTypes.SET_PRICE_RANGE:
      return Object.assign({}, state, {
        price_range: action.price_range
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

export const setUpShoppingCart = (time) => {
  return { type: actionTypes.UPDATE_CART, cart_update: time}
}

export const updateCartAttributes = (attrs) => {
  // this is a particular case for the shop 
  // setup cart attributes as a global choice for the user
  // it may not work well for the user if the website presents different kind of products and options
  const attrStr = Object.keys(attrs).map((k,i) => k+": "+Object.values(attrs)[i]).join(', ')
  return { type: actionTypes.UPDATE_CART_ATTRIBUTES, cart_attributes: attrStr}
}

export const saveUser = (customer) => {
  return { type: actionTypes.SAVE_USER, customer: customer}
}

export const setCheckoutStep = (step) => {
  return { type: actionTypes.SET_CHECKOUT_STEP, checkout_step: step}
}

export const setStepAction = (step) => {
  return { type: actionTypes.SET_STEP_ACTION, step_action: step}
}

export const setShipping = (shipping_id) => {
  return { type: actionTypes.SET_SHIPPING_ID, shipping_id }
}

export const setCheckoutError = (checkout_error) => {
  return { type: actionTypes.SET_CHECKOUT_ERROR, checkout_error }
}

export const setKeyword = (keyword) => {
  return { type: actionTypes.SET_KEYWORD, keyword }
}

export const setPriceRange = (price_range) => {
  return { type: actionTypes.SET_PRICE_RANGE, price_range }
}

const persistConfig = {
  key: 'primary',
  storage,
  // we need to persist the following states, 
  whitelist: ['cart_id','cart_update','cart_attributes','customer','department_id','category_id','page','page_size','shipping_id'] 
}

const persistedReducer = persistReducer(persistConfig, reducer)

export function initializeStore (initialState = exampleInitialState) {
  return createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware())
  )
}
