

function OrderDetailSchema(graphQL, graphQLBookshelf, {ProductType,OrderDetail}){
	return new graphQL.GraphQLObjectType({
		name: "OrderDetail",
		fields: {
			item_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			order_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			product_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			quantity: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			attributes: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLString)
			},
			product_name: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLString)
			},
			unit_cost: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLFloat)
			},
			product: {
				type: new graphQL.GraphQLList(ProductType),
				resolve: graphQLBookshelf.resolverFactory(OrderDetail)
			}

		}
	})
}

module.exports = OrderDetailSchema