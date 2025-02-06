import { guid, hexToRGB } from "common-helpers";
import { handleInput, clearElementForTouch } from "input-helper";

window.addEventListener("resize", onResize);

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

const keyboard = navigator.keyboard;
let keyboardMap = null;

if(keyboard && keyboard.getLayoutMap) {
    keyboard.getLayoutMap().then((keyboardLayoutMap) => {
        keyboardMap = keyboardLayoutMap;
    });
}

const DEF_KEYWIDTH = 72;

const PIANO_KEYS = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

const KEYBOARD_WHITES = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"];
const KEYBOARD_BLACKS = ["KeyW", "KeyE", "KeyT", "KeyY", "KeyU", "KeyO", "KeyP", "BracketRight"];

const ALL_KEYS = [];

for(let o = 0; o < 8; o++) {
    for(let k = 0; k < PIANO_KEYS.length; k++) {
        let useO = o;

        if(k > 2) {
            useO++;
        }

        ALL_KEYS.push(PIANO_KEYS[k] + useO);

        if(ALL_KEYS.length == 88) {
            break;
        }
    }

    if(ALL_KEYS.length == 88) {
        break;
    }
}

let usingKeyboard = false;
let midiFailed = false;
let midiConnected = false;

let pianoInstances = {};

export function didMidiFail() {
    return midiFailed;
}

export function isMidiConnected() {
    return midiConnected;
}

export function createPiano(options) {
    const piano = new ApePiano(options);

    pianoInstances[piano.id] = piano;

    clearElementForTouch(piano.canvas);

    resizePiano(piano);

    handleInput({
        element: piano.canvas,
        down: function(e) {
            pianoPointerDown(piano, e.id, e.x, e.y, e.type, e.pressure, e.which);
        },
        move: function(e) {
            pianoPointerMove(piano, e.id, e.x, e.y, e.type, e.pressure, e.which);
        },
        up: function(e) {
            pianoPointerUp(piano, e.id, e.type, e.which);
        }
    });

    return piano;
}

export function frequencyToNote(frequency) {
    const noteNumber = frequencyToNoteNumber(frequency);
    const note = PIANO_KEYS[(noteNumber - 1) % PIANO_KEYS.length];
    const octave = Math.floor((noteNumber + 8) /  PIANO_KEYS.length);

    return note + octave;
}

export function noteToFrequency(note) {
    let notes = PIANO_KEYS,
        octave,
        keyNumber;

    if (note.length === 3) {
        octave = note.charAt(2);
    } else {
        octave = note.charAt(1);
    }

    keyNumber = notes.indexOf(note.slice(0, -1));

    if (keyNumber < 3) {
        keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1; 
    } else {
        keyNumber = keyNumber + ((octave - 1) * 12) + 1; 
    }

    return 440 * Math.pow(2, (keyNumber- 49) / 12);
}

export function gooseUpMidiKeyboard(withNotice = false) {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({
            sysex: false
        }).then(onMIDISuccess, onMIDIFailure);
    } else {
        midiFailed = true;
        if(withNotice && window.adl) {
            window.adl.showDialog({
                title: "Not Supported",
                message: "This device lacks MIDI keyboard support"
            });
        }
    }
}

