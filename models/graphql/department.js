

function DepartmentSchema(graphQL, graphQLBookshelf, {knex, CategoryType,ProductType,Department,ProductCategory,Product}){
	return new graphQL.GraphQLObjectType({
		name: "Department",
		fields: {
			department_id: {
				type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
			},
			name: {
				type: graphQL.GraphQLString
			},
			description: {
				type: graphQL.GraphQLString
			},
			categories: {
				type: new graphQL.GraphQLList(CategoryType),
				resolve: graphQLBookshelf.resolverFactory(Department)
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
	            	}

	            },
				resolve: function (modelInstance,args,context,info){
				 	let department_id = modelInstance.department_id
				 	
				 	const extra = (model) => {
				 		model.query((qb)=> {
					 		qb.innerJoin('product_category','product.product_id','product_category.product_id')
					 		qb.innerJoin('category','product_category.category_id','category.category_id')
					 		qb.innerJoin('department','category.department_id','department.department_id')
					 		qb.where('department.department_id',department_id)

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

module.exports = DepartmentSchema