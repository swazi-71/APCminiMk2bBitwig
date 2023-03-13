// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// Midi Notes
var APC_BUTTON_TRACK_BUTTON1   = 100;
var APC_BUTTON_TRACK_BUTTON2   = 101;
var APC_BUTTON_TRACK_BUTTON3   = 102;
var APC_BUTTON_TRACK_BUTTON4   = 103;
var APC_BUTTON_TRACK_BUTTON5   = 104;
var APC_BUTTON_TRACK_BUTTON6   = 105;
var APC_BUTTON_TRACK_BUTTON7   = 106;
var APC_BUTTON_TRACK_BUTTON8   = 107;
var APC_BUTTON_SCENE_BUTTON1   = 112;
var APC_BUTTON_SCENE_BUTTON2   = 113;
var APC_BUTTON_SCENE_BUTTON3   = 114;
var APC_BUTTON_SCENE_BUTTON4   = 115;
var APC_BUTTON_SCENE_BUTTON5   = 116;
var APC_BUTTON_SCENE_BUTTON6   = 117;
var APC_BUTTON_SCENE_BUTTON7   = 118;
var APC_BUTTON_SCENE_BUTTON8   = 119;
var APC_BUTTON_SHIFT           = 122;

// Midi CC
var APC_KNOB_TRACK_LEVEL1      = 48;
var APC_KNOB_TRACK_LEVEL2      = 49;
var APC_KNOB_TRACK_LEVEL3      = 50;
var APC_KNOB_TRACK_LEVEL4      = 51;
var APC_KNOB_TRACK_LEVEL5      = 52;
var APC_KNOB_TRACK_LEVEL6      = 53;
var APC_KNOB_TRACK_LEVEL7      = 54;
var APC_KNOB_TRACK_LEVEL8      = 55;
var APC_KNOB_MASTER_LEVEL      = 56;

var APC_BUTTON_STATE_OFF   = 0;
var APC_BUTTON_STATE_ON    = 1;
var APC_BUTTON_STATE_BLINK = 2;

var APC_BUTTONS_ALL =
[
    APC_BUTTON_TRACK_BUTTON1,
    APC_BUTTON_TRACK_BUTTON2,
    APC_BUTTON_TRACK_BUTTON3,
    APC_BUTTON_TRACK_BUTTON4,
    APC_BUTTON_TRACK_BUTTON5,
    APC_BUTTON_TRACK_BUTTON6,
    APC_BUTTON_TRACK_BUTTON7,
    APC_BUTTON_TRACK_BUTTON8,
    APC_BUTTON_SCENE_BUTTON1,
    APC_BUTTON_SCENE_BUTTON2,
    APC_BUTTON_SCENE_BUTTON3,
    APC_BUTTON_SCENE_BUTTON4,
    APC_BUTTON_SCENE_BUTTON5,
    APC_BUTTON_SCENE_BUTTON6,
    APC_BUTTON_SCENE_BUTTON7,
    APC_BUTTON_SCENE_BUTTON8,
    APC_BUTTON_SHIFT
];

function APC (output, input)
{
    AbstractControlSurface.call (this, output, input, APC_BUTTONS_ALL);
    
    this.shiftButtonId = APC_BUTTON_SHIFT;

    this.pads = new Grid (output);
}

APC.prototype = new AbstractControlSurface ();

APC.prototype.shutdown = function ()
{
    // Turn off all buttons
    for (var i = 0; i < this.buttons.length; i++)
        this.setButton (this.buttons[i], APC_BUTTON_STATE_OFF);

    this.pads.turnOff ();
};

// Note: Weird to send to the DAW via APC...
APC.prototype.sendMidiEvent = function (status, data1, data2)
{
    this.noteInput.sendRawMidiEvent (status, data1, data2);
};


//--------------------------------------
// ViewState
//--------------------------------------

