
function ShippingRecord(cb) {
	return {
		tableName: 'shipping',
		idAttribute: 'shipping_id',		
		shipping_region: function() {
			return this.hasOne(cb().ShippingRegion,'shipping_region_id','shipping_region_id')
		}
	}
}

module.exports = ShippingRecord