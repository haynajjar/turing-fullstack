
function AttributeSchema(graphQL, graphQLBookshelf, {AttributeValueType,Attribute}){
	return new graphQL.GraphQLObjectType({
		name: "Attribute",
		fields: {
			attribute_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			name: {
				type: graphQL.GraphQLString
			},
			attribute_values: {
				type: new graphQL.GraphQLList(AttributeValueType),
				resolve: function(modelInstance,args,context,info){

					/*
						Calling attribute_values as a relation to attributes will not consider the product_id 
						to do so we need to detect if product_id was passed as parameter in info object,
						this maybe not the best way to filter the attribute values depending on the product, but it is easier to wrap the query in the frontend
						example of the query will be as the following

						{
				        	product(product_id: 1) { 
				                  product_id, 
				                  name, 
				                  description,
				                  attributes {
				                    name
				                    attribute_values{
				                      attribute_value_id
				                      value
				                    }
				                  }
				            }
				      }

					*/
					let extra = null
					let product_id = null 

					if(info.operation && info.operation.selectionSet && info.operation.selectionSet.selections){
						// find product selection
						let selections = info.operation.selectionSet.selections
						let indexProduct = selections.findIndex(s => s.name.value == 'product')
						if(indexProduct>-1){
							let selectionArgs = selections[indexProduct].arguments
							let productIdArgIndex = selectionArgs.findIndex(sa => sa.name.value == 'product_id')
							if(productIdArgIndex>-1){
								product_id = selectionArgs[productIdArgIndex].value.value 
							}
						}
					}

					// filter with product_id if found
					if(product_id){
						extra = (model) => {
							model.query((qb) => {
								qb.innerJoin('product_attribute','attribute_value.attribute_value_id','product_attribute.attribute_value_id')
								qb.innerJoin('product','product_attribute.product_id','product.product_id')
								qb.where('product.product_id',parseInt(product_id))
							})
						}
					}


					const resolverFn = graphQLBookshelf.resolverFactory(Attribute)
					return resolverFn(modelInstance, {}, context, info, extra);
				}
			
			}
		}
	})
}

module.exports = AttributeSchema