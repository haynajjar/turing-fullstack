
function ProductCategory(cb) {
	return {
		tableName: 'product_category',
		product: function(){
			return this.belongsTo(cb().Product,'product_id','product_id')
		}
	}
}



module.exports= ProductCategory