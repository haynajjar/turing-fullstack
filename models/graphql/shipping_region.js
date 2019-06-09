

function ShippingRegionSchema(graphQL, graphQLBookshelf){
	return new graphQL.GraphQLObjectType({
		name: "ShippingRegion",
		fields: {
			shipping_region_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			shipping_region: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLString)
			}

		}
	})
}

module.exports = ShippingRegionSchema