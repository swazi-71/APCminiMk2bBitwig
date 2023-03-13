// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function MidiOutput ()
{
    this.port = host.getMidiOutPort (0);
}

MidiOutput.prototype.sendCC = function (cc, value)
{
    this.port.sendMidi (0xB0, cc, value);
};

MidiOutput.prototype.sendNoteChEx = function (channel, note, velocity)
{
    this.port.sendMidi(channel, note, velocity);
}

MidiOutput.prototype.sendNote = function (note, velocity)
{
    var channel = 0x96;
    if (note > 127) {
        channel = 0x97;
        note = note;
    }
    this.port.sendMidi(channel, note, velocity);
};

MidiOutput.prototype.sendNoteEx = function (channel, note, velocity)
{
    this.port.sendMidi (0x90 + channel, note, velocity);
};

MidiOutput.prototype.sendPitchbend = function (data1, data2)
{
    this.port.sendMidi (0xE0, data1, data2);
};

MidiOutput.prototype.sendSysex = function (data)
{
    this.port.sendSysex (data);
};
