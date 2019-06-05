
function AttributeValueSchema(graphQL, graphQLBookshelf){
	return new graphQL.GraphQLObjectType({
		name: "AttributeValue",
		fields: {
			attribute_value_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			value: {
				type: graphQL.GraphQLString
			}
		}
	})
}

module.exports = AttributeValueSchema