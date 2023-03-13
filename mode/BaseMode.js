// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function BaseMode (model)
{
    AbstractMode.call (this, model);
}
BaseMode.prototype = new AbstractMode ();
