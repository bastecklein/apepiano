var e={d:(t,o)=>{for(var n in o)e.o(o,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:o[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)},t={};function o(e){e.addEventListener("contextmenu",(function(e){return e.preventDefault(),e.stopPropagation(),!1}),{passive:!1}),e.addEventListener("ontouchforcechange",(function(e){return e.preventDefault(),e.stopPropagation(),!1}),{passive:!1}),e.addEventListener("webkitmouseforcewillbegin",(function(e){e.preventDefault(),e.stopPropagation()}),{passive:!1}),e.addEventListener("webkitmouseforcedown",(function(e){e.preventDefault(),e.stopPropagation()}),{passive:!1}),e.addEventListener("webkitmouseforceup",(function(e){e.preventDefault(),e.stopPropagation()}),{passive:!1}),e.addEventListener("webkitmouseforcechanged",(function(e){e.preventDefault(),e.stopPropagation()}),{passive:!1}),e.touchAction="none",e.contentZooming="none",e.msTouchAction="none",e.msContentZooming="none",e.style.touchAction="none",e.style.userSelect="none"}e.d(t,{ef:()=>y,Ay:()=>L,lX:()=>f,kx:()=>w,J8:()=>k,Np:()=>p,Me:()=>x}),window.addEventListener("resize",(function(){for(let e in u)g(u[e])})),window.addEventListener("keydown",(function(e){c=!0;for(let t in u){const o=u[t],n=M(o,e.code);n&&(o.keyboardStatus[n]=!0)}})),window.addEventListener("keyup",(function(e){for(let t in u){const o=u[t],n=M(o,e.code);n&&delete o.keyboardStatus[n]}}));const n=navigator.keyboard;let i=null;n&&n.getLayoutMap&&n.getLayoutMap().then((e=>{i=e}));const s=["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"],r=["KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL","Semicolon","Quote"],l=["KeyW","KeyE","KeyT","KeyY","KeyU","KeyO","KeyP","BracketRight"],a=[];for(let e=0;e<8;e++){for(let t=0;t<s.length;t++){let o=e;if(t>2&&o++,a.push(s[t]+o),88==a.length)break}if(88==a.length)break}let c=!1,h=!1,d=!1,u={};function f(){return h}function p(){return d}function y(e){const t=new v(e);return u[t.id]=t,o(t.canvas),g(t),function(e){if(!e||!e.element)return;const t=e.element;let n=!1;e.ignoreOut&&(n=!0),o(t),t.addEventListener("touchstart",(function(e){e.preventDefault(),e.stopPropagation()}),{passive:!1}),t.addEventListener("pointerdown",(function(o){o.preventDefault(),o.stopPropagation();let n="mouse";o.pointerType&&(n=o.pointerType);let i=1;o.pressure&&(i=o.pressure);let s=1;return"mouse"==n&&o.which&&(s=o.which),e.down&&e.down({element:t,id:o.pointerId,x:o.offsetX,y:o.offsetY,type:n,pressure:i,which:s,pageX:o.pageX,pageY:o.pageY}),!1}),{passive:!1}),t.addEventListener("pointermove",(function(o){o.preventDefault(),o.stopPropagation();let n="mouse";o.pointerType&&(n=o.pointerType);let i=1;o.pressure&&(i=o.pressure);let s=1;return"mouse"==n&&o.which&&(s=o.which),e.move&&e.move({element:t,id:o.pointerId,x:o.offsetX,y:o.offsetY,type:n,pressure:i,which:s,pageX:o.pageX,pageY:o.pageY}),!1}),{passive:!1}),n||t.addEventListener("pointerout",(function(o){o.preventDefault(),o.stopPropagation();let n="mouse";o.pointerType&&(n=o.pointerType);let i=1;return"mouse"==n&&o.which&&(i=o.which),e.up&&e.up({element:t,id:o.pointerId,type:n,which:i,evt:"out"}),!1}),{passive:!1}),t.addEventListener("pointerup",(function(o){o.preventDefault(),o.stopPropagation();let n="mouse";o.pointerType&&(n=o.pointerType);let i=1;return"mouse"==n&&o.which&&(i=o.which),e.up&&e.up({element:t,id:o.pointerId,type:n,which:i,evt:"up"}),!1}),{passive:!1})}({element:t.canvas,down:function(e){!function(e,t,o,n){c=!1;const i=n*window.devicePixelRatio,s=Math.floor(.12*e.height);if(i>Math.round(.99*e.height)-s)return void function(e,t){if(e&&e.mapKeyPos)for(let o in e.mapKeyPos){const n=e.mapKeyPos[o];if(t>n.x&&t<n.x+n.w)return e.centerNote=o,e.centerSet=!1,void(e.xOffset=0)}}(e,o*window.devicePixelRatio);S(e,t,C(e,o,n)||null)}(t,e.id,e.x,e.y,e.type,e.pressure,e.which)},move:function(e){!function(e,t,o,n){if(!e.pointerStatus[t])return;S(e,t,C(e,o,n)||null)}(t,e.id,e.x,e.y,e.type,e.pressure,e.which)},end:function(e){!function(e,t){S(e,t,null)}(t,e.id,e.type,e.which)}}),t}function w(e){const t=m(e);return s[(t-1)%s.length]+Math.floor((t+8)/s.length)}function x(e){let t,o,n=s;return t=3===e.length?e.charAt(2):e.charAt(1),o=n.indexOf(e.slice(0,-1)),o=o<3?o+12+12*(t-1)+1:o+12*(t-1)+1,440*Math.pow(2,(o-49)/12)}function k(e=!1){navigator.requestMIDIAccess?navigator.requestMIDIAccess({sysex:!1}).then(b,P):(h=!0,e&&window.adl&&window.adl.showDialog({title:"Not Supported",message:"This device lacks MIDI keyboard support"}))}class v{constructor(e){this.id=function(){function e(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()}(),this.height=0,this.width=0,this.customColors=null,this.inlineKeys=!1,this.keyWidth=72,e.keyWidth&&(this.keyWidth=e.keyWidth),e.inlineKeys&&(this.inlineKeys=e.inlineKeys),e.customColors&&(this.customColors=e.customColors),this.totalWidth=0,this.whiteKeyColor="#ECEFF1",e.whiteKeyColor&&(this.whiteKeyColor=e.whiteKeyColor),this.blackKeyColor="#212121",e.blackKeyColor&&(this.blackKeyColor=e.blackKeyColor),this.activeColor="#1976D2",e.activeColor&&(this.activeColor=e.activeColor),this.keyUp=null,this.keyDown=null,e.keyUp&&(this.keyUp=e.keyUp),e.keyDown&&(this.keyDown=e.keyDown),this.centerNote="A3",this.centerSet=!1,this.xOffset=0,e.centerNote&&(this.centerNote=e.centerNote),this.holder=e.holder,this.holder||console.log("MISSING HOLDER!"),this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.canvas.style.width="100%",this.canvas.style.height="100%",this.holder.appendChild(this.canvas),this.keys=a,this.activeKeys=[],this.whitePositions={},this.blackPositions={},this.pointerStatus={},this.sentDowns={},this.keyboardStatus={},this.midiStatus={},this.mapKeyPos={},this.lockCallback=null}}function g(e){e&&e.canvas&&(e.width=Math.floor(e.holder.offsetWidth*window.devicePixelRatio),e.height=Math.floor(e.holder.offsetHeight*window.devicePixelRatio),e.canvas.width=e.width,e.canvas.height=e.height,e.totalWidth=Math.floor(e.keyWidth*e.keys.length*window.devicePixelRatio),e.centerSet=!1,e.xOffset=0)}function m(e){return Math.round(12*Math.log2(e/440))+49}function b(e){d=!1;const t=e.inputs.values();for(let e=t.next();e&&!e.done;e=t.next())e.value.onmidimessage=K,d=!0;d&&window.adl&&window.adl.showToast({message:"MIDI Keyboard Detected"})}function P(e){console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim "+e)}function K(e){let t=e.data,o=(t[0],t[0],240&t[0]),n=t[1];switch(t[2],o){case 144:!function(e){const t=w(e);if(t){c=!1;for(let e in u){const o=u[e];o.lockCallback?o.lockCallback():o.midiStatus[t]=!0}}}(D(n));break;case 128:!function(e){const t=w(e);if(t){c=!1;for(let e in u){const o=u[e];o.lockCallback?o.lockCallback():delete o.midiStatus[t]}}}(D(n))}}function M(e,t){let o=null;for(let n in e.whitePositions)if(t==e.whitePositions[n].kb){o=n;break}for(let n in e.blackPositions)if(t==e.blackPositions[n].kb){o=n;break}return o}function C(e,t,o){const n=t*window.devicePixelRatio,i=o*window.devicePixelRatio;let s=null;for(let t in e.whitePositions){const o=e.whitePositions[t];if(n>=o.x&&n<o.x+o.w&&i<o.h){s=t;break}}for(let t in e.blackPositions){const o=e.blackPositions[t];if(n>=o.x&&n<o.x+o.w&&i<o.h){s=t;break}}return s}function S(e,t,o){e.pointerStatus[t]=o,o||delete e.pointerStatus[t]}function D(e){return 440*Math.pow(2,(e-69)/12)}function R(e){if(!e||!e.context)return;let t={};for(let o in e.pointerStatus)t[e.pointerStatus[o]]=!0;for(let o in e.keyboardStatus)t[o]=!0;for(let o in e.midiStatus)t[o]=!0;for(let o in t)if(-1==e.activeKeys.indexOf(o)){const t=x(o),n=m(t)+32;e.keyDown(o,t,n)}for(let o=0;o<e.activeKeys.length;o++){const n=e.activeKeys[o];if(!t[n]){const t=x(n),o=m(t)+32;e.keyUp(n,t,o)}}e.activeKeys=[];for(let o in t)e.activeKeys.push(o);const o=Math.floor(e.keyWidth*window.devicePixelRatio),n=Math.floor(o/2),s=Math.floor(n/2),a=Math.floor(.66*e.height),c=Math.floor(.86*e.height);e.canvas.width=e.width;let h=0-e.xOffset;const d=[],u=[];e.whitePositions={},e.blackPositions={};let f=-1,p=-1,y=null,w=null;for(let t=0;t<e.keys.length;t++){const x=e.keys[t];let k=h;x.indexOf("C")>-1&&k>0&&-1==f&&(f=0,p=0);let v=null,g=null;x.indexOf("#")>-1&&!e.inlineKeys?(p>=0&&p<l.length&&(v=l[p],p++),v&&i&&(g=i.get(v)),k-=s,u.push({key:x,x:k,dk:g,idx:t}),e.blackPositions[x]={x:k,w:n,h:a,kb:v,idx:t}):(f>=0&&f<r.length&&(v=r[f],f++),v&&i&&(g=i.get(v)),h+=o,d.push({key:x,x:k,dk:g,idx:t}),e.whitePositions[x]={x:k,w:o,h:c,kb:v,idx:t}),e.centerSet||x!=e.centerNote||(e.xOffset=Math.floor(k-e.width/2),e.centerSet=!0,e.keyboardStatus={},e.pointerStatus={},e.midiStatus={}),k<0&&(y=x),k<e.width&&(w=x)}for(let t=0;t<d.length;t++)I(e,d[t],o,c,e.whiteKeyColor);for(let t=0;t<d.length;t++)E(e,d[t],o,c);for(let t=0;t<u.length;t++)I(e,u[t],n,a,e.blackKeyColor);for(let t=0;t<u.length;t++)E(e,u[t],n,a);h=0;const k=Math.floor(e.width/(.576*e.keys.length)),v=Math.floor(k/2),g=Math.floor(.12*e.height),b=Math.floor(.66*g),P=Math.floor(v/2),K=Math.round(.99*e.height)-g;e.mapKeyPos={};for(let t=0;t<e.keys.length;t++){const o=e.keys[t];let n=h;o.indexOf("#")>-1&&!e.inlineKeys?n-=P:(I(e,{x:n,key:o,idx:t},k,g,e.whiteKeyColor,K,2),e.mapKeyPos[o]={x:h,w:k},h+=k)}h=0;let M=-1,C=-1;for(let t=0;t<e.keys.length;t++){const o=e.keys[t];let n=h;o.indexOf(!e.inlineKeys)>-1?(n-=P,I(e,{x:n,key:o,idx:t},v,b,e.blackKeyColor,K,2)):h+=k,o==y&&(M=n),o==w&&(C=n)}M<0&&(M=0),(C<0||C>e.width)&&(C=e.width),e.context.fillStyle="rgba(0, 0, 255, 0.45)",e.context.fillRect(M,K,C-M,g)}function I(e,t,o,n,i,s=0,r=8){if(e.activeKeys.indexOf(t.key)>-1)e.context.fillStyle=e.activeColor;else if(e.customColors&&e.customColors.length>0){let o=t.idx,n=o-Math.floor(o/e.customColors.length)*e.customColors.length;e.context.fillStyle=e.customColors[n]}else e.context.fillStyle=i;e.context.roundRect?(e.context.beginPath(),e.context.roundRect(t.x,s,o,n,[0,0,r,r]),e.context.fill()):e.context.fillRect(t.x,s,o,n)}function E(e,t,o,n,i=0,s=8){if(e.context.roundRect?(e.context.beginPath(),e.context.roundRect(t.x,i-8,o,n+8,[0,0,s,s]),e.context.lineWidth=2*window.devicePixelRatio,e.context.strokeStyle="rgba(255, 255, 255, 0.35)",e.context.stroke(),e.context.beginPath(),e.context.roundRect(t.x,i-8,o,n+8,[0,0,s,s]),e.context.lineWidth=window.devicePixelRatio,e.context.strokeStyle="#000000",e.context.stroke()):(e.context.lineWidth=2*window.devicePixelRatio,e.context.strokeStyle="rgba(255, 255, 255, 0.35)",e.context.strokeRect(t.x,i-8,o,n+8),e.context.lineWidth=window.devicePixelRatio,e.context.strokeStyle="#000000",e.context.strokeRect(t.x,i-8,o,n+8)),t.dk&&c){const i=Math.round(26*window.devicePixelRatio),s=n-Math.round(36*window.devicePixelRatio);e.context.font="bold "+i+"px Gudea, sans-serif",e.context.fillStyle="#ffffff",e.context.strokeStyle="#000000",e.context.textAlign="center",e.context.fillText(t.dk,t.x+Math.floor(o/2),s),e.context.strokeText(t.dk,t.x+Math.floor(o/2),s)}}const L={createPiano:y,frequencyToNote:w,noteToFrequency:x,gooseUpMidiKeyboard:k,didMidiFail:f,isMidiConnected:p};!function e(){requestAnimationFrame(e);for(let e in u)R(u[e])}();var O=t.ef,T=t.Ay,A=t.lX,W=t.kx,N=t.J8,F=t.Np,U=t.Me;export{O as createPiano,T as default,A as didMidiFail,W as frequencyToNote,N as gooseUpMidiKeyboard,F as isMidiConnected,U as noteToFrequency};