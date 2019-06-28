
import ConnectedCategories from '../../components/categories'
import { render, cleanup} from "@testing-library/react";
import { wait } from "@testing-library/dom";
import {renderWithRedux} from '../../lib/render-test-wrapper'


let renderVal = {}

beforeAll(() => {
	renderVal = renderWithRedux(<ConnectedCategories />,{initialState: {department_id: 1,category_id: -1}})
})

afterAll(cleanup)


describe('Categories', () => {

    it('should render with categories without error', async function () {
      await wait(() =>
		    expect(renderVal.getByTestId('categories')).toBeTruthy()
		)
  	})  

    it('should update the store category_id state when click', async function (){
    	await wait(() =>{
    		renderVal.getByTestId('categories').firstChild.click()
			  expect(renderVal.store.getState().category_id).not.toEqual(-1)
    	})
    })

    it('element should be selected when click', async function (){
    	await wait(() =>{
    		renderVal.getByTestId('categories').lastChild.click()
  			expect(renderVal.getByTestId('categories').lastChild.getAttribute('class')).toEqual(
  				expect.stringContaining('Mui-selected')
  			)	
    	})
    })
  	

})

