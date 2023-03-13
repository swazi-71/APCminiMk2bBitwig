// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

DrumView.NUM_DISPLAY_COLS = 32;
DrumView.DRUM_START_KEY = 36;

function DrumView (model)
{
    AbstractSequencerView.call (this, model, 128, DrumView.NUM_DISPLAY_COLS);
    this.offsetY = DrumView.DRUM_START_KEY;
    this.canScrollUp = false;
    this.canScrollDown = false;
    this.selectedPad = 0;
    this.pressedKeys = initArray (0, 128);
    this.noteMap = this.scales.getEmptyMatrix ();
    
    this.loopPadPressed = -1;

    var tb = model.getTrackBank ();
    tb.addNoteListener (doObject (this, function (pressed, note, velocity)
    {
        // Light notes send from the sequencer
        this.pressedKeys[note] = pressed ? velocity : 0;
    }));
    tb.addTrackSelectionListener (doObject (this, function (index, isSelected)
    {
        this.clearPressedKeys ();
    }));
}
DrumView.prototype = new AbstractSequencerView ();

DrumView.prototype.updateArrowStates = function ()
{
    this.canScrollLeft = this.offsetX > 0;
    this.canScrollRight = true; // TODO API extension required - We do not know the number of steps
};

DrumView.prototype.updateNoteMapping = function ()
{
    this.noteMap = this.canSelectedTrackHoldNotes () && !this.surface.isSelectPressed () ? this.scales.getDrumMatrix () : this.scales.getEmptyMatrix ();
    this.surface.setKeyTranslationTable (this.noteMap);
};

DrumView.prototype.onGridNote = function (note, velocity)
{
    if (this.surface.isShiftPressed ())
    {
        this.onShiftGridNote (note, velocity);
        return;
    }

    if (!this.canSelectedTrackHoldNotes ())
        return;

    var index = note - 36;
    var x = index % 8;
    var y = Math.floor (index / 8);

    // Sequencer steps
    if (y >= 4)
    {
        if (velocity != 0)
        {
            var col = 8 * (7 - y) + x;
            this.clip.toggleStep (col, this.offsetY + this.selectedPad, Config.accentActive ? Config.fixedAccentValue : velocity);
        }
        return;
    }

    if (x < 4)
    {
        // 4x4 Drum Pad Grid

        this.selectedPad = 4 * y + x;   // 0-16
        var playedPad = velocity == 0 ? -1 : this.selectedPad;

        // Mark selected note
        this.pressedKeys[this.offsetY + this.selectedPad] = velocity;
        this.surface.sendMidiEvent (0x90, this.offsetY + this.selectedPad, velocity);

        if (playedPad < 0)
            return;
        
        return;
    }

    // Clip length/loop area
    var pad = (3 - y) * 4 + x - 4;
    if (velocity > 0)   // Button pressed
    {
        if (this.loopPadPressed == -1)  // Not yet a button pressed, store it
            this.loopPadPressed = pad;
    }
    else if (this.loopPadPressed != -1)
    {
        var start = this.loopPadPressed < pad ? this.loopPadPressed : pad;
        var end   = (this.loopPadPressed < pad ? pad : this.loopPadPressed) + 1;
        var quartersPerPad = this.model.getQuartersPerMeasure ();

        // Set a new loop between the 2 selected pads
        var newStart = start * quartersPerPad;
        this.clip.setLoopStart (newStart);
        this.clip.setLoopLength ((end - start) * quartersPerPad);
        this.clip.setPlayRange (newStart, end * quartersPerPad);

        this.loopPadPressed = -1;
    }
};

DrumView.prototype.onSelectTrack = function (index, event)
{
    if (this.surface.isShiftPressed ())
    {
        AbstractView.prototype.onSelectTrack.call (this, index, event);
        return;
    }
    
    if (!event.isDown ())
        return;
        
    switch (index)
    {
        case 0:
            // Note used
            break;
        case 1:
            // Note used
            break;
        case 2:
            this.onOctaveDown (event);
            break;
        case 3:
            this.onOctaveUp (event);
            break;
    }
};

