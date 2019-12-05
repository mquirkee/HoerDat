const Moment = require('vendor/moment');
Moment.locale('de');
const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
const Pool = require("controls/pool");
const ID3 = require("de.appwerft.mp3agic");
const visualizerView = require('ui/common/visualizer.widget')();
var audioPlayer = Ti.Media.createAudioPlayer({
	allowBackground : true,
	audioFocus : true
});

module.exports = function(opts, renderParentSections) {
	var HEIGHT;
	const start = new Date().getTime();
	const duration = opts.duration,
	    position = Pool.getPosition(opts.id),
	    url = opts.url,
	    cover = opts.cover,
	    mp3file = Pool.getCachedFile(url);
	const $ = Ti.UI.createWindow({
		fullscreen : false,
		backgroundColor : '#225588',
		itemId : opts.id,
		meta : {
			title : opts.author,
			subtitle : opts.title
		}
	});

	setTimeout(function() {
		$.topContainer = Ti.UI.createView({
			top : 0,
			height : SCREENWIDTH
		});
		$.add($.topContainer);
		$.topView = Ti.UI.createImageView({
			top : 0,
			width : SCREENWIDTH,
			height : 'auto',
			image : cover
		});
		$.topContainer.add($.topView);
		$.progressLabel = Ti.UI.createLabel({
			text : '00:00',
			bottom : 5,
			left : 5,
			font : {
				fontSize : 32
			}
		});
		function onPostlayout(e) {
			$.topView.removeEventListener("postlayout", onPostlayout);
			HEIGHT = e.source.size.height;
			$.topContainer.height = HEIGHT;
			$.bottomContainer.top = HEIGHT;
			$.thumbView = Ti.UI.createView({
				right : 0,
				bottom : 0,
				width : 100,
				height : 100
			});
			$.topContainer.add($.thumbView);

			$.topConatiner.add($.progressLabel);

			$.playcontrolButton = require('ui/common/playbutton.widget')(function() {
				if (audioPlayer.playing) {
					$.remove(visualizerView);
					audioPlayer.pause();
					$.playcontrolButton.setPause();
				} else {
					Ti.App.fireEvent('stopRadio');
					audioPlayer.url = mp3file.nativePath;
					audioPlayer.time = Pool.getPosition(opts.id);
					audioPlayer.start();
					audioPlayer.itemId = $.itemId;
					$.playcontrolButton.setPlay();
					$.add(visualizerView);
				}
			});
			$.topContainer.add($.playcontrolButton);
			if (mp3file && ID3.getId3v2Tag(mp3file)) {
				const albumimage = ID3.createAlbumImage({
					image : mp3file,
				});
				albumimage && $.thumbView.add(albumimage);
			} else
				console.log("mp3 has no id3v2");
		}


		$.topView.addEventListener("postlayout", onPostlayout);
		function onProgress(e) {
			$.progressView.width = e.progress / duration * 100 + '%';
			Pool.setPosition(opts.id, e.progress);
		}


		audioPlayer.removeEventListener('progress', onProgress);
		audioPlayer.addEventListener('progress', onProgress);
		$.add($.topContainer);

		$.progressView = Ti.UI.createView({
			top : 0,
			left : 0,
			height : 10,
			width : (position / duration * 100) + '%',
			backgroundColor : 'orange'
		});
		$.topContainer.add($.progressView);

		$.topContainer.addEventListener('singletap', function(e) {
			Ti.Media.vibrate([10]);
			if (e.y < 50) {
				$.progressView.width = (e.x / SCREENWIDTH) * 100 + '%';
				audioPlayer.time = e.x / SCREENWIDTH * duration;
			}
		});
		$.bottomContainer = Ti.UI.createScrollView({
			scrollType : 'vertical',
			layout : 'vertical',
			backgroundColor : 'white',
			top : SCREENWIDTH

		});
		$.bottomContainer.add(Ti.UI.createLabel({
			text : opts.title,
			left : 10,
			right : 10,
			top : 10,
			color : '#225588',
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 24,
				fontWeight : 'bold',
				fontFamily : 'Rambla-Bold'
			}

		}));
		if (opts.author && opts.author.length) {
			$.bottomContainer.add(Ti.UI.createLabel({
				text : opts.author,
				left : 10,
				right : 10,
				top : 5,
				color : '#444',
				width : Ti.UI.FILL,
				height : Ti.UI.SIZE,
				font : {
					fontSize : 18,
					fontWeight : 'bold',
					fontFamily : 'Rambla-Bold'
				}

			}));
		}
		$.bottomContainer.add(Ti.UI.createLabel({
			text : opts.description + "\n\n\n	",
			left : 10,
			right : 10,
			font : {
				fontSize : 18,
				fontFamily : 'Rambla'
			},
			top : 5,
			color : 'black',
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE
		}));
		$.add($.bottomContainer);
		$.addEventListener('close', function() {
			audioPlayer.removeEventListener('progress', onProgress);
			$.remove(visualizerView);
			renderParentSections();
			audioPlayer.stop();
			audioPlayer.release();
		});
		audioPlayer.addEventListener('complete', function() {
			require('ui/common/audiodialog.widget')($);
		});
	}, 250);
	$.addEventListener('open', require('ui/common/podcast.menu'));
	return $;
};