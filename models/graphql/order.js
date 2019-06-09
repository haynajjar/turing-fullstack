

function OrderSchema(graphQL, graphQLBookshelf, {OrderDetailType,Order}){
	return new graphQL.GraphQLObjectType({
		name: "Order",
		fields: {
			order_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			total_amount: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLFloat)
			},
			created_on: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLString)
			},
			shipping_on: {
				type: graphQL.GraphQLString
			},
			comments: {
				type: graphQL.GraphQLString
			},
			auth_code: {
				type: graphQL.GraphQLString
			},
			reference: {
				type: graphQL.GraphQLString
			},
			status: {
				type: graphQL.GraphQLInt
			},
			customer_id: {
				type: graphQL.GraphQLInt
			},
			shipping_id: {
				type: graphQL.GraphQLInt
			},
			tax_id: {
				type: graphQL.GraphQLInt
			},
			order_details: {
				type: new graphQL.GraphQLList(OrderDetailType),
				args: {
	            	order_id: {
	            		name: 'order_id',
	            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
	            	}
	            },
				resolve: graphQLBookshelf.resolverFactory(Order)
			}

		}
	})
}

module.exports = OrderSchema