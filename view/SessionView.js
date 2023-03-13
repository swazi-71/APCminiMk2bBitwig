// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function SessionView (model)
{
    AbstractView.call (this, model);

    this.scrollerInterval = Config.sceneScrollInterval;
    this.isTemporary = false;
}

SessionView.prototype = new AbstractView ();

SessionView.prototype.onActivate = function ()
{
    AbstractView.prototype.onActivate.call (this);

    this.model.getCurrentTrackBank ().setIndication (true);
};

SessionView.prototype.updateArrows = function ()
{
    var tb = this.model.getCurrentTrackBank ();
    this.canScrollUp = tb.canScrollScenesUp ();
    this.canScrollDown = tb.canScrollScenesDown ();
    this.canScrollLeft = tb.canScrollTracksUp ();
    this.canScrollRight = tb.canScrollTracksDown ();
};

SessionView.prototype.onScene = function (scene, event)
{
    if (this.surface.isShiftPressed ())
    {
        this.onShiftScene (scene, event);
        return;
    }

    if (event.isDown ())
    {
        this.model.getCurrentTrackBank ().launchScene (scene);
        this.surface.setButton (APC_BUTTON_SCENE_BUTTON1 + scene, APC_BUTTON_STATE_ON);
    }
    else if (event.isUp ())
        this.surface.setButton (APC_BUTTON_SCENE_BUTTON1 + scene, APC_BUTTON_STATE_OFF);
};

SessionView.prototype.onGridNote = function (note, velocity)
{
    if (this.surface.isShiftPressed ())
    {
        this.onShiftGridNote (note, velocity);
        return;
    }

    if (velocity == 0)
        return;
        
    note -= 36;
    var channel = note % 8;
    var scene = 7 - Math.floor (note / 8);
        
    var tb = this.model.getCurrentTrackBank ();
    var slot = tb.getTrack (channel).slots[scene];
    var slots = tb.getClipLauncherSlots (channel);

    if (tb.getTrack (channel).recarm)
    {
        if (!slot.isRecording)
            slots.record (scene);
        slots.launch (scene);
    }
    else
        slots.launch (scene);
    slots.select (scene);
};

SessionView.prototype.scrollLeft = function (event)
{
    var tb = this.model.getCurrentTrackBank ();
    if (this.surface.isShiftPressed ())
        tb.scrollTracksPageUp ();
    else
        tb.scrollTracksUp ();
};

SessionView.prototype.scrollRight = function (event)
{
    var tb = this.model.getCurrentTrackBank ();
    if (this.surface.isShiftPressed ())
        tb.scrollTracksPageDown ();
    else
        tb.scrollTracksDown ();
};

SessionView.prototype.scrollUp = function (event)
{
    var tb = this.model.getCurrentTrackBank ();
    if (this.surface.isShiftPressed ())
        tb.scrollScenesPageUp ();
    else
        tb.scrollScenesUp ();
};

SessionView.prototype.scrollDown = function (event)
{
    var tb = this.model.getCurrentTrackBank ();
    if (this.surface.isShiftPressed ())
        tb.scrollScenesPageDown ();
    else
        tb.scrollScenesDown ();
};

SessionView.prototype.drawGrid = function ()
{
    if (this.surface.isShiftPressed ())
    {
        this.drawShiftGrid ();
        return;
    }
    
    var tb = this.model.getCurrentTrackBank ();
    for (var x = 0; x < 8; x++)
    {
        var t = tb.getTrack (x);
        for (var y = 0; y < 8; y++)
            this.drawPad (t.slots[y], x, y, t.recarm);
    }

    this.drawSceneButtons ();
};

SessionView.prototype.drawPad = function (slot, x, y, isArmed)
{
    var color = APC_COLOR_BLACK;
    var channel = 0x96;

    if (slot.isRecording)
        color = slot.isQueued ? APC_MKII_COLOR_RED_LO : APC_MKII_COLOR_RED_HI;
    else if (slot.isPlaying)
        color = slot.isQueued ? APC_MKII_COLOR_GREEN_LO : APC_MKII_COLOR_LIME_HI;
    else if (slot.hasContent)
        color = slot.color; //APC_MKII_COLOR_AMBER_HI;

    this.surface.pads.lightChEx (channel, (7 - y) * 8 + x, color);
};

