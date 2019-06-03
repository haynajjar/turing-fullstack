
function AttributeValue(cb) {
	return {
		tableName: 'attribute_value',
		attribute: function() {
			return this.belongsTo(cb().Attribute)
		}
	}
}



module.exports= AttributeValue