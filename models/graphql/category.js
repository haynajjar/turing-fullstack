

function CategorySchema(graphQL, graphQLBookshelf, {ProductType,Category}){
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
			products: {
				type: new graphQL.GraphQLList(ProductType),
				resolve: graphQLBookshelf.resolverFactory(Category)
			}
		}
	})
}

module.exports = CategorySchema