APC.prototype.updateButtons = function ()
{
    var view = this.getActiveView ();
    for (var i = 0; i < this.buttons.length; i++)
        this.setButton (this.buttons[i], view.usesButton (this.buttons[i]) ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
};

//--------------------------------------
// Display
//--------------------------------------

APC.prototype.setButton = function (button, state)
{
    this.output.sendNote (button,state);
};

APC.prototype.setButtonEx = function (button, channel, state)
{
    this.output.sendNoteEx (channel, button, state);
};

APC.prototype.setLED = function (knob, value)
{
    this.output.sendCC (knob, value);
};

//--------------------------------------
// Handlers
//--------------------------------------

APC.prototype.handleMidi = function (status, data1, data2)
{
    var code = status & 0xF0;
    var channel = status & 0xF;
    switch (code)
    {
        case 0x80:
            this.handleButtons(channel, data1, 0); 
            break;

        case 0x90:
            this.handleButtons (channel, data1, data2);
            break;

        case 0xB0:
            this.handleCC (channel, data1, data2);
            break;
    }
};

APC.prototype.handleButtons = function (channel, note, value)
{
    if (this.isButton (note))
    {
        this.buttonStates[note] = value > 0 ? ButtonEvent.DOWN : ButtonEvent.UP;
        if (this.buttonStates[note] == ButtonEvent.DOWN)
        {
            scheduleTask (function (object, buttonID)
            {
                object.checkButtonState (buttonID);
            }, [this, note], AbstractControlSurface.buttonStateInterval);
        }

        // If consumed flag is set ignore the UP event
        if (this.buttonStates[note] == ButtonEvent.UP && this.buttonConsumed[note])
        {
            this.buttonConsumed[note] = false;
            return;
        }
    }

    this.handleEvent (note, value, channel);
};


APC.prototype.handleEvent = function (note, value, channel)
{
    var view = this.getActiveView ();
    if (view == null)
        return;
        
    var event = this.isButton (note) ? new ButtonEvent (this.buttonStates[note]) : null;
    
    // Clip pads
    if (note < 64)
    {
        view.onGridNote (36 + note, value);
        return;
    }
        
    switch (note)
    {
        case APC_BUTTON_SHIFT:
            view.onShift (event);
            break;

        case APC_BUTTON_TRACK_BUTTON1:
        case APC_BUTTON_TRACK_BUTTON2:
        case APC_BUTTON_TRACK_BUTTON3:
        case APC_BUTTON_TRACK_BUTTON4:
        case APC_BUTTON_TRACK_BUTTON5:
        case APC_BUTTON_TRACK_BUTTON6:
        case APC_BUTTON_TRACK_BUTTON7:
        case APC_BUTTON_TRACK_BUTTON8:
            view.onSelectTrack (note - APC_BUTTON_TRACK_BUTTON1, event);
            break;

        case APC_BUTTON_SCENE_BUTTON1:
        case APC_BUTTON_SCENE_BUTTON2:
        case APC_BUTTON_SCENE_BUTTON3:
        case APC_BUTTON_SCENE_BUTTON4:
        case APC_BUTTON_SCENE_BUTTON5:
        case APC_BUTTON_SCENE_BUTTON6:
        case APC_BUTTON_SCENE_BUTTON7:
        case APC_BUTTON_SCENE_BUTTON8:
            view.onScene (note - APC_BUTTON_SCENE_BUTTON1, event);
            break;
            
        default:
            println ("Unused note: " + note);
            break;
    }
};

APC.prototype.handleCC = function (channel, cc, value)
{
    var view = this.getActiveView ();
    if (view == null)
        return;
        
    switch (cc)
    {
        case APC_KNOB_TRACK_LEVEL1:
        case APC_KNOB_TRACK_LEVEL2:
        case APC_KNOB_TRACK_LEVEL3:
        case APC_KNOB_TRACK_LEVEL4:
        case APC_KNOB_TRACK_LEVEL5:
        case APC_KNOB_TRACK_LEVEL6:
        case APC_KNOB_TRACK_LEVEL7:
        case APC_KNOB_TRACK_LEVEL8:
            view.onValueKnob (cc - APC_KNOB_TRACK_LEVEL1, value);
            break;
            
        case APC_KNOB_MASTER_LEVEL:
            view.onMasterVolume (value);
            break;
            
        default:
            println ("Unused CC: " + cc);
            break;
    }
};
