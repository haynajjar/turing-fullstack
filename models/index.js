// load all Records inside bookshelf object


const CustomerObject = require('./records/customer'),
	  CustomerRecord = CustomerObject.CustomerRecord,
	  CustomerMethods = CustomerObject.CustomerMethods,
	  DepartmentRecord = require('./records/department'),
	  CategoryRecord = require('./records/category'),
	  AttributeRecord = require('./records/attribute'),
	  AttributeValueRecord = require('./records/attribute_value'),
	  ProductAttributeRecord = require('./records/product_attribute'),
	  ProductRecord = require('./records/product'),
	  ProductCategoryRecord = require('./records/product_category'),
	  ShoppingCartRecord = require('./records/shopping_cart'),
	  OrderRecord = require('./records/order'),
	  OrderDetailRecord = require('./records/order_detail'),
	  ShippingRecord = require('./records/shipping'),
	  ShippingRegionRecord = require('./records/shipping_region'),
	  TaxRecord = require('./records/tax')

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
	 OrderDetailSchema = require('./graphql/order_detail')
	 OrderSchema = require('./graphql/order')
	 ShippingRegionSchema = require('./graphql/shipping_region')
	 ShippingSchema = require('./graphql/shipping')
	 TaxSchema = require('./graphql/tax')

 
function load(bookshelf){

	let model = bookshelf.Model 
	let knex = bookshelf.knex
	// using callback as parameters so the constant will be all declared
	// it won't show ReferenceError message
	const Customer = model.extend(CustomerRecord(() => {return {Order}} ),CustomerMethods())	
	const Department = model.extend(DepartmentRecord(()=>{return {Category,Product,ProductCategory}}))

	const Attribute = model.extend(AttributeRecord(()=> {return {AttributeValue}}))
	const AttributeValue = model.extend(AttributeValueRecord(()=>{return {Attribute}}))
	const ProductAttribute = model.extend(ProductAttributeRecord(()=>{return {AttributeValue,Product}}))

	const ProductCategory = model.extend(ProductCategoryRecord(()=>{return {Product}}))
	const Category = model.extend(CategoryRecord(()=> {return {Product}}))
	const Product = model.extend(ProductRecord(()=> {return {Category,ProductAttribute,AttributeValue,ShoppingCart}}))


	const ShoppingCart = model.extend(ShoppingCartRecord(()=> {return {Product}}))
	
	const Order = model.extend(OrderRecord(()=> {return {OrderDetail,Shipping,Tax}}))
	const OrderDetail = model.extend(OrderDetailRecord(()=> {return {Product}}))
	const Shipping = model.extend(ShippingRecord(()=> {return {ShippingRegion}}))
	const ShippingRegion = model.extend(ShippingRegionRecord())
	const Tax = model.extend(TaxRecord())



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

	// Customer.where({customer_id: 1}).fetch({require: true,withRelated: ['orders']}).then(async customer => {
	// 			  const order = await customer.related('orders').findWhere({status: 0})
	// 		      console.log('current order ...',order.serialize({shallow: true}))
	// })

	const AttributeValueType = AttributeValueSchema(graphQL, graphQLBookshelf)
	const AttributeType = AttributeSchema(graphQL, graphQLBookshelf, {AttributeValueType,Attribute})

	const ProductType = ProductSchema(graphQL, graphQLBookshelf, {AttributeValueType,Product,AttributeType,Attribute})
	const CategoryType = CategorySchema(graphQL, graphQLBookshelf,  {ProductType,Category,Product})
	const ProductCategoryType = ProductCategorySchema(graphQL, graphQLBookshelf,  {ProductType,ProductCategory})
	const DepartmentType = DepartmentSchema(graphQL, graphQLBookshelf, {knex,CategoryType,ProductType,Department,ProductCategory,Product})
	const ShoppingCartType = ShoppingCartSchema(graphQL, graphQLBookshelf, {ProductType,Product,ShoppingCart})
	

	const OrderDetailType = OrderDetailSchema(graphQL, graphQLBookshelf, {ProductType,OrderDetail})
	const OrderType = OrderSchema(graphQL, graphQLBookshelf, {OrderDetailType,Order})

	const ShippingRegionType = ShippingRegionSchema(graphQL, graphQLBookshelf)
	const ShippingType = ShippingSchema(graphQL, graphQLBookshelf, {ShippingRegionType,Shipping})
	const TaxType = TaxSchema(graphQL, graphQLBookshelf)

	const {RootQuery, RootMutation} = RootSchema(graphQL,graphQLBookshelf, {
		knex,
		ProductType,Product,
		CategoryType,Category,
		DepartmentType,Department,
		AttributeType,Attribute,
		ShoppingCartType,ShoppingCart,
		ShippingRegionType, ShippingRegion,
		ShippingType, Shipping
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
		     graphQL.graphql( graphQLSchema, queryString, null, context,variables).then(function(result) {
			     if(result.data){
			     	// getting pagination from context is propably not the best method, 
			     	// but it is the easiest , otherwise we need to get deeper about how we handle resolvers internally
			     	result.data.pagination = context.pagination
			     }
			     resolve(result)
			 })
			
		})
			
	}

	return {
			Customer, 
			Department, 
			Category, 
			Product, 
			ProductType, 
			CategoryType, 
			Order, 
			Shipping, 
			ShoppingCart,
			query
		}

}

module.exports = {load}