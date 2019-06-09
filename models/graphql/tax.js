

function TaxSchema(graphQL, graphQLBookshelf){
	return new graphQL.GraphQLObjectType({
		name: "Tax",
		fields: {
			tax_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			tax_type: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLString)
			},
			tax_percentage: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLFloat)
			}

		}
	})
}

module.exports = TaxSchema