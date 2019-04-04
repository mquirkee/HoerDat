
module.exports = function() {
	var $ = Ti.UI.createTabGroup({
		fullscreen : false,
		exitOnClose : true,
		swipeable : false,
		orientationModes : [ Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT ]

	});
	$.addEventListener('open', require('ui/common/main.menu'));

	$.addTab(Ti.UI.createTab({
		title : 'Kalender',
		window : require('ui/common/scheduler.window')($),
		ndx : 0
	}));
	$.addTab(Ti.UI.createTab({
		title : 'Radio',
		window : require('ui/common/radio.window')($),
		ndx : 1
	}));
	$.addTab(Ti.UI.createTab({
		title : 'Hörspiele',
		window : require('ui/common/cachedpool.window')($),
		ndx : 2
	}));
	/*
	 * $.addTab(Ti.UI.createTab({ title : 'Suche', window : win2, ndx : 2 }));
	 */

	var tabindex = Ti.App.Properties.getInt('LASTTAB', 1);
	if (tabindex < $.tabs.length)
		$.setActiveTab(1);

	var timer;
	const Warning = Ti.UI
	.createNotification(
			{
				message : 'Nochmaliges Drücken der Backtaste beendet das Radio.'
			});
	function onBack(_e) {
		
		if (timer == true) {
			Ti.App.fireEvent('stopRadio');
			Warning.hide();
			$.close();
			return false;
		} else {
			Warning.show();
			setTimeout(function() {
				timer = false;
			}, 1000);
		}
		timer = true;
		_e.cancelBubble = true;
		return false;
	}
	$.addEventListener("android:back", onBack);
	$.getTabs().forEach(function(_tab) {
		_tab.addEventListener('selected', function(_e) {
			Ti.App.Properties.setInt('LASTTAB', $.getActiveTab().ndx);
		});
	});

	return $;
};
/*
 * var intent = Ti.Android.createIntent({ action : Ti.Android.ACTION_MAIN, flags :
 * Ti.Android.FLAG_ACTIVITY_NEW_TASK });
 * intent.addCategory(Ti.Android.CATEGORY_HOME);
 * Ti.Android.currentActivity.startActivity(intent);
 */