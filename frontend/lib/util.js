export const {priceFormat}={
	priceFormat: (p) => {
		return p ? parseFloat(p).toLocaleString('en-US', {
				  style: 'currency',
				  currency: 'USD',
			}) : null;
	}
}

