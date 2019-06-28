

function CategorySchema(graphQL, graphQLBookshelf, {ProductType,Category,Product}){
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
				args: {
	            	page: {
	            		name: 'page',
	            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
	            	},
	            	pageSize: {
	            		name: 'pageSize',
	            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
	            	},
	            	priceRange: {
	            		name: 'priceRange',
	            		type: new graphQL.GraphQLList(graphQL.GraphQLInt)
	            	}

	            },
				//resolve: graphQLBookshelf.resolverFactory(Category)
				resolve: function (modelInstance,args,context,info){

					let category_id = modelInstance.category_id
				 	
				 	const extra = (model) => {
				 		model.query((qb)=> {
					 		qb.innerJoin('product_category','product.product_id','product_category.product_id')
					 		qb.innerJoin('category','product_category.category_id','category.category_id')
					 		qb.where('category.category_id',category_id)
					 		if(args.priceRange){
						 		qb.where('price','>',args.priceRange[0])
								qb.where('price','<',args.priceRange[1])
					 		}
					 	})
					 	
				 	}

				 	let {pageSize,page} = args
				 	const resolverFn = graphQLBookshelf.resolverFactory(Product);

                	return resolverFn(modelInstance, {}, context, info, extra, {pageSize,page});
				}
			}

		}
	})
}

module.exports = CategorySchema