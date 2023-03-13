// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function Grid (output)
{
    this.output = output;

    this.arraySize = 8 * 8;
    this.currentButtonColors = initArray (APC_COLOR_BLACK, this.arraySize);
    this.buttonColors = initArray (APC_COLOR_BLACK, this.arraySize);
}

Grid.prototype.lightChEx = function (channel, index, color)
{
    this.buttonColors[index] = color;
}

Grid.prototype.light = function (index, color)
{
    this.buttonColors[index] = color;
};

Grid.prototype.lightEx = function (x, y, color)
{
    this.buttonColors[x + 8 * y] = color;
};

Grid.prototype.flush = function ()
{
    for (var i = 0; i < this.arraySize; i++)
    {
        if (this.currentButtonColors[i] == this.buttonColors[i])
            continue;
        this.currentButtonColors[i] = this.buttonColors[i];
        this.output.sendNote (i, this.buttonColors[i]);
    }
};

Grid.prototype.turnOff = function ()
{
    for (var i = 0; i < this.arraySize; i++)
        this.buttonColors[i] = APC_COLOR_BLACK;
    this.flush ();
};
