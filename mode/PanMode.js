// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function PanMode (model)
{
    BaseMode.call (this, model);
    this.id = MODE_PAN;
}
PanMode.prototype = new BaseMode ();

PanMode.prototype.onValueKnob = function (index, value)
{
    this.model.getCurrentTrackBank ().setPan (index, value);
};
