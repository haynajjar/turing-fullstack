// load all Records inside bookshelf object


const CustomerRecord = require('./records/customer')
const DepartmentRecord = require('./records/department')
const CategoryRecord = require('./records/category')
const AttributeRecord = require('./records/attribute')
const AttributeValueRecord = require('./records/attribute_value')
const ProductAttributeRecord = require('./records/product_attribute')
const ProductRecord = require('./records/product')
const ProductCategoryRecord = require('./records/product_category')

const graphQL = require('graphql')
const graphQLBookshelf = require('p-graphql-bookshelfjs')

const ProductSchema = require('./graphql/product'),
	 CategorySchema = require('./graphql/category'),
	 DepartmentSchema = require('./graphql/department'),
	 ProductCategorySchema = require('./graphql/product_category'),
	 AttributeSchema = require('./graphql/attribute'),
	 AttributeValueSchema = require('./graphql/attribute_value'),
	 RootSchema = require('./graphql/root')

 
function load(bookshelf){
	//let Customer,Department,Category,ProductCategory,Product,Attribute,AttributeValue,ProductAttribute;
	// console.log("knex ....................")
	// console.log("knex ....................")
	// console.log("knex ....................")
	// console.log("knex ....................",bookshelf.knex)
	let model = bookshelf.Model 
	let knex = bookshelf.knex
	// using callback as parameters so the constant will be all declared
	// it won't show ReferenceError message
	const Customer = model.extend(CustomerRecord())	
	const Department = model.extend(DepartmentRecord(()=>{return {Category,Product,ProductCategory}}))

	const Attribute = model.extend(AttributeRecord(()=> {return {AttributeValue}}))
	const AttributeValue = model.extend(AttributeValueRecord(()=>{return {Attribute}}))
	const ProductAttribute = model.extend(ProductAttributeRecord(()=>{return {AttributeValue,Product}}))

	const ProductCategory = model.extend(ProductCategoryRecord(()=>{return {Product}}))
	const Category = model.extend(CategoryRecord(()=> {return {Product}}))
	const Product = model.extend(ProductRecord(()=> {return {Category,ProductAttribute,AttributeValue}}))


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

	//console.log("Model instance ... ", Department.where({department_id: 1}))
	// initialize graphql for the models
	// TODO -- add product attributes types
	const AttributeValueType = AttributeValueSchema(graphQL, graphQLBookshelf)
	const AttributeType = AttributeSchema(graphQL, graphQLBookshelf, {AttributeValueType,Attribute})

	const ProductType = ProductSchema(graphQL, graphQLBookshelf, {AttributeValueType,Product,AttributeType,Attribute})
	const CategoryType = CategorySchema(graphQL, graphQLBookshelf,  {ProductType,Category})
	const ProductCategoryType = ProductCategorySchema(graphQL, graphQLBookshelf,  {ProductType,ProductCategory})
	const DepartmentType = DepartmentSchema(graphQL, graphQLBookshelf, {knex,CategoryType,ProductType,Department,ProductCategory,Product})

	const RootQuery = RootSchema(graphQL,graphQLBookshelf, {
		ProductType,Product,
		CategoryType,Category,
		DepartmentType,Department,
		AttributeType,Attribute
	})


	const graphQLSchema = new graphQL.GraphQLSchema({query: RootQuery});

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


	const query = (queryString) => {
		return new Promise((resolve,reject)=>{
		 //console.log("query string ... ",queryString)
	     graphQL.graphql( graphQLSchema, queryString, null, { loaders: graphQLBookshelf.getLoaders() }).then(function(result) {
		     //console.log( JSON.stringify(result, null, 4) );
		     resolve(result)
		 });
			
		})
			
	}

	return {Customer, Department, Category, Product, ProductType, CategoryType, query}

}

module.exports = {load}