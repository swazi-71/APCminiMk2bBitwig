// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function AbstractController ()
{
    this.surface = null;
}

AbstractController.prototype.shutdown = function ()
{
    if (Config.listeners)
    {
        for (var i = 0; i < Config.listeners.length; i++)
            Config.listeners[i] = [];
    }
    this.surface.shutdown ();
};

AbstractController.prototype.flush = function ()
{
    this.surface.flush ();
};

function createDeviceDiscoveryPairs (deviceName)
{
    host.addDeviceNameBasedDiscoveryPair ([ deviceName ], [ deviceName ]);
    for (var i = 1; i < 20; i++)
    {
        var name = i + "- " + deviceName;
        host.addDeviceNameBasedDiscoveryPair ([ name ], [ name ]);
        name = deviceName + " MIDI " + i;
        host.addDeviceNameBasedDiscoveryPair ([ name ], [ name ]);
        name = deviceName + " " + i + " MIDI 1";
        host.addDeviceNameBasedDiscoveryPair ([ name ], [ name ]);
    }
};