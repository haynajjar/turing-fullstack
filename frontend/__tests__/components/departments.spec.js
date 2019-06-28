
import ConnectedDepartments from '../../components/departments'
import { render, cleanup} from "@testing-library/react";
import { wait } from "@testing-library/dom";
import {renderWithRedux} from '../../lib/render-test-wrapper'


let renderVal = {}

beforeAll(() => {
	renderVal = renderWithRedux(<ConnectedDepartments />,{initialState: {department_id: -1}})
})

afterAll(cleanup)


describe('Departments', () => {

   
    it('should render with departments without error', async function () {
      await wait(() =>
		    expect(renderVal.getByTestId('departments')).toBeTruthy()
		)
  	})  

    it('should update the store department_id state when click', async function (){
    	await wait(() =>{
    		renderVal.getByTestId('departments').firstChild.click()
			expect(renderVal.store.getState().department_id).not.toEqual(-1)
    	})
    })

    it('element should be selected when click', async function (){
    	await wait(() =>{
    		renderVal.getByTestId('departments').lastChild.click()
			expect(renderVal.getByTestId('departments').lastChild.getAttribute('class')).toEqual(
				expect.stringContaining('Mui-selected')
			)	
    	})
    })
  	

})

