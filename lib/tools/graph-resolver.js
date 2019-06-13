/**
 * @param {Array<string>} a
 * @param {Array<string>} b
 * @return {Array<string>}
 */
const arraySub = function(a, b) {
	return a.filter((item) => b.indexOf(item) === -1);
};


/**
 * @param {Object<Array<string>>} graph
 * @return {Array<string>}
 */
module.exports.getOrder = function(graph) {
	let result = [];
	let portion = [];

	// Create clone and filter undefined params
	const work = {};
	Object.keys(graph)
		.forEach((key) => {
			work[key] = graph[key].filter(Boolean);
		});

	// Resolve order
	while (Object.keys(work).length) {
		portion = [];

		// Get non-dependent nodes
		Object.keys(work)
			.forEach((key) => { // eslint-disable-line no-loop-func
				if (!work[key].length) {
					portion.push(key);
					delete work[key];
				}
			});

		// Check if there was any progress
		if (!portion.length) {
			throw new Error('Circular dependencies left', work);
		}

		// Remove deps from the rest nodes
		Object.keys(work)
			.forEach((key) => {// eslint-disable-line no-loop-func
				work[key] = arraySub(work[key], portion);
			});

		// Add portion to result
		result = result.concat(portion.sort());
	}

	return result;
};
