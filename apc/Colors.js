// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// APC Colors for 5x8 clip matrix
var APC_COLOR_BLACK        = 0;   // off, 
var APC_COLOR_GREEN        = 1;   // green, 7-127 also green
var APC_COLOR_GREEN_BLINK  = 2;   // green blink, 
var APC_COLOR_RED          = 3;   // red, 
var APC_COLOR_RED_BLINK    = 4;   // red blink, 
var APC_COLOR_YELLOW       = 5;   // yellow, 
var APC_COLOR_YELLOW_BLINK = 6;   // yellow blink, 



// -----8<--------------------------------------------------------------------------

/* MPK2 Pad Color Identifiers */
const padColors =
{
    Off: 0x00,
    Red: 0x01,
    Orange: 0x02,
    Amber: 0x03,
    Yellow: 0x04,
    Green: 0x05,
    Green_Blue: 0x06,
    Aqua: 0x07,
    Light_Blue: 0x08,
    Blue: 0x09,
    Purple: 0x0A,
    Pink: 0x0B,
    Hot_Pink: 0x0C,
    Pastel_Purple: 0x0D,
    Pastel_Green: 0x0E,
    Pastel_Pink: 0x0F,
    Grey: 0x10
};

const ClipStatus = {
    Off: 0x00,
    Occupied: 0x01,
    Playing: 0x02,
    Recording: 0x03
}

var armed = initArray(0, 8);
var muted = initArray(0, 8);
var soloed = initArray(0, 8);
//var clipSlots = create2DArray(8, 16);

var bitwigColor = {
    Dark_Grey: [0.3294.toFixed(4), 0.3294.toFixed(4), 0.3294.toFixed(4)],
    Light_Grey: [0.4784.toFixed(4), 0.4784.toFixed(4), 0.4784.toFixed(4)],
    White: [0.7882.toFixed(4), 0.7882.toFixed(4), 0.7882.toFixed(4)],
    Purple_Grey: [0.5255.toFixed(4), 0.5373.toFixed(4), 0.6745.toFixed(4)],
    Dark_Brown: [0.6392.toFixed(4), 0.4745.toFixed(4), 0.2627.toFixed(4)],
    Light_Brown: [0.7765.toFixed(4), 0.6235.toFixed(4), 0.4392.toFixed(4)],
    Purple_Blue: [0.3412.toFixed(4), 0.3804.toFixed(4), 0.7765.toFixed(4)],
    Light_Purple_Blue: [0.5176.toFixed(4), 0.5412.toFixed(4), 0.8784.toFixed(4)],
    Purple: [0.5843.toFixed(4), 0.2863.toFixed(4), 0.7961.toFixed(4)],
    Pink: [0.8510.toFixed(4), 0.2196.toFixed(4), 0.4431.toFixed(4)],
    Red: [0.8510.toFixed(4), 0.1804.toFixed(4), 0.1412.toFixed(4)],
    Orange: [1.0000.toFixed(4), 0.3412.toFixed(4), 0.0235.toFixed(4)],
    Gold: [0.8510.toFixed(4), 0.6157.toFixed(4), 0.0627.toFixed(4)],
    Lime: [0.4510.toFixed(4), 0.5961.toFixed(4), 0.0784.toFixed(4)],
    Green: [0.0000.toFixed(4), 0.6157.toFixed(4), 0.2784.toFixed(4)],
    Aqua: [0.0000.toFixed(4), 0.6510.toFixed(4), 0.5804.toFixed(4)],
    Sky_Blue: [0.0000.toFixed(4), 0.6000.toFixed(4), 0.8510.toFixed(4)],
    Light_Purple: [0.7373.toFixed(4), 0.4627.toFixed(4), 0.9412.toFixed(4)],
    Light_Pink: [0.8824.toFixed(4), 0.4000.toFixed(4), 0.5686.toFixed(4)],
    Pink_Orange: [0.9255.toFixed(4), 0.3804.toFixed(4), 0.3412.toFixed(4)],
    Light_Orange: [1.0000.toFixed(4), 0.5137.toFixed(4), 0.2431.toFixed(4)],
    Light_Gold: [0.8941.toFixed(4), 0.7176.toFixed(4), 0.3059.toFixed(4)],
    Light_Lime: [0.6275.toFixed(4), 0.7529.toFixed(4), 0.2980.toFixed(4)],
    Light_Green: [0.2431.toFixed(4), 0.7333.toFixed(4), 0.3843.toFixed(4)],
    Light_Aqua: [0.2627.toFixed(4), 0.8235.toFixed(4), 0.7255.toFixed(4)],
    Light_Sky_Blue: [0.2667.toFixed(4), 0.7843.toFixed(4), 1.0000.toFixed(4)]
};

