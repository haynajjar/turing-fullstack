
// cb: callback function
function CategorySchema(graphQL, graphQLBookshelf, {ProductType,Product}){
	return new graphQL.GraphQLObjectType({
		name: "Category",
		fields: {
			category_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			name: {
				type: graphQL.GraphQLString
			},
			description: {
				type: graphQL.GraphQLString
			},
			// TODO - add department here
			products: {
				type: ProductType,
				resolve: graphQLBookshelf.resolveFactory(Product)
			}
		}
	})
}

module.exports = CategorySchema