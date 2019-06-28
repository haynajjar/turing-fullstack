
import ConnectedProducts from '../components/products'
import ConnectedProductDetails from '../components/product-details'
import ConnectedShoppingCart from '../components/shopping-cart'
import { render, cleanup} from "@testing-library/react";
import { wait } from "@testing-library/dom";
import {renderWithRedux} from '../lib/render-test-wrapper'

// NOTE - please make sure you understand all the use cases before updating this file
// the user add to cart then remove from cart , if the test "add to cart" is removed the test "remove from cart" will fail

const initialState = {
                        department_id: 1,
                        page: 1, 
                        page_size: 10, 
                        cart_update: null,
                        cart_id: 'testcart_xxxxxxxxxxxxxxxxxxxxxxx',
                        cart_attributes: 'Size: S, Color: White'
                      }



afterAll(cleanup)
let renderVal = {}


describe('Shopping', () => {

   describe('Products', () => {


      beforeAll(() => {
        renderVal = renderWithRedux(<ConnectedProducts />,{initialState})
      })
    
      it('should render with products without error', async function () {
        await wait(() =>
          expect(renderVal.getByTestId('products')).toBeTruthy()
        )
      })  

      it('should have at least one product in the first department', async function (){
      	await wait(() =>{
          expect(renderVal.getAllByText("Add to cart").length).toBeGreaterThan(0)
      	})
      })
   
      it('should update cart when we click add to cart button', async function (){
        await wait(() =>{
          renderVal.getAllByText("Add to cart")[0].click()        
          const cart_update = renderVal.store.getState().cart_update
          initialState.cart_update = cart_update
          expect(cart_update).not.toBe(null)
        })
      })

   })

 

   describe('Product Details', () => {

      beforeAll(() => {
        renderVal = renderWithRedux(<ConnectedProductDetails product_id={1} />,{initialState})
      })
    
      it('should render product details without error', async function () {
        await wait(() =>
          expect(renderVal.getByTestId('product-details')).toBeTruthy()
        )
      })  

      it('should have attributes XL & Red', async function () {
        await wait(() => {
            expect(renderVal.getByText('XL')).toBeTruthy()
            expect(renderVal.getByText('Red')).toBeTruthy()
          }
        )
      })  

      it('should update the cart attributes with XL and Red', async function () {
        await wait(() =>{
            renderVal.getByText('XL').click()
            renderVal.getByText('Red').click()
            expect(renderVal.store.getState().cart_attributes).toEqual('Size: XL, Color: Red')
          }
        )
      })  

   })


   describe('Cart Details', () => {

      beforeAll(() => {
        renderVal = renderWithRedux(<ConnectedShoppingCart />,{initialState})
      })
    
     
      it('should not be empty', async function () {
        await wait(async () =>{
            renderVal.getByTestId('cart-badge').firstChild.click()
            await wait(() => {
              expect(renderVal.getByTestId('shopping-cart')).toBeTruthy()
            })
          }
        )
      })  

      it('should be able to remove item', async function () {
        await wait(async () => {
            await wait(async () => {
              expect(renderVal.getByTestId('remove-0')).toBeTruthy()
              renderVal.getByTestId('remove-0').click()
              await wait(() => {
                expect(renderVal.getByTestId('shopping-cart').firstChild).toBe(null)
              })
            })
          }
        )
      })  

  })

  	

})

