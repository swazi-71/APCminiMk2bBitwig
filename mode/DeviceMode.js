// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function DeviceMode (model)
{
    BaseMode.call (this, model);
    this.id = MODE_DEVICE;
}
DeviceMode.prototype = new BaseMode ();

DeviceMode.prototype.onValueKnob = function (index, value)
{
    this.model.getCursorDevice ().setParameter (index, value);
};