class ApePiano {
    constructor(options) {
        this.id = guid();

        this.height = 0;
        this.width = 0;

        this.customColors = null;
        this.inlineKeys = false;

        this.keyWidth = DEF_KEYWIDTH;

        if(options.keyWidth) {
            this.keyWidth = options.keyWidth;
        }

        if(options.inlineKeys) {
            this.inlineKeys = options.inlineKeys;
        }

        if(options.customColors) {
            this.customColors = options.customColors;
        }

        this.totalWidth = 0;

        this.whiteKeyColor = "#ECEFF1";

        if(options.whiteKeyColor) {
            this.whiteKeyColor = options.whiteKeyColor;
        }

        this.blackKeyColor = "#212121";

        if(options.blackKeyColor) {
            this.blackKeyColor = options.blackKeyColor;
        }

        this.activeColor = "#1976D2";

        if(options.activeColor) {
            this.activeColor = options.activeColor;
        }

        if(options.mapFillColor) {
            this.mapFillColor = options.mapFillColor;
        } else {
            const rgb = hexToRGB(this.activeColor);
            this.mapFillColor = "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 0.45)";
        }

        

        this.keyUp = null;
        this.keyDown = null;

        if(options.keyUp) {
            this.keyUp = options.keyUp;
        }

        if(options.keyDown) {
            this.keyDown = options.keyDown;
        }

        this.centerNote = "A3";
        this.centerSet = false;
        this.xOffset = 0;

        if(options.centerNote) {
            this.centerNote = options.centerNote;
        }

        this.holder = options.holder;

        if(!this.holder) {
            console.log("MISSING HOLDER!");
        }

        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");

        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";

        this.holder.appendChild(this.canvas);

        // at some point, user can specify number of piano keys and then run the loop here
        this.keys = ALL_KEYS;

        this.activeKeys = [];

        this.whitePositions = {};
        this.blackPositions = {};

        this.pointerStatus = {};

        this.sentDowns = {};

        this.keyboardStatus = {};

        this.midiStatus = {};

        this.mapKeyPos = {};

        this.lockCallback = null;
    }
}

function onResize() {
    for(let pianoId in pianoInstances) {
        const piano = pianoInstances[pianoId];

        resizePiano(piano);
    }
}

function onKeyDown(e) {

    usingKeyboard = true;

    for(let pianoId in pianoInstances) {
        const piano = pianoInstances[pianoId];
        const key = convertKeyboardCodeToPianoKey(piano, e.code);

        if(key) {
            piano.keyboardStatus[key] = true;
        }
    }
}

function onKeyUp(e) {
    for(let pianoId in pianoInstances) {
        const piano = pianoInstances[pianoId];
        const key = convertKeyboardCodeToPianoKey(piano, e.code);

        if(key) {
            delete piano.keyboardStatus[key];
        }
    }
}

function resizePiano(piano) {
    if(!piano || !piano.canvas) {
        return;
    }

    piano.width = Math.floor(piano.holder.offsetWidth * window.devicePixelRatio);
    piano.height = Math.floor(piano.holder.offsetHeight * window.devicePixelRatio);

    piano.canvas.width = piano.width;
    piano.canvas.height = piano.height;

    piano.totalWidth = Math.floor(piano.keyWidth * piano.keys.length * window.devicePixelRatio);

    piano.centerSet = false;
    piano.xOffset = 0;
}

// eslint-disable-next-line no-unused-vars
function pianoPointerDown(piano, id, x, y, type, pressure, which) {
    usingKeyboard = false;

    const scaleY = y * window.devicePixelRatio;

    const miniHeightWhite = Math.floor(piano.height * 0.12);

    const dy = Math.round(piano.height * 0.99) - miniHeightWhite;

    if(scaleY > dy) {

        checkRecenterFromMap(piano, x * window.devicePixelRatio);

        return;
    }

    const key = convertCoordToPianoKey(piano, x, y);

    if(key) {
        setActiveKey(piano, id, key);
    } else {
        setActiveKey(piano, id, null);
    }
}

// eslint-disable-next-line no-unused-vars
function pianoPointerMove(piano, id, x, y, type, pressure, which) {

    if(!piano.pointerStatus[id]) {
        return;
    }

    const key = convertCoordToPianoKey(piano, x, y);

    if(key) {
        setActiveKey(piano, id, key);
    } else {
        setActiveKey(piano, id, null);
    }
}

// eslint-disable-next-line no-unused-vars
function pianoPointerUp(piano, id, type, which) {
    setActiveKey(piano, id, null);
}

function frequencyToNoteNumber(frequency) {
    return Math.round(12 * Math.log2(frequency / 440)) + 49;
}

function onMIDISuccess(midiAccess) {
    midiConnected = false;

    const midi = midiAccess;

    const inputs = midi.inputs.values();

    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = onMIDIMessage;
        midiConnected = true;
    }

    if(midiConnected && window.adl) {
        window.adl.showToast({ message: "MIDI Keyboard Detected"});
    }
}

function onMIDIFailure(e) {
    // when we get a failed response, run this code
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}

