const _ = require('lodash');

const transitiveCloseAux = function(evaluated, pending, inFun) {
	if (pending.length < 1) {
		return evaluated;
	}

	const item = pending.pop();
	const candidates = inFun(item);

	const newCandidates = _.difference(candidates, evaluated);
	for (const newCandidate in newCandidates) {
		if (newCandidates.hasOwnProperty(newCandidate)) {
			pending.push(newCandidates[newCandidate]);
		}
	}

	evaluated.push(item);
	evaluated = _.uniq(evaluated); // eslint-disable-line interfaced/no-param-reassign
	pending = _.uniq(pending); // eslint-disable-line interfaced/no-param-reassign

	return transitiveCloseAux(evaluated, pending, inFun);
};

const transitiveClose = function(inFun, startInt) {
	return transitiveCloseAux([], [startInt], inFun);
};

module.exports = transitiveClose;