function bitwigColorToPadColor(rgbInput) {
    if (areArraysEqual(rgbInput, bitwigColor['Dark_Grey']) == true) { return padColors['Grey']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Light_Grey']) == true) { return padColors['Grey']; }
    else if (areArraysEqual(rgbInput, bitwigColor['White']) == true) { return padColors['Grey']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Purple_Grey']) == true) { return padColors['Purple']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Dark_Brown']) == true) { return padColors['Orange']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Light_Brown']) == true) { return padColors['Orange']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Purple_Blue']) == true) { return padColors['Light_Blue']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Light_Purple_Blue']) == true) { return padColors['Pastel_Purple']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Purple']) == true) { return padColors['Purple']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Pink']) == true) { return padColors['Pink']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Red']) == true) { return padColors['Red']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Orange']) == true) { return padColors['Orange']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Gold']) == true) { return padColors['Orange']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Lime']) == true) { return padColors['Green_Blue']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Green']) == true) { return padColors['Pastel_Green']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Aqua']) == true) { return padColors['Aqua']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Sky_Blue']) == true) { return padColors['Aqua']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Light_Purple']) == true) { return padColors['Pastel_Purple']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Light_Pink']) == true) { return padColors['Hot_Pink']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Pink_Orange']) == true) { return padColors['Pastel_Pink']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Light_Orange']) == true) { return padColors['Orange']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Light_Gold']) == true) { return padColors['Orange']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Light_Lime']) == true) { return padColors['Pastel_Green']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Light_Green']) == true) { return padColors['Pastel_Green']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Light_Aqua']) == true) { return padColors['Aqua']; }
    else if (areArraysEqual(rgbInput, bitwigColor['Light_Sky_Blue']) == true) { return padColors['Light_Blue']; }

}

// -----8<-------------------------------------------------------------------------- 


// APC40mkII Colors for 5x8 clip matrix
var APC_MKII_COLOR_BLACK            = 0;
var APC_MKII_COLOR_GREY_LO          = 1;
var APC_MKII_COLOR_GREY_MD          = 2;
var APC_MKII_COLOR_WHITE            = 3;
var APC_MKII_COLOR_ROSE             = 4;
var APC_MKII_COLOR_RED_HI           = 5;
var APC_MKII_COLOR_RED              = 6;
var APC_MKII_COLOR_RED_LO           = 7;
var APC_MKII_COLOR_RED_AMBER        = 8;
var APC_MKII_COLOR_AMBER_HI         = 9;
var APC_MKII_COLOR_AMBER            = 10;
var APC_MKII_COLOR_AMBER_LO         = 11;
var APC_MKII_COLOR_AMBER_YELLOW     = 12;
var APC_MKII_COLOR_YELLOW_HI        = 13;
var APC_MKII_COLOR_YELLOW           = 14;
var APC_MKII_COLOR_YELLOW_LO        = 15;
var APC_MKII_COLOR_YELLOW_LIME      = 16;
var APC_MKII_COLOR_LIME_HI          = 17;
var APC_MKII_COLOR_LIME             = 18;
var APC_MKII_COLOR_LIME_LO          = 19;
var APC_MKII_COLOR_LIME_GREEN       = 20;
var APC_MKII_COLOR_GREEN_HI         = 21;
var APC_MKII_COLOR_GREEN            = 22;
var APC_MKII_COLOR_GREEN_LO         = 23;
var APC_MKII_COLOR_GREEN_SPRING     = 24;
var APC_MKII_COLOR_SPRING_HI        = 25;
var APC_MKII_COLOR_SPRING           = 26;
var APC_MKII_COLOR_SPRING_LO        = 27;
var APC_MKII_COLOR_SPRING_TURQUOISE = 28;
var APC_MKII_COLOR_TURQUOISE_LO     = 29;
var APC_MKII_COLOR_TURQUOISE        = 30;
var APC_MKII_COLOR_TURQUOISE_HI     = 31;
var APC_MKII_COLOR_TURQUOISE_CYAN   = 32;
var APC_MKII_COLOR_CYAN_HI          = 33;
var APC_MKII_COLOR_CYAN             = 34;
var APC_MKII_COLOR_CYAN_LO          = 35;
var APC_MKII_COLOR_CYAN_SKY         = 36;
var APC_MKII_COLOR_SKY_HI           = 37;
var APC_MKII_COLOR_SKY              = 38;
var APC_MKII_COLOR_SKY_LO           = 39;
var APC_MKII_COLOR_SKY_OCEAN        = 40;
var APC_MKII_COLOR_OCEAN_HI         = 41;
var APC_MKII_COLOR_OCEAN            = 42;
var APC_MKII_COLOR_OCEAN_LO         = 43;
var APC_MKII_COLOR_OCEAN_BLUE       = 44;
var APC_MKII_COLOR_BLUE_HI          = 45;
var APC_MKII_COLOR_BLUE             = 46;
var APC_MKII_COLOR_BLUE_LO          = 47;
var APC_MKII_COLOR_BLUE_ORCHID      = 48;
var APC_MKII_COLOR_ORCHID_HI        = 49;
var APC_MKII_COLOR_ORCHID           = 50;
var APC_MKII_COLOR_ORCHID_LO        = 51;
var APC_MKII_COLOR_ORCHID_MAGENTA   = 52;
var APC_MKII_COLOR_MAGENTA_HI       = 53;
var APC_MKII_COLOR_MAGENTA          = 54;
var APC_MKII_COLOR_MAGENTA_LO       = 55;
var APC_MKII_COLOR_MAGENTA_PINK     = 56;
var APC_MKII_COLOR_PINK_HI          = 57;
var APC_MKII_COLOR_PINK             = 58;
var APC_MKII_COLOR_PINK_LO          = 59;