function onMIDIMessage(message) {

    let data = message.data;

    // eslint-disable-next-line no-unused-vars
    let cmd = data[0] >> 4,
        // eslint-disable-next-line no-unused-vars
        channel = data[0] & 0xf,
        type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
        note = data[1],
        velocity = data[2];

    switch (type) {
    case 144: // noteOn message 
        noteOn(frequencyFromNoteNumber(note), velocity, note);
        break;
    case 128: // noteOff message 
        noteOff(frequencyFromNoteNumber(note), velocity, note);
        break;
    }
}

function convertKeyboardCodeToPianoKey(piano, keyCode) {
    let hitKey = null;

    for(let key in piano.whitePositions) {
        const pos = piano.whitePositions[key];

        if(keyCode == pos.kb) {
            hitKey = key;
            break; 
        }
    }

    for(let key in piano.blackPositions) {
        const pos = piano.blackPositions[key];

        if(keyCode == pos.kb) {
            hitKey = key;
            break; 
        }
    }

    return hitKey;
}

function checkRecenterFromMap(piano, scaleX) {
    if(!piano || !piano.mapKeyPos) {
        return;
    }

    for(let key in piano.mapKeyPos) {
        const pos = piano.mapKeyPos[key];

        if(scaleX > pos.x && scaleX < pos.x + pos.w) {

            piano.centerNote = key;
            piano.centerSet = false;
            piano.xOffset = 0;

            return;
        }
    }
}

function convertCoordToPianoKey(piano, x, y) {

    const cx = x * window.devicePixelRatio;
    const cy = y * window.devicePixelRatio;

    let hitKey = null;

    for(let key in piano.whitePositions) {
        const pos = piano.whitePositions[key];

        if(cx >= pos.x && cx < pos.x + pos.w && cy < pos.h) {
            hitKey = key;
            break; 
        }
    }

    for(let key in piano.blackPositions) {
        const pos = piano.blackPositions[key];

        if(cx >= pos.x && cx < pos.x + pos.w && cy < pos.h) {
            hitKey = key;
            break; 
        }
    }

    return hitKey;
}

function setActiveKey(piano, pointer, key) {
    piano.pointerStatus[pointer] = key;

    if(!key) {
        delete piano.pointerStatus[pointer];
    }
}

function frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}

// eslint-disable-next-line no-unused-vars
function noteOn(freq, vel, note) {

    const key = frequencyToNote(freq);

    if(key) {
        usingKeyboard = false;

        for(let pianoId in pianoInstances) {
            const piano = pianoInstances[pianoId];

            if(piano.lockCallback) {
                piano.lockCallback();
                continue;
            }

            piano.midiStatus[key] = true;
        }
    }
}

// eslint-disable-next-line no-unused-vars
function noteOff(freq, vel, note) {

    const key = frequencyToNote(freq);

    if(key) {
        usingKeyboard = false;

        for(let pianoId in pianoInstances) {
            const piano = pianoInstances[pianoId];

            if(piano.lockCallback) {
                piano.lockCallback();
                continue;
            }

            delete piano.midiStatus[key];
        }
    }
}

function globalRender() {

    requestAnimationFrame(globalRender);

    for(let pianoId in pianoInstances) {
        const piano = pianoInstances[pianoId];

        renderPiano(piano);
    }
}

