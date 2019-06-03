// load all Records inside bookshelf object


const CustomerRecord = require('./records/customer')
const DepartmentRecord = require('./records/department')
const CategoryRecord = require('./records/category')
const AttributeRecord = require('./records/attribute')
const AttributeValueRecord = require('./records/attribute_value')
const ProductAttributeRecord = require('./records/product_attribute')
const ProductRecord = require('./records/product')

const graphQL = require('graphql')
const graphQLBookshelf = require('graphql-bookshelfjs')

const ProductSchema = require('./graphql/product')
const CategorySchema = require('./graphql/category')

function load(model){
	//let Customer,Department,Category,ProductCategory,Product,Attribute,AttributeValue,ProductAttribute;


	// using callback as parameters so the constant will be all declared
	// it won't show ReferenceError message
	const Customer = model.extend(CustomerRecord())	
	const Department = model.extend(DepartmentRecord(()=>{return {Category}}))

	const Attribute = model.extend(AttributeRecord())
	const AttributeValue = model.extend(AttributeValueRecord(()=>{return {Attribute}}))
	const ProductAttribute = model.extend(ProductAttributeRecord(()=>{return {AttributeValue,Product}}))

	const Category = model.extend(CategoryRecord(()=> {return {Product}}))
	const Product = model.extend(ProductRecord(()=> {return {Category,ProductAttribute,AttributeValue}}))


	// initialize graphql for the models
	const ProductType = ProductSchema(graphQL, graphQLBookshelf)
	const CategoryType = CategorySchema(graphQL, graphQLBookshelf,  {ProductType,Product})


	return {Customer, Department, Category, Product, ProductType, CategoryType}

}

module.exports = {load}