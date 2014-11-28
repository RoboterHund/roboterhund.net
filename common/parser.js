// order list parser
'use strict';

// process order list
function processOrderList (code, params) {
	var lines = code.match (/\n/g) || [];

	var n = lines.length;
	var i;
	var line;
	var match;
	var order;
	var data;
	var func;
	for (i = 0; i < n; i++) {
		line = lines [i];

		// separate line into order character and data
		match = /\s*([^\s]+)(.*)/.exec (line) || [null, null, ''];
		order = match [0];
		data = match [1].trim ();

		// process line
		func = params.funcs [order];
		if (func) {
			func (data, params);

		} else {
			params.otherFunc (line, params);
		}
	}
}

module.exports = {
	processOrderList: processOrderList
};