function renderPiano(piano) {
    if(!piano || !piano.context) {
        return;
    }

    let curActive = {};

    for(let id in piano.pointerStatus) {
        const key = piano.pointerStatus[id];
        curActive[key] = true;
    }

    for(let key in piano.keyboardStatus) {
        curActive[key] = true;
    }

    for(let key in piano.midiStatus) {
        curActive[key] = true;
    }

    for(let key in curActive) {
        if(piano.activeKeys.indexOf(key) == -1) {
            const freq = noteToFrequency(key);
            const num = frequencyToNoteNumber(freq) + 32;

            piano.keyDown(key, freq, num);
        }
    }

    for(let i = 0; i < piano.activeKeys.length; i++) {
        const key = piano.activeKeys[i];

        if(!curActive[key]) {
            const freq = noteToFrequency(key);
            const num = frequencyToNoteNumber(freq) + 32;

            piano.keyUp(key, freq, num);
        }
    }

    piano.activeKeys = [];

    for(let key in curActive) {
        piano.activeKeys.push(key);
    }

    const whiteWidth = Math.floor(piano.keyWidth * window.devicePixelRatio);
    const blackWidth = Math.floor(whiteWidth / 2);
    const halfBlack = Math.floor(blackWidth / 2);
    const blackHeight = Math.floor(piano.height * 0.66);
    const whiteHeight = Math.floor(piano.height * 0.86);

    piano.canvas.width = piano.width;

    let dx = 0 - piano.xOffset;

    const drawWhites = [];
    const drawBlacks = [];

    piano.whitePositions = {};
    piano.blackPositions = {};

    let whiteKeyIdx = -1;
    let blackKeyIdx = -1;

    let minKey = null;
    let maxKey = null;

    for(let i = 0; i < piano.keys.length; i++) {
        const key = piano.keys[i];

        

        let useX = dx;

        if(key.indexOf("C") > -1 && useX > 0 && whiteKeyIdx == -1) {
            whiteKeyIdx = 0;
            blackKeyIdx = 0;
        }

        let keyCode = null;
        let dispKey = null;

        if(key.indexOf("#") > -1 && !piano.inlineKeys) {

            if(blackKeyIdx >= 0 && blackKeyIdx < KEYBOARD_BLACKS.length) {
                keyCode = KEYBOARD_BLACKS[blackKeyIdx];
                blackKeyIdx++;
            }

            if(keyCode && keyboardMap) {
                dispKey = keyboardMap.get(keyCode);
            }

            useX -= halfBlack;

            drawBlacks.push({
                key: key,
                x: useX,
                dk: dispKey,
                idx: i
            });

            piano.blackPositions[key] = {
                x: useX,
                w: blackWidth,
                h: blackHeight,
                kb: keyCode,
                idx: i
            };
        } else {
            if(whiteKeyIdx >= 0 && whiteKeyIdx < KEYBOARD_WHITES.length) {
                keyCode = KEYBOARD_WHITES[whiteKeyIdx];
                whiteKeyIdx++;
            }

            if(keyCode && keyboardMap) {
                dispKey = keyboardMap.get(keyCode);
            }

            dx += whiteWidth;

            drawWhites.push({
                key: key,
                x: useX,
                dk: dispKey,
                idx: i
            });

            piano.whitePositions[key] = {
                x: useX,
                w: whiteWidth,
                h: whiteHeight,
                kb: keyCode,
                idx: i
            };
        }

        if(!piano.centerSet && key == piano.centerNote) {

            piano.xOffset = Math.floor(useX - piano.width / 2);
            piano.centerSet = true;

            piano.keyboardStatus = {};
            piano.pointerStatus = {};
            piano.midiStatus = {};
        }

        if(useX < 0) {
            minKey = key;
        }

        if(useX < piano.width) {
            maxKey = key;
        }
    }

    

    for(let i = 0; i < drawWhites.length; i++) {
        const info = drawWhites[i];

        renderKeyFill(piano, info, whiteWidth, whiteHeight, piano.whiteKeyColor);

    }

    

    for(let i = 0; i < drawWhites.length; i++) {
        const info = drawWhites[i];

        renderKeyStroke(piano, info, whiteWidth, whiteHeight);

    }

    for(let i = 0; i < drawBlacks.length; i++) {

        const info = drawBlacks[i];

        renderKeyFill(piano, info, blackWidth, blackHeight, piano.blackKeyColor);


    }

    for(let i = 0; i < drawBlacks.length; i++) {
        const info = drawBlacks[i];

        renderKeyStroke(piano, info, blackWidth, blackHeight);

    }

    dx = 0;

    const miniWidthWhite = Math.floor(piano.width / (piano.keys.length * 0.576));
    const miniWidthBlack = Math.floor(miniWidthWhite / 2);
    const miniHeightWhite = Math.floor(piano.height * 0.12);
    const miniBlackHeight = Math.floor(miniHeightWhite * 0.66);
    const halfMiniBlack = Math.floor(miniWidthBlack / 2);

    const dy = Math.round(piano.height * 0.99) - miniHeightWhite;

    piano.mapKeyPos = {};

    for(let i = 0; i < piano.keys.length; i++) {
        const key = piano.keys[i];

        let useX = dx;

        if(key.indexOf("#") > -1 && !piano.inlineKeys) {
            useX -= halfMiniBlack;
        } else {
            renderKeyFill(piano, { x: useX, key: key, idx: i }, miniWidthWhite, miniHeightWhite, piano.whiteKeyColor, dy, 2);

            piano.mapKeyPos[key] = {
                x: dx,
                w: miniWidthWhite
            };

            dx += miniWidthWhite;
        }
    }


    dx = 0;

    let minX = -1;
    let maxX = -1;

    for(let i = 0; i < piano.keys.length; i++) {
        const key = piano.keys[i];

        let useX = dx;

        if(key.indexOf("#") > -1 && !piano.inlineKeys) {
            useX -= halfMiniBlack;

            renderKeyFill(piano, { x: useX, key: key, idx: i }, miniWidthBlack, miniBlackHeight, piano.blackKeyColor, dy, 2);
        } else {
            dx += miniWidthWhite;
        }

        if(key == minKey) {
            minX = useX;
        }

        if(key == maxKey) {
            maxX = useX;
        }
    }

    if(minX < 0) {
        minX = 0;
    }

    if(maxX < 0 || maxX > piano.width) {
        maxX = piano.width;
    }

    piano.context.fillStyle = piano.mapFillColor;
    piano.context.fillRect(minX, dy, maxX - minX, miniHeightWhite);
}

