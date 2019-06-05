
function ProductCategorySchema(graphQL, graphQLBookshelf, {ProductType,ProductCategory}){
	return new graphQL.GraphQLObjectType({
		name: "ProductCategory",
		fields: {
			category_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			product_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			product: {
				type: ProductType,
				resolve: graphQLBookshelf.resolverFactory(ProductCategory)
			}
		}
	})
}

module.exports = ProductCategorySchema