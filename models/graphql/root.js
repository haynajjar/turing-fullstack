
function RootSchema(graphQL,graphQLBookshelf, {ProductType,Product,CategoryType,Category,DepartmentType,Department,AttributeType,Attribute}){
	return new graphQL.GraphQLObjectType({
	    name: 'RootQuery',
	    fields: {
	        products: {
	            type: new graphQL.GraphQLList(ProductType),	            
	            resolve: graphQLBookshelf.resolverFactory( Product )
	        },
	        product: {
	            type: ProductType,	            
	            args: {
	            	product_id: {
	            		name: 'product_id',
	            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
	            	}
	            },
	            resolve: graphQLBookshelf.resolverFactory( Product )
	        },
	        categories: {
	            type: new graphQL.GraphQLList(CategoryType),	            
	            resolve: graphQLBookshelf.resolverFactory( Category )
	        },
	        category: {
	            type: CategoryType,	            
	            args: {
	            	category_id: {
	            		name: 'category_id',
	            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
	            	}
	            },
	            resolve: graphQLBookshelf.resolverFactory( Category )
	        },
	        departments: {
	            type: new graphQL.GraphQLList(DepartmentType),	            
	            resolve: graphQLBookshelf.resolverFactory( Department )
	        },
	        department: {
	            type: DepartmentType,	            
	            args: {
	            	department_id: {
	            		name: 'department_id',
	            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
	            	}
	            },
	            resolve: graphQLBookshelf.resolverFactory( Department )
	        }, 
	        attributes: {
	            type: new graphQL.GraphQLList(AttributeType),	            
	            resolve: graphQLBookshelf.resolverFactory( Attribute )
	        },
	        attribute: {
	            type: AttributeType,	            
	            args: {
	            	attribute_id: {
	            		name: 'attribute_id',
	            		type: new graphQL.GraphQLNonNull(graphQL.GraphQLInt)
	            	}
	            },
	            resolve: graphQLBookshelf.resolverFactory( Attribute )
	        }

	    }
	});
}

module.exports = RootSchema