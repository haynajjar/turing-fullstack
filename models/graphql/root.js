
function RootSchema(graphQL,graphQLBookshelf, {knex,
												ProductType,Product,
												CategoryType,Category,
												DepartmentType,Department,
												AttributeType,Attribute,
												ShoppingCartType,ShoppingCart,
												ShippingRegionType,ShippingRegion,
												ShippingType,Shipping
											}){

	return {

			RootQuery:	new graphQL.GraphQLObjectType({
			    name: 'RootQuery',
			    fields: {
			        products: {
			            type: new graphQL.GraphQLList(ProductType),	            
			            args: {
			            	page: {
			            		name: 'page',
			            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			            	},
			            	pageSize: {
			            		name: 'pageSize',
			            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			            	}

			            },
			            resolve: function (modelInstance,args,context,info){
						 	let {pageSize,page} = args
						 	const resolverFn = graphQLBookshelf.resolverFactory(Product);
		                	return resolverFn(modelInstance, {}, context, info, null, {pageSize,page});
						}
			        },
			        product: {
			            type: ProductType,	            
			            args: {
			            	product_id: {
			            		name: 'product_id',
			            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			            	}
			            },
			            resolve: graphQLBookshelf.resolverFactory( Product )
			        },
			        categories: {
			            type: new graphQL.GraphQLList(CategoryType),	            
			            resolve: graphQLBookshelf.resolverFactory( Category )
			        },
			        category: {
			            type: CategoryType,	            
			            args: {
			            	category_id: {
			            		name: 'category_id',
			            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			            	}
			            },
			            resolve: graphQLBookshelf.resolverFactory( Category )
			        },
			        departments: {
			            type: new graphQL.GraphQLList(DepartmentType),	            
			            resolve: graphQLBookshelf.resolverFactory( Department )
			        },
			        department: {
			            type: DepartmentType,	            
			            args: {
			            	department_id: {
			            		name: 'department_id',
			            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			            	}
			            },
			            resolve: graphQLBookshelf.resolverFactory( Department )
			        }, 
			        attributes: {
			            type: new graphQL.GraphQLList(AttributeType),	            
			            resolve: graphQLBookshelf.resolverFactory( Attribute )
			        },
			        attribute: {
			            type: AttributeType,	            
			            args: {
			            	attribute_id: {
			            		name: 'attribute_id',
			            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			            	}
			            },
			            resolve: graphQLBookshelf.resolverFactory( Attribute )
			        },
			        shopping_cart: {
			            type:  new graphQL.GraphQLList(ShoppingCartType),	            
			            args: {
			            	cart_id: {
			            		name: 'cart_id',
			            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLString)
			            	}
			            },
			            resolve: graphQLBookshelf.resolverFactory( ShoppingCart )

			        },
			        shipping_regions: {
			            type:  new graphQL.GraphQLList(ShippingRegionType),	            
			            resolve: graphQLBookshelf.resolverFactory( ShippingRegion )

			        },
			        shippings: {
			            type:  new graphQL.GraphQLList(ShippingType),	            
			            args:{
			            	shipping_region_id: {
			            		name: 'shipping_region_id',
			            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			            	}
			            },
			            resolve: graphQLBookshelf.resolverFactory( Shipping )
			        	
			        }

	    		}
			}),



		// Root mutations 
		RootMutation: new graphQL.GraphQLObjectType({
			    name: 'RootMutation',
			    fields: {
			    	add_to_cart: {
						type: ShoppingCartType,
						description: 'Add cart item',
						args: {
			            	cart_id: {
			            		name: 'cart_id',
			            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLString)
			            	},
			            	product_id: {
			            		name: 'product_id',
			            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			            	},
			            	quantity: {
			            		name: 'quantity',
			            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			            	},
			            	attributes: {
			            		name: 'attributes',
			            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLString)
			            	}

			            },
						resolve: async function(modelInstance, args, context, info){
							const {cart_id,product_id,quantity,attributes} = args
							const added_on = new Date()
							// check if product_id, cart_id and attributes exist and update quantity or add new item
							let cart = await ShoppingCart.where({cart_id,product_id,attributes}).fetch()

							if(cart){
								const {quantity} = cart.serialize({ shallow: true })
								cart = await cart.save({quantity: quantity+1}) 
							}else{
								cart = await ShoppingCart.forge({cart_id,product_id,quantity,attributes,added_on}).save()
							}

							return Object.assign(cart, cart.serialize({ shallow: true }))
						}
					},

					update_cart_attributes: {
						type: graphQL.GraphQLBoolean,
						args: {
							item_id: {
								name: 'item_id',
								type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
							},
							attributes: {
								name: 'attributes',
								type: new graphQL.GraphQLNonNull(graphQL.GraphQLString)
							}
						},
						resolve: async function(modelInstance, args, context, info){
							try{
								await ShoppingCart.forge({item_id: args.item_id}).save({attributes: args.attributes})
								return true
							}catch(e){
								// TODO through error
								console.error(e)
								return false
							}
						}
					},
					update_cart_quantity: {
						type: graphQL.GraphQLBoolean,
						args: {
							item_id: {
								name: 'item_id',
								type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
							},
							quantity: {
								name: 'quantity',
								type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
							}
						},
						resolve: async function(modelInstance, args, context, info){
							try{
								await ShoppingCart.forge({item_id: args.item_id}).save({quantity: args.quantity})
								return true
							}catch(e){
								// TODO through error 
								console.error(e)
								return false
							}
						}
					},

					remove_from_cart: {
						type: graphQL.GraphQLBoolean,
						args: {
							item_id: {
								name: 'item_id',
								type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
							}
						},
						resolve: async function(modelInstance, args, context, info){
							try{
								await ShoppingCart.forge({item_id: args.item_id}).destroy()
								return true
							}catch(e){
								// TODO through error
								console.error(e)
								return false
							}
						}
					}

			    }
			})

	}

}




module.exports = RootSchema