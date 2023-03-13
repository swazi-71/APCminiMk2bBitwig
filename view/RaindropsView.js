// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

RaindropsView.NUM_DISPLAY_ROWS = 8;
RaindropsView.NUM_DISPLAY_COLS = 8;
RaindropsView.NUM_OCTAVE       = 12;
RaindropsView.START_KEY        = 36;

function RaindropsView (model)
{
    AbstractSequencerView.call (this, model, 128, 32 * 16 /* Biggest number in Fixed Length */);
    this.offsetY = RaindropsView.START_KEY;
    this.clip.scrollTo (0, RaindropsView.START_KEY);
    
    this.ongoingResolutionChange = false;
}
RaindropsView.prototype = new AbstractSequencerView ();

RaindropsView.prototype.onActivate = function ()
{
    this.updateScale ();
    AbstractSequencerView.prototype.onActivate.call (this);
};

RaindropsView.prototype.updateArrowStates = function ()
{
    this.canScrollUp = false;
    this.canScrollDown = false;
    this.canScrollLeft = this.offsetY - RaindropsView.NUM_OCTAVE >= 0;
    this.canScrollRight = this.offsetY + RaindropsView.NUM_OCTAVE <= this.clip.getRowSize () - RaindropsView.NUM_OCTAVE;

    this.drawSceneButtons ();
};

RaindropsView.prototype.updateNoteMapping = function ()
{
    AbstractSequencerView.prototype.updateNoteMapping.call (this);
    this.updateScale ();
};

RaindropsView.prototype.updateScale = function ()
{
    this.noteMap = this.canSelectedTrackHoldNotes () ? this.scales.getSequencerMatrix (RaindropsView.NUM_DISPLAY_ROWS, this.offsetY) : this.scales.getEmptyMatrix ();
};

RaindropsView.prototype.onGridNote = function (note, velocity)
{
    if (this.surface.isShiftPressed ())
    {
        this.onShiftGridNote (note, velocity);
        return;
    }

    if (!this.canSelectedTrackHoldNotes ())
        return;
    if (velocity == 0)
        return;
    var index = note - 36;
    var x = index % 8;
    var y = Math.floor (index / 8);
    var stepsize = y == 0 ? 1 : 2 * y;

    var length = this.clip.getLoopLength () / this.resolutions[this.selectedIndex];
    var distance = this.getNoteDistance (this.noteMap[x], length);
    this.clip.clearRow (this.noteMap[x]);
    if (distance == -1 || distance != (y == 0 ? 1 : y * 2))
    {
        var offset = this.clip.getCurrentStep () % stepsize;
        for (var i = offset; i < length; i += stepsize)
            this.clip.setStep (i, this.noteMap[x], velocity, this.resolutions[this.selectedIndex]);
    }
};

RaindropsView.prototype.onScene = function (index, event)
{
    this.ongoingResolutionChange = true;
    AbstractSequencerView.prototype.onScene.call (this, index, event);
    this.ongoingResolutionChange = false;    
};

RaindropsView.prototype.onOctaveDown = function (event)
{
    if (event.isDown ())
        this.scrollDown (event);
};

RaindropsView.prototype.onOctaveUp = function (event)
{
    if (event.isDown ())
        this.scrollUp (event);
};

RaindropsView.prototype.scrollRight = function (event)
{
    this.offsetY = Math.min (this.clip.getRowSize () - RaindropsView.NUM_OCTAVE, this.offsetY + RaindropsView.NUM_OCTAVE);
    this.updateScale ();
    displayNotification ('          ' + this.scales.getSequencerRangeText (this.noteMap[0], this.noteMap[7]));
};

RaindropsView.prototype.scrollLeft = function (event)
{
    this.offsetY = Math.max (0, this.offsetY - RaindropsView.NUM_OCTAVE);
    this.updateScale ();
    displayNotification ('          ' + this.scales.getSequencerRangeText (this.noteMap[0], this.noteMap[7]));
};

RaindropsView.prototype.drawGrid = function ()
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
    
    if (this.ongoingResolutionChange)
        return;

    var length = this.clip.getLoopLength () / this.resolutions[this.selectedIndex];
    var step = this.clip.getCurrentStep ();
    
    for (var x = 0; x < RaindropsView.NUM_DISPLAY_COLS; x++)
    {
        var left = this.getNoteDistanceToTheLeft (this.noteMap[x], step, length);
        var right = this.getNoteDistanceToTheRight (this.noteMap[x], step, length);
        var isOn = left >= 0 && right >= 0;
        var sum = left + right;
        var distance = sum == 0 ? 0 : (sum + 1) / 2;
        
        for (var y = 0; y < RaindropsView.NUM_DISPLAY_ROWS; y++)
        {
            var color = y == 0 ? this.scales.getColor (this.noteMap, x) : APC_COLOR_BLACK;
            if (isOn)
            {
                if (y == distance)
                    color = APC_COLOR_RED;
                if ((left <= distance && y == left) || (left > distance && y == sum - left))
                    color = APC_COLOR_GREEN;
            }
            this.surface.pads.lightEx (x, y, color, null, false);
        }
    }
    
    this.drawSceneButtons ();
};

RaindropsView.prototype.getNoteDistance = function (row, length)
{
    var step = 0;
    for (step = 0; step < length; step++)
    {
        if (this.clip.getStep (step, row))
            break;
    }
    if (step >= length)
        return -1;
    for (var step2 = step + 1; step2 < length; step2++)
    {
        if (this.clip.getStep (step2, row))
            return step2 - step;
    }
    return -1;
};

RaindropsView.prototype.getNoteDistanceToTheRight = function (row, start, length)
{
    if (start < 0 || start >= length)
        return -1;
    var step = start;
    var counter = 0;
    do
    {
        if (this.clip.getStep (step, row))
            return counter;
        step++;
        counter++;
        if (step >= length)
            step = 0;
    } while (step != start);
    return -1;
};

RaindropsView.prototype.getNoteDistanceToTheLeft = function (row, start, length)
{
    if (start < 0 || start >= length)
        return -1;
    start = start == 0 ? length - 1 : start - 1;
    var step = start;
    var counter = 0;
    do
    {
        if (this.clip.getStep (step, row))
            return counter;
        step--;
        counter++;
        if (step < 0)
            step = length - 1;
    } while (step != start);
    return -1;
};

RaindropsView.prototype.onSelectTrack = function (index, event)
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
            this.scales.prevScale ();
            Config.setScale (this.scales.getName (this.scales.getSelectedScale ()));
            displayNotification (this.scales.getName (this.scales.getSelectedScale ()));
            break;
        case 1:
            this.scales.nextScale ();
            Config.setScale (this.scales.getName (this.scales.getSelectedScale ()));
            displayNotification (this.scales.getName (this.scales.getSelectedScale ()));
            break;
        case 2:
            break;
        case 3:
            break;
    }
    this.updateScale ();
};

