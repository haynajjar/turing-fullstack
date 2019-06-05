
function ProductSchema(graphQL, graphQLBookshelf, {AttributeValueType,Product,AttributeType,Attribute}){
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
			},
			attribute_values: {
				type: graphQL.GraphQLList(AttributeValueType),
				resolve: graphQLBookshelf.resolverFactory(Product)
			},
			attributes: {
				type: graphQL.GraphQLList(AttributeType),
				resolve: function(modelInstance, args, context, info){
					let product_id = modelInstance.product_id
					const extra = (model) => {

				 		model.query((qb)=> {
					 		qb.innerJoin('attribute_value','attribute.attribute_id','attribute_value.attribute_id')
					 		qb.innerJoin('product_attribute','attribute_value.attribute_value_id','product_attribute.attribute_value_id')
					 		qb.innerJoin('product','product_attribute.product_id','product.product_id')
					 		qb.where('product.product_id',product_id)
					 		qb.groupBy('attribute.attribute_id')

					 	})
					 	
				 	}

				 	const resolverFn = graphQLBookshelf.resolverFactory(Attribute);
                	return resolverFn(modelInstance, {}, context, info, extra);

				}
			}
		}
	})
}

module.exports = ProductSchema