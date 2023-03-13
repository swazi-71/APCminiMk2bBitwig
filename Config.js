// ------------------------------
// Static configurations
// ------------------------------

// Inc/Dec of knobs
Config.fractionValue     = 1;
Config.fractionMinValue  = 0.5;
Config.maxParameterValue = 128;

// How fast the track and scene arrows scroll the banks/scenes
Config.trackScrollInterval = 100;
Config.sceneScrollInterval = 100;


// ------------------------------
// Editable configurations
// ------------------------------

Config.FADER_CTRL_OPTIONS = [ "Volume", "Pan", "Send 1", "Send 2", "Send 3", "Send 4", "Send 5", "Send 6", "Send 7", "Send 8", "Device", "Macros" ];
Config.SOFT_KEYS_OPTIONS  = [ "Clip Stop", "Solo", "Mute", "Rec Arm", "Select" ];

Config.SCALES_SCALE = 1;
Config.SCALES_BASE  = 2;
Config.FADER_CTRL   = 3;
Config.SOFT_KEYS    = 4;

Config.scale     = 'Major';
Config.scaleBase = 'C';
Config.faderCtrl = Config.FADER_CTRL_OPTIONS[0];
Config.softKeys  = Config.SOFT_KEYS_OPTIONS[0];

Config.init = function ()
{
    var prefs = host.getPreferences ();

    ///////////////////////////
    // Scale

    var scaleNames = Scales.getNames ();
    Config.scaleSetting = prefs.getEnumSetting ("Scale", "Scales", scaleNames, scaleNames[0]);
    Config.scaleSetting.addValueObserver (function (value)
    {
        Config.scale = value;
        Config.notifyListeners (Config.SCALES_SCALE);
    });
    
    Config.scaleBaseSetting = prefs.getEnumSetting ("Base", "Scales", Scales.BASES, Scales.BASES[0]);
    Config.scaleBaseSetting.addValueObserver (function (value)
    {
        Config.scaleBase = value;
        Config.notifyListeners (Config.SCALES_BASE);
    });
    
    ///////////////////////////
    // Button Control

    Config.faderCtrlSetting = prefs.getEnumSetting ("Fader Ctrl", "Button Control", Config.FADER_CTRL_OPTIONS, Config.FADER_CTRL_OPTIONS[0]);
    Config.faderCtrlSetting.addValueObserver (function (value)
    {
        Config.faderCtrl = value;
        Config.notifyListeners (Config.FADER_CTRL);
    });

    Config.softKeysSetting = prefs.getEnumSetting ("Soft Keys", "Button Control", Config.SOFT_KEYS_OPTIONS, Config.SOFT_KEYS_OPTIONS[0]);
    Config.softKeysSetting.addValueObserver (function (value)
    {
        Config.softKeys = value;
        Config.notifyListeners (Config.SOFT_KEYS);
    });
};

Config.setScale = function (scale)
{
    Config.scaleSetting.set (scale);
};

Config.setScaleBase = function (scaleBase)
{
    Config.scaleBaseSetting.set (scaleBase);
};

Config.setFaderCtrl = function (faderCtrl)
{
    Config.faderCtrlSetting.set (faderCtrl);
};

Config.setSoftKeys = function (softKeys)
{
    Config.softKeysSetting.set (softKeys);
};

// ------------------------------
// Property listeners
// ------------------------------

Config.listeners = [];
for (var i = 0; i <= Config.SOFT_KEYS; i++)
    Config.listeners[i] = [];

Config.addPropertyListener = function (property, listener)
{
    Config.listeners[property].push (listener);
};

Config.notifyListeners = function (property)
{
    var ls = Config.listeners[property];
    for (var i = 0; i < ls.length; i++)
        ls[i].call (null);
};

function Config () {}
