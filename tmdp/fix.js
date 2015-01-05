// temporary fix for some TMDP issues
'use strict';

/**
 * apply all TMDP fixes
 * @param req
 * @param res
 * @param next
 */
function fix (req, res, next) {
	req.tempData.completed = {
		fixedItems: false,
		fixedList: false
	};

	req.tempData.result = {
		changes: [],
		msg: []
	};

	var itemChanges = [
		{
			videoId: 'UUv_2usGj-nniMhnlV2Ua3fkJrs46ZIXbe',
			videoTitle: '【Kasane Teto】'
			+ 'Under the Tree【Original Song】',
			replaceField: 'pos',
			replaceWith: 1596
		},
		{
			videoId: 'UUv_2usGj-nnijuJOnMzYCXCWXmQAWlf1T',
			videoTitle: '【Kasane Teto & Keine Ron】'
			+ 'Ghost of the Lantern Festival【Original Song】',
			replaceField: 'pos',
			replaceWith: 1595
		},
		{
			videoId: 'UUv_2usGj-nniUAgyoCwKGPnEZCRv9iExi',
			videoTitle: '【Kasane Teto】'
			+ 'All Teto\'s things are like Teto【Original Song】',
			replaceField: 'pos',
			replaceWith: 1594
		},
		{
			videoId: 'UUv_2usGj-nnjAYuqt4ybBhnN2dvE4Kn9z',
			videoTitle: '【Kasane Teto, Ritsu, Ruko & Tei】'
			+ 'Pandora【Original Song】',
			replaceField: 'pos',
			replaceWith: 1593
		},
		{
			videoId: 'UUv_2usGj-nniM8uBhrHND9-J7tcCguAZr',
			videoTitle: '【Kasane Teto】'
			+ 'Space Shuttle【Original Song】',
			replaceField: 'pos',
			replaceWith: 1592
		},
		{
			videoId: 'UUv_2usGj-nnj_LlaOwVSZTObqp_mJ8ZS8',
			videoTitle: '【Kasane Teto】'
			+ 'Obliterate【Original Song】',
			replaceField: 'pos',
			replaceWith: 1591
		},
		{
			videoId: 'UUv_2usGj-nngEpDoYj_ruiN49BX0d222T',
			videoTitle: '【Kasane Teto】'
			+ 'Saiwaimachi\'s Sunset【Original Song】',
			replaceField: 'pos',
			replaceWith: 1590
		},
		{
			videoId: 'UUv_2usGj-nnhZAFW6P7PIvSdTVzjZXZF7',
			videoTitle: '【Kasane Teto】'
			+ 'I\'m just kidding about being a hero!【Original Song】',
			replaceField: 'pos',
			replaceWith: 1589
		},
		{
			videoId: 'UUv_2usGj-nnhHqSdHtlCVPJC7uaZEU307',
			videoTitle: '【Kasane Teto】'
			+ 'Before you disappear【Original Song】',
			replaceField: 'pos',
			replaceWith: 1588
		},
		{
			videoId: 'UUv_2usGj-nnik5tdmOZuJTQy_-uZDWnOF',
			videoTitle: '【Kasane Teto】'
			+ 'SwingLyingWinter【Original Song】',
			replaceField: 'pos',
			replaceWith: 1587
		},
		{
			videoId: 'UUv_2usGj-nngDdTPlrKEAGhfiKoRP-CyG',
			videoTitle: '【Kasane Teto】'
			+ 'HOLY LONELY NIGHT【Original Song】',
			replaceField: 'pos',
			replaceWith: 1586
		},
		{
			videoId: 'UUv_2usGj-nniGYbh1exiOP9gv8QuT1ShT',
			videoTitle: '【Kasane Teto】'
			+ 'If we couldn\'t die【Original Song】',
			replaceField: 'pos',
			replaceWith: 1550
		},
		{
			videoId: 'UUv_2usGj-nngqL0yUcT-x17i-F3AqF_N4',
			videoTitle: '【Kasane Teto】'
			+ 'Sea (海)【Original Song】',
			replaceField: 'pos',
			replaceWith: 1549
		},
		{
			videoId: 'UUv_2usGj-nngXvNDlhsOJUJ_073WIqQN4',
			videoTitle: '【Kasane Teto】Actually (now), with you! - '
			+ '現在 (いま)、君と【Original Song】',
			replaceField: 'titleLinesHtml',
			replaceWith: '<div class=" ri">【Kasane Teto】</div>'
			+ '<div class="">Actually (now), with you!</div>'
			+ '<div class=" sjp">現在 (いま)、君と</div>'
		}
	];

	var n = itemChanges.length;
	var i;
	req.tempData.pendingItemChanges = itemChanges.length;
	for (i = 0; i < n; i++) {
		fixVideoItem (req, res, next, itemChanges [i]);
	}

	// TODO
	fixVideoList (req, res, next);
}

/**
 * fix video data: find item in DB, call update function
 * @param req
 * @param res
 * @param next
 * @param params
 */
function fixVideoItem (req, res, next, params) {
	req.appGlobal.db.tmdpVideos ().findOne (
		{
			'data.id': params.videoId,
			'data.snippet.title': params.videoTitle
		},
		function videoDataFound (err, item) {
			if (err || item == null) {
				req.tempData.result.msg.push (
					'could not find ' + params.videoTitle
				);
				onItemFixFinished (req, res, next);

			} else {
				updateVideoData (req, res, next, params, item);
			}
		}
	);
}

/**
 * update TMDP playlist item
 * store updated item
 * @param req
 * @param res
 * @param next
 * @param params
 * @param item
 */
function updateVideoData (req, res, next, params, item) {
	var originalValue = item [params.replaceField];
	if (originalValue == params.replaceWith) {
		// no need to update
		req.tempData.result.msg.push (
			'no need to update ' + params.videoTitle
		);
		onItemFixFinished (req, res, next);

	} else {
		// save original value
		item ['orig_' + params.replaceField] = originalValue;

		item [params.replaceField] = params.replaceWith;

		req.appGlobal.db.tmdpVideos ().update (
			{
				'data.id': params.videoId
			},
			item,
			function onVideoDataUpdated (err) {
				if (err) {
					req.tempData.result.msg.push (
						'could not update ' + params.videoTitle
					);

				} else {
					req.tempData.result.changes.push (params);
					req.tempData.result.msg.push (
						'updated \''
						+ params.replaceField
						+ '\' of '
						+ params.videoTitle
					);
				}

				onItemFixFinished (req, res, next);
			}
		);
	}
}

/**
 * item fix finished callback
 * @param req
 * @param res
 * @param next
 */
function onItemFixFinished (req, res, next) {
	req.tempData.pendingItemChanges--;
	if (req.tempData.pendingItemChanges == 0) {
		req.tempData.completed.fixedItems = true;
		onFixFinished (req, res, next);
	}
}

/**
 * TODO fix video list
 * remove excess items
 * @param req
 * @param res
 * @param next
 * @param params
 */
function fixVideoList (req, res, next, params) {
	req.tempData.completed.fixedList = true;
	onFixFinished (req, res, next);
}

/**
 * fix finished callback
 * if all fixes completed, send result JSON
 * @param req
 * @param res
 * @param next
 */
function onFixFinished (req, res, next) {
	if (req.tempData.completed.fixedItems
		&& req.tempData.completed.fixedList) {

		res.json (req.tempData.result);
	}
}

module.exports = {
	fix: fix
};
