module.exports = function(Window) {
    //create module instance
    var self = Ti.UI.createTabGroup({
        fullscreen : true
    });
    self.addEventListener('open', require('ui/common/main.menu'));
    var win1 = new Window('Heute, morgen …');
    require('ui/common/scheduler')(win1);
    var win2 = new Window('Suche');
    require('ui/common/search')(win2);
    var win3 = require('ui/common/radio.window')();
    var tab1 = Ti.UI.createTab({
        title : 'Hörplan',
        window : win1,
        bubbleParent:false
    });
    var tab2 = Ti.UI.createTab({
        title : 'Suche',
        window : win2,        bubbleParent:false

    });
    var tab3 = Ti.UI.createTab({
        title : 'Radio',
        window : win3,        bubbleParent:false

    });
    self.addTab(tab1);
    self.addTab(tab2);
    self.addTab(tab3);
    return self;
};

