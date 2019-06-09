

function ShippingSchema(graphQL, graphQLBookshelf, {ShippingRegionType,Shipping}){
	return new graphQL.GraphQLObjectType({
		name: "Shipping",
		fields: {
			shipping_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			shipping_type: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLString)
			},
			shipping_percentage: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLFloat)
			},
			shipping_cost: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLFloat)
			},
			shipping_region: {
				type: new graphQL.GraphQLList(ShippingRegionType),
				resolve: graphQLBookshelf.resolverFactory(Shipping)
			}

		}
	})
}

module.exports = ShippingSchema