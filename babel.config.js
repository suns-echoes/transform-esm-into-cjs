module.exports = (api) => {
	api.cache(true);

	return {
		env: {
			test: {
				plugins: [
					'istanbul',
				],
			},
		},
		presets: [
			[
				'@babel/preset-env',
				{
					targets: {
						node: true,
					},
				},
			],
		],
	};
};