DrumView.prototype.onOctaveDown = function (event)
{
    if (!event.isDown ())
        return;
    this.clearPressedKeys ();
    this.scales.decDrumOctave ();
    this.offsetY = DrumView.DRUM_START_KEY + this.scales.getDrumOctave () * 16;
    this.updateNoteMapping ();
    displayNotification (this.scales.getDrumRangeText ());
};

DrumView.prototype.onOctaveUp = function (event)
{
    if (!event.isDown ())
        return;
    this.clearPressedKeys ();
    this.scales.incDrumOctave ();
    this.offsetY = DrumView.DRUM_START_KEY + this.scales.getDrumOctave () * 16;
    this.updateNoteMapping ();
    displayNotification (this.scales.getDrumRangeText ());
};

DrumView.prototype.drawGrid = function ()
{
    if (this.surface.isShiftPressed ())
    {
        this.drawShiftGrid ();
        return;
    }
    
    if (!this.canSelectedTrackHoldNotes ())
    {
        this.surface.pads.turnOff ();
        return;
    }

    // 4x4 Drum Pad Grid
    var primary = this.model.getTrackBank ().primaryDevice;
    var hasDrumPads = primary.hasDrumPads ();
    var isSoloed = false;
    if (hasDrumPads)
    {
        for (var i = 0; i < 16; i++)
        {
            if (primary.getDrumPad (i).solo)
            {
                isSoloed = true;
                break;
            }
        }
    }
    var isRecording = this.model.hasRecordingState ();
    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 4; x++)
        {
            var index = 4 * y + x;
            this.surface.pads.lightEx (x, y, this.getPadColor (index, primary, hasDrumPads, isSoloed, isRecording));
        }
    }
    
    // Clip length/loop area
    var step = this.clip.getCurrentStep ();
    var quartersPerPad = this.model.getQuartersPerMeasure ();
    var stepsPerMeasure = Math.round (quartersPerPad / this.resolutions[this.selectedIndex]);
    var currentMeasure = Math.floor (step / stepsPerMeasure);
    var maxQuarters = quartersPerPad * 16;
    var start = this.clip.getLoopStart ();
    var loopStartPad = Math.floor (Math.max (0, start) / quartersPerPad);
    var loopEndPad   = Math.ceil (Math.min (maxQuarters, start + this.clip.getLoopLength ()) / quartersPerPad);
    for (var pad = 0; pad < 16; pad++)
        this.surface.pads.lightEx (4 + pad % 4, 3 - Math.floor (pad / 4), pad >= loopStartPad && pad < loopEndPad ? (pad == currentMeasure ? APC_COLOR_GREEN : APC_COLOR_YELLOW) : APC_COLOR_BLACK, null, false);
            
    // Paint the sequencer steps
    var hiStep = this.isInXRange (step) ? step % DrumView.NUM_DISPLAY_COLS : -1;
    for (var col = 0; col < DrumView.NUM_DISPLAY_COLS; col++)
    {
        var isSet = this.clip.getStep (col, this.offsetY + this.selectedPad);
        var hilite = col == hiStep;
        var x = col % 8;
        var y = 7 - Math.floor (col / 8);
        this.surface.pads.lightEx (x, y, hilite ? APC_COLOR_GREEN : (isSet ?  APC_COLOR_RED : APC_COLOR_BLACK));
    }
    
    this.drawSceneButtons ();
};

DrumView.prototype.getPadColor = function (index, primary, hasDrumPads, isSoloed, isRecording)
{
    // Playing note?
    if (this.pressedKeys[this.offsetY + index] > 0)
        return isRecording ? APC_COLOR_RED : APC_COLOR_GREEN;
    // Selected?
    if (this.selectedPad == index)
        return APC_COLOR_YELLOW_BLINK;
    // Exists and active?
    var drumPad = primary.getDrumPad (index);
    if (!drumPad.exists || !drumPad.activated)
        return APC_COLOR_BLACK;
    // Muted or soloed?
    if (drumPad.mute || (isSoloed && !drumPad.solo))
        return APC_COLOR_YELLOW;
    return APC_COLOR_YELLOW;
};

DrumView.prototype.clearPressedKeys = function ()
{
    for (var i = 0; i < 128; i++)
        this.pressedKeys[i] = 0;
};