
function ProductSchema(graphQL, graphQLBookshelf){
	return new graphQL.GraphQLObjectType({
		name: "Product",
		fields: {
			product_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			name: {
				type: graphQL.GraphQLString
			},
			description: {
				type: graphQL.GraphQLString
			},
			price: {
				type: graphQL.GraphQLFloat
			},
			discounted_price: {
				type: graphQL.GraphQLFloat
			},
			image: {
				type: graphQL.GraphQLString
			},
			image_2: {
				type: graphQL.GraphQLString
			},
			thumbnail: {
				type: graphQL.GraphQLString
			},
			display: {
				type: graphQL.GraphQLInt
			}
		}
	})
}

module.exports = ProductSchema