function renderKeyFill(piano, info, width, height, color, useY = 0, useRad = 8) {
    if(piano.activeKeys.indexOf(info.key) > -1) {
        piano.context.fillStyle = piano.activeColor;
    } else {
        if(piano.customColors && piano.customColors.length > 0) {
            let idx = info.idx;
            let base = Math.floor(idx / piano.customColors.length);
            let group = base * piano.customColors.length;
            let use = idx - group;
            piano.context.fillStyle = piano.customColors[use];
        } else {
            piano.context.fillStyle = color;
        }
        
    }

    if(piano.context.roundRect) {
        piano.context.beginPath();
        piano.context.roundRect(info.x, useY, width, height, [0, 0, useRad, useRad]);
        piano.context.fill();
    } else{
        piano.context.fillRect(info.x, useY, width, height);
    }
}

function renderKeyStroke(piano, info, width, height, useY = 0, useRad = 8) {
        

    if(piano.context.roundRect) {
        piano.context.beginPath();
        piano.context.roundRect(info.x, useY - 8, width, height + 8, [0, 0, useRad, useRad]);

        piano.context.lineWidth = window.devicePixelRatio * 2;
        piano.context.strokeStyle = "rgba(255, 255, 255, 0.35)";
        piano.context.stroke();

        piano.context.beginPath();
        piano.context.roundRect(info.x, useY - 8, width, height + 8, [0, 0, useRad, useRad]);

        piano.context.lineWidth = window.devicePixelRatio;
        piano.context.strokeStyle = "#000000";
        piano.context.stroke();
    } else {
        piano.context.lineWidth = window.devicePixelRatio * 2;
        piano.context.strokeStyle = "rgba(255, 255, 255, 0.35)";

        piano.context.strokeRect(info.x, useY - 8, width, height + 8);

        piano.context.lineWidth = window.devicePixelRatio;
        piano.context.strokeStyle = "#000000";

        piano.context.strokeRect(info.x, useY - 8, width, height + 8);
    }
   
    if(info.dk && usingKeyboard) {

        const fontSize = Math.round(26 * window.devicePixelRatio);
        const keyIndY = height - Math.round(36 * window.devicePixelRatio);

        piano.context.font = "bold " + fontSize + "px Gudea, sans-serif";
        piano.context.fillStyle = "#ffffff";
        piano.context.strokeStyle = "#000000";
        piano.context.textAlign = "center";

        piano.context.fillText(info.dk, info.x + Math.floor(width / 2), keyIndY);
        piano.context.strokeText(info.dk, info.x + Math.floor(width / 2), keyIndY);
    }
}

export default {
    createPiano,
    frequencyToNote,
    noteToFrequency,
    gooseUpMidiKeyboard,
    didMidiFail,
    isMidiConnected
};

// the last thing
globalRender(0);