// load all Records inside bookshelf object


const CustomerRecord = require('./records/customer')
const DepartmentRecord = require('./records/department')
const CategoryRecord = require('./records/category')
const AttributeRecord = require('./records/attribute')
const AttributeValueRecord = require('./records/attribute_value')
const ProductAttributeRecord = require('./records/product_attribute')
const ProductRecord = require('./records/product')
const ProductCategoryRecord = require('./records/product_category')
const ShoppingCartRecord = require('./records/shopping_cart')

const graphQL = require('graphql')
const graphQLBookshelf = require('p-graphql-bookshelfjs')

const ProductSchema = require('./graphql/product'),
	 CategorySchema = require('./graphql/category'),
	 DepartmentSchema = require('./graphql/department'),
	 ProductCategorySchema = require('./graphql/product_category'),
	 AttributeSchema = require('./graphql/attribute'),
	 AttributeValueSchema = require('./graphql/attribute_value'),
	 ShoppingCartSchema = require('./graphql/shopping_cart'),
	 RootSchema = require('./graphql/root')

 
function load(bookshelf){

	let model = bookshelf.Model 
	let knex = bookshelf.knex
	// using callback as parameters so the constant will be all declared
	// it won't show ReferenceError message
	const Customer = model.extend(CustomerRecord().Record,CustomerRecord().Methods)	
	const Department = model.extend(DepartmentRecord(()=>{return {Category,Product,ProductCategory}}))

	const Attribute = model.extend(AttributeRecord(()=> {return {AttributeValue}}))
	const AttributeValue = model.extend(AttributeValueRecord(()=>{return {Attribute}}))
	const ProductAttribute = model.extend(ProductAttributeRecord(()=>{return {AttributeValue,Product}}))

	const ProductCategory = model.extend(ProductCategoryRecord(()=>{return {Product}}))
	const Category = model.extend(CategoryRecord(()=> {return {Product}}))
	const Product = model.extend(ProductRecord(()=> {return {Category,ProductAttribute,AttributeValue,ShoppingCart}}))


	const ShoppingCart = model.extend(ShoppingCartRecord(()=> {return {Product}}))


	// ADD them to test cases

	// fetch products
	// Product.where({product_id: 1}).fetch({withRelated: ['categories']}).then(product => {
	// 	//console.log("LIST products ... ", products)
	// 	//console.log("product", JSON.stringify(product))
	// 	console.log("First product categories ...", JSON.stringify(product.related('categories')))
	// })

	// fetch categories
	// Category.where({category_id: 1}).fetch({withRelated: ['products']}).then(category => {
		
	// 	console.log("First category products ...", JSON.stringify(category.related('products')))
	// })

	// Department.where({department_id: 1}).fetch({withRelated: ['product_categories.product']}).then(dep => {
	// 	//console.log('JSON... ',dep.toJSON())
	//  	console.log("First department products ...", JSON.stringify(dep.related('product_categories'),null,2))
	//  })	

	// Product.where({product_id: 1}).fetch({withRelated: ['attribute_values']}).then(dep => {
	// 	//console.log('JSON... ',dep.toJSON())
	//  	console.log("First department products ...", JSON.stringify(dep.related('attribute_values'),null,2))
	//  })	

	// ShoppingCart.where({item_id: 16}).fetch({withRelated: ['product']}).then(dep => {
	// 	//console.log('JSON... ',dep.toJSON())
	//  	console.log("First department products ...", JSON.stringify(dep.related('product'),null,2))
	//  })	

	//console.log("Model instance ... ", Department.where({department_id: 1}))
	// initialize graphql for the models
	// TODO -- add product attributes types
	const AttributeValueType = AttributeValueSchema(graphQL, graphQLBookshelf)
	const AttributeType = AttributeSchema(graphQL, graphQLBookshelf, {AttributeValueType,Attribute})

	const ProductType = ProductSchema(graphQL, graphQLBookshelf, {AttributeValueType,Product,AttributeType,Attribute})
	const CategoryType = CategorySchema(graphQL, graphQLBookshelf,  {ProductType,Category,Product})
	const ProductCategoryType = ProductCategorySchema(graphQL, graphQLBookshelf,  {ProductType,ProductCategory})
	const DepartmentType = DepartmentSchema(graphQL, graphQLBookshelf, {knex,CategoryType,ProductType,Department,ProductCategory,Product})
	const ShoppingCartType = ShoppingCartSchema(graphQL, graphQLBookshelf, {ProductType,Product,ShoppingCart})

	const {RootQuery, RootMutation} = RootSchema(graphQL,graphQLBookshelf, {
		ProductType,Product,
		CategoryType,Category,
		DepartmentType,Department,
		AttributeType,Attribute,
		ShoppingCartType,ShoppingCart
	})




	const graphQLSchema = new graphQL.GraphQLSchema({query: RootQuery, mutation: RootMutation});

	/*
		-- Query String example --

		const queryString =
		`{ 
    		categories {
    			category_id,
    			name
	    		products { 
	    			product_id,
	    			name,
	    			price,
    			}
    		}
    	}`
    */


	const query = (queryString,variables) => {
		return new Promise((resolve,reject)=>{

		 let context = {loaders: graphQLBookshelf.getLoaders()}
		 //console.log(context.loaders)
	     graphQL.graphql( graphQLSchema, queryString, null, context,variables).then(function(result,v) {
	     	 //console.log(result)
		     if(result.data){
		     	// getting pagination from context is propably not the best method, 
		     	// but it is the easiest , otherwise we need to get deeper about how we handle resolvers internally
		     	result.data.pagination = context.pagination
		     }
		     resolve(result)
		 });
			
		})
			
	}

	return {Customer, Department, Category, Product, ProductType, CategoryType, query}

}

module.exports = {load}