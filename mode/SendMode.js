// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function SendMode (model, sendIndex)
{
    BaseMode.call (this, model);
    this.id = MODE_SEND1 + sendIndex;
    this.sendIndex = sendIndex;
}
SendMode.prototype = new BaseMode ();

SendMode.prototype.onValueKnob = function (index, value)
{
    this.model.getCurrentTrackBank ().setSend (index, this.sendIndex, value);
};
