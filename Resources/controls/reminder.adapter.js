var Moment = require('vendor/moment'),
    alarmManagerModule = require('bencoding.alarmmanager');
alarmManagerModule.enableLogging();

var Модул = function(_args) {
	this.init(_args);

};

Модул.prototype = {
	init : function(_args) {
		var seconds = Moment(_args.time_isostring).unix() - Moment().unix();
		this.alarmManager = alarmManagerModule.createAlarmManager();
		this.alarmManager.addAlarmNotification({
			service : 'de.appwerft.hoerdat.RadioweckerService',
			requestCode : parseInt(seconds) - 600,
			second : parseInt(seconds) - 600,
			showLights : true,
			contentTitle : _args.title.trim(),
			contentText : _args.station + ' :: ' + Moment(_args.time_isostring).format('dddd  HH:mm') + ' Uhr\nvorgemerkt',
			icon : Ti.App.Android.R.drawable.appicon,
			playSound : true,
			sound : Ti.Filesystem.getResRawDirectory() + 'kkj', //Set a custom sound to play
		});
		Ti.Android.NotificationManager.notify(Math.round(Math.random() * 10000), Ti.Android.createNotification({
			contentTitle : _args.title.trim(),
			contentText : _args.station + ' :: ' + Moment(_args.time_isostring).format('dddd  HH:mm') + ' Uhr\nvorgemerkt',
			contentIntent : Ti.Android.createPendingIntent({
				intent : Ti.Android.createIntent({})
			}),
			sound : Ti.Filesystem.getResRawDirectory() + 'kkj.mp3',
			icon : Ti.App.Android.R.drawable.appicon
		}));
		Ti.UI.createNotification({
			message : _args.station + ' :: ' + Moment(_args.time_isostring).format('dddd  HH:mm') + ' Uhr\nvorgemerkt'
		}).show();
	}
};

exports.createReminder = function(_args) {
	return new Модул(_args);
};
