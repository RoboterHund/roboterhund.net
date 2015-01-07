// TMDP page script
// (C) RoboterHund 2015
'use strict';

var tmdp = (function () {
	var M = {};

	var AJAX_CONT = 'content';
	var AJAX_CONT_VAL = 1;

	var $E = {};

	M.init = function () {
		$ (
			function () {
				if (Modernizr.history) {
					$ (window).on ('popstate', function (e) {
						var state = e.originalEvent.state;
						if (state) {
							var f = restore [state.restore];
							if (typeof f == 'function') {
								f (state);
							}
						}
					});

					findElements ();
					setButtonEvents ();
				}
			}
		);
	};

	var findElements = function () {
		$E.filter = $ ('#filter');
		$E.filterForm = $E.filter.find ('form');
		$E.$searchTerm = function ($form) {
			return $form.find ('input[name=term]');
		};
	};

	var setButtonEvents = function () {
		setLinkContentReplace ($ ('.pages').find ('a'));
		setLinkContentReplace ($E.filter.find ('a'));

		setFormContentReplace ($E.filterForm, true);
	};

	var setLinkContentReplace = function ($a) {
		$a.click (function (e) {
			e.preventDefault ();
			var url = $ (e.target).closest ('a').attr ('href');
			getAjaxContent (
				url,
				{
					restore: restorePage.name,
					url: url
				}
			);
		});
	};

	var setFormContentReplace = function ($form, pushState) {
		$form.ajaxForm ({
			beforeSubmit: beforeFormSubmit,
			success: pushState ? ajaxFormSuccess : ajaxFormRestoreSuccess
		});
	};

	var beforeFormSubmit = function (arr) {
		arr.push ({
			name: AJAX_CONT,
			value: AJAX_CONT_VAL
		});
	};

	var ajaxFormSuccess = function (contentHtml, status, xhr, $form) {
		saveState (
			{
				restore: restoreFilter.name,
				term: $E.$searchTerm ($form).val ()
			},
			$form.attr ('action') + '?' + $form.serialize ()
		);
		setContent (contentHtml);
	};

	var ajaxFormRestoreSuccess = function (contentHtml) {
		setContent (contentHtml);
	};

	var getAjaxContent = function (url, state) {
		var data = {};
		data [AJAX_CONT] = AJAX_CONT_VAL;
		$.ajax (
			url,
			{
				data: data,
				dataType: 'html',
				success: function (contentHtml) {
					if (state) {
						saveState (state, url);
					}
					setContent (contentHtml);
				}
			}
		);
	};

	var setContent = function (contentHtml) {
		$ ('.content').html (contentHtml);
		findElements ();
		setButtonEvents ();
	};

	var saveState = function (state, url) {
		history.pushState (state, '', url);
	};

	function restorePage (state) {
		getAjaxContent (state.url, null);
	}

	function restoreFilter (state) {
		$E.$searchTerm ($E.filterForm).val (state.term);
		setFormContentReplace ($E.filterForm, false);
		$E.filterForm.submit ();
	}

	var restore = (function () {
		var functions = {};

		var add = function (f) {
			functions [f.name] = f;
		};

		add (restorePage);
		add (restoreFilter);

		return functions;
	} ());

	return M;
}) ();

tmdp.init ();
