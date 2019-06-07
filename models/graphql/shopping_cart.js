

function ShoppingCartSchema(graphQL, graphQLBookshelf, {ProductType,Product,ShoppingCart}){
	return new graphQL.GraphQLObjectType({
		name: "ShoppingCart",
		fields: {
			item_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			cart_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLString)
			},
			product_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			attributes: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLString)
			},
			quantity: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			buy_now: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLBoolean)
			},
			added_on: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLString)
			},
			product: {
				type: ProductType,
				resolve: function (modelInstance,args,context,info){
					
							 	const extra = (model) => {
							 		model.query((qb)=> {
								 		qb.innerJoin('shopping_cart','product.product_id','shopping_cart.product_id')
								 		qb.where('shopping_cart.item_id',modelInstance.item_id)
								 	})
							 	}

							 	const resolverFn = graphQLBookshelf.resolverFactory(Product);
			                	return resolverFn(modelInstance, args, context, info, extra);
						}
			}
		}
	})
}

module.exports = ShoppingCartSchema