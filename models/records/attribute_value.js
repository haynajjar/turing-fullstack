
function AttributeValue(cb) {
	return {
		tableName: 'attribute_value',
		idAttribute: 'attribute_value_id',
		attribute: function() {
			return this.belongsTo(cb().Attribute,'attribute_id','attribute_id')
		}
	}
}



module.exports= AttributeValue