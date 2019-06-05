
function Attribute(cb) {
	return {
		tableName: 'attribute',
		idAttribute: 'attribute_id',
		attribute_values: function(){
			return this.hasMany(cb().AttributeValue,'attribute_id','attribute_id')
		}
	}
}



module.exports= Attribute