function setModelSpecificColors (product)
{
    Scales.SCALE_COLOR_OFF          = APC_COLOR_BLACK;
    Scales.SCALE_COLOR_OCTAVE       = APC_MKII_COLOR_RED_HI;
    Scales.SCALE_COLOR_NOTE         = APC_MKII_COLOR_RED_HI;
    Scales.SCALE_COLOR_OUT_OF_SCALE = APC_COLOR_BLACK;

    AbstractView.VIEW_SELECTED   = APC_COLOR_GREEN;
    AbstractView.VIEW_UNSELECTED = APC_COLOR_BLACK;
    AbstractView.VIEW_OFF        = APC_COLOR_BLACK;
            
    /*AbstractSessionView.CLIP_COLOR_IS_RECORDING        = { color: APC_COLOR_RED,    blink: null,                  fast: false };
    AbstractSessionView.CLIP_COLOR_IS_RECORDING_QUEUED = { color: APC_COLOR_RED,    blink: APC_COLOR_RED_BLINK,   fast: false };
    AbstractSessionView.CLIP_COLOR_IS_PLAYING          = { color: APC_COLOR_GREEN,  blink: null,                  fast: false };
    AbstractSessionView.CLIP_COLOR_IS_PLAYING_QUEUED   = { color: APC_COLOR_GREEN,  blink: APC_COLOR_GREEN_BLINK, fast: false };
    AbstractSessionView.CLIP_COLOR_HAS_CONTENT         = { color: APC_COLOR_YELLOW, blink: null,                  fast: false };
    AbstractSessionView.CLIP_COLOR_NO_CONTENT          = { color: APC_COLOR_BLACK,  blink: null,                  fast: false };
    AbstractSessionView.CLIP_COLOR_RECORDING_ARMED     = { color: APC_COLOR_BLACK,  blink: null,                  fast: false };
    AbstractSessionView.USE_CLIP_COLOR                 = true;*/

    AbstractSessionView.CLIP_COLOR_IS_RECORDING        = { color: APC_MKII_COLOR_RED_HI,   blink: APC_MKII_COLOR_RED_HI,    fast: false };
    AbstractSessionView.CLIP_COLOR_IS_RECORDING_QUEUED = { color: APC_MKII_COLOR_RED_HI,   blink: APC_MKII_COLOR_RED_HI,    fast: true  };
    AbstractSessionView.CLIP_COLOR_IS_PLAYING          = { color: APC_MKII_COLOR_GREEN_HI, blink: null,                     fast: false };
    AbstractSessionView.CLIP_COLOR_IS_PLAYING_QUEUED   = { color: APC_MKII_COLOR_GREEN_HI, blink: APC_MKII_COLOR_GREEN_HI,  fast: false  };
    AbstractSessionView.CLIP_COLOR_HAS_CONTENT         = { color: APC_MKII_COLOR_AMBER,    blink: null,                     fast: false };
    AbstractSessionView.CLIP_COLOR_NO_CONTENT          = { color: APC_MKII_COLOR_BLACK,    blink: null,                     fast: false };
    AbstractSessionView.CLIP_COLOR_RECORDING_ARMED     = { color: APC_MKII_COLOR_RED_LO,   blink: null,                     fast: false };
    AbstractSessionView.USE_CLIP_COLOR                 = true;
            
    AbstractSequencerView.COLOR_SELECTED_RESOLUTION_OFF = APC_COLOR_BLACK;
    AbstractSequencerView.COLOR_SELECTED_RESOLUTION_ON  = APC_COLOR_GREEN;
    AbstractSequencerView.COLOR_STEP_HILITE_NO_CONTENT  = APC_COLOR_GREEN;
    AbstractSequencerView.COLOR_STEP_HILITE_CONTENT     = APC_COLOR_GREEN;
    AbstractSequencerView.COLOR_NO_CONTENT              = APC_COLOR_BLACK;
    AbstractSequencerView.COLOR_CONTENT                 = APC_COLOR_RED;
            
    DrumView.COLOR_RECORD           = APC_COLOR_RED;
    DrumView.COLOR_PLAY             = APC_MKII_COLOR_GREEN_HI;
    DrumView.COLOR_SELECTED         = APC_COLOR_YELLOW_BLINK;
    DrumView.COLOR_MUTED            = APC_COLOR_BLACK;
    DrumView.COLOR_SOLO             = APC_COLOR_YELLOW;
    DrumView.COLOR_HAS_CONTENT      = APC_COLOR_YELLOW;
    DrumView.COLOR_NO_CONTENT       = APC_COLOR_BLACK;
    DrumView.COLOR_MEASURE          = APC_COLOR_GREEN;
    DrumView.COLOR_ACTIVE_MEASURE   = APC_COLOR_YELLOW;
            
}