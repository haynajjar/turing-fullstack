// pass the relationshpis as params
function Department() {
	return {
		tableName: 'department',
		categories: function() {
			return this.hasMany(cb().Category)
		}
	}
}



module.exports= Department