
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

loadAPI (1);
load ("Config.js");
load ("framework/ClassLoader.js");
load ("apc/ClassLoader.js");
load ("view/ClassLoader.js");
load ("mode/ClassLoader.js");
load ("Controller.js"); 

// This is the only global variable, do not use it.
var controller = null;

host.defineController ("Akai", "APCmini Mk2", "0.1", "f7ab85a0-bc67-11ed-a901-0800200c9a66","T.'swazi' Wallace");
host.defineMidiPorts (1, 1);
host.defineSysexIdentityReply ("F0 7E ?? 06 02 47 4F 00 19 ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? F7");

//createDeviceDiscoveryPairs ("APC MINI Mk2");

function init ()
{
    controller = new Controller ();
    println ("Initialized.");

}

function exit ()
{
    /*if (controller != null)
		this.surface.exit (); */
	println("exit.");
}

function flush ()
{
    if (controller != null)
        controller.flush ();
}