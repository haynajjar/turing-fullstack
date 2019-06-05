// pass the relationshpis as params
function Department(cb) {
	return {
		tableName: 'department',
		idAttribute: 'department_id',
		categories: function() {
			return this.hasMany(cb().Category,'department_id','department_id')
		},
		product_categories: function(){
			let c = cb()
			return	this.belongsToMany(c.ProductCategory,'product_category','product_id','category_id','product_id','category_id')
						.through(c.Category,'department_id','category_id','department_id','category_id')
		}
	}
}



module.exports= Department