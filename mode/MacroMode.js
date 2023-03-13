// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function MacroMode (model)
{
    BaseMode.call (this, model);
    this.id = MODE_MACRO;
}
MacroMode.prototype = new BaseMode ();

MacroMode.prototype.onValueKnob = function (index, value)
{
    this.model.getCursorDevice ().getMacro (index).getAmount ().set (value, Config.maxParameterValue);
};
