(function(){
"use strict";
var pct=function(n){return n+"%";};
function placeTip(stage,hot,tip,cx,cy){
  var sw=stage.clientWidth,sh=stage.clientHeight,tw=tip.offsetWidth,th=tip.offsetHeight,g=22,x,y;
  if(cx+g+tw<=sw-8){x=cx+g;y=cy-th/2;}else if(cx-g-tw>=8){x=cx-g-tw;y=cy-th/2;}
  else{x=cx-tw/2;y=cy+g+th<=sh-8?cy+g:cy-g-th;}
  tip.style.left=Math.round(Math.max(8,Math.min(sw-tw-8,x)))+"px";
  tip.style.top=Math.round(Math.max(8,Math.min(sh-th-8,y)))+"px";}
function visible(el){return!!(el&&el.offsetParent!==null);}
var tours=[];
document.addEventListener("keydown",function(e){
  if(e.altKey||e.ctrlKey||e.metaKey)return;var t=e.target;if(t&&/^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName))return;
  if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft")return;
  for(var i=0;i<tours.length;i++)if(visible(tours[i].root)&&tours[i].active){e.preventDefault();tours[i].key(e.key);return;}});

/* Screenshot click-through, same behaviour as the Patient Explorer walkthrough */
window.ImgTour=function(root,data){
  var q=function(s){return root.querySelector(s);},stage=q(".stage"),hot=q(".hot"),tip=q(".tip"),imgs=root.querySelectorAll(".stage img"),
    front=0,cur=-1,steps=data.steps,prevB=q('[data-a="prev"]'),nextB=q('[data-a="next"]'),resB=q('[data-a="restart"]'),token=0;
  function place(){if(cur<0||!stage.clientWidth)return;var h=steps[cur].hotspot;
    hot.style.left=pct(h.x+h.w/2);hot.style.top=pct(h.y+h.h/2);
    placeTip(stage,hot,tip,(h.x+h.w/2)/100*stage.clientWidth,(h.y+h.h/2)/100*stage.clientHeight);}
  function show(i){if(i<0||i>=steps.length)return;var s=steps[i],my=++token,back=1-front,im=imgs[back];
    im.onload=im.onerror=null;
    var swap=function(){if(my!==token)return;im.alt=s.alt;imgs[front].alt="";im.classList.add("on");imgs[front].classList.remove("on");front=back;};
    im.src=s.image;im.alt="";if(im.complete&&im.naturalWidth)swap();else{im.onload=swap;im.onerror=swap;}
    cur=i;q(".count").textContent="Step "+(i+1)+" of "+steps.length;q("progress").value=(i+1)/steps.length;
    tip.textContent=s.caption;hot.setAttribute("aria-label",s.caption+" Next step.");
    var last=i===steps.length-1;prevB.disabled=i===0;nextB.hidden=last;resB.hidden=!last;place();
    if(steps[i+1]){var p=new Image();p.src=steps[i+1].image;}}
  function next(){show(cur<steps.length-1?cur+1:0);}
  hot.addEventListener("click",function(e){e.stopPropagation();next();});
  nextB.addEventListener("click",next);prevB.addEventListener("click",function(){show(cur-1);});resB.addEventListener("click",function(){show(0);});
  stage.addEventListener("click",function(e){if(e.target===hot)return;if(stage.clientWidth<640){if(cur<steps.length-1)next();return;}
    hot.classList.remove("nudge");void hot.offsetWidth;hot.classList.add("nudge");});
  hot.addEventListener("animationend",function(e){if(e.animationName==="nudge")hot.classList.remove("nudge");});
  new ResizeObserver(place).observe(stage);
  var api={root:root,active:true,key:function(k){if(k==="ArrowRight"){if(cur<steps.length-1)next();}else show(cur-1);},start:function(){if(cur<0)show(0);else place();}};
  tours.push(api);return api;};

/* Guided tour over a live, in-browser demo */
window.LiveTour=function(root,spec){
  var q=function(s){return root.querySelector(s);},stage=q(".lstage"),hot=q(".hot"),tip=q(".tip"),steps=spec.steps,cur=-1,
    prevB=q('[data-a="prev"]'),nextB=q('[data-a="next"]'),resB=q('[data-a="restart"]'),hint=q(".hint"),raf=0;
  function act(a){
    if(a.event){document.dispatchEvent(new CustomEvent("demo-reset",{detail:a.event}));return;}
    if(a.click){var el=stage.querySelector(a.click);if(el)el.click();return;}
    if(a.tab){var t=stage.querySelector(a.tab);if(t&&t.getAttribute("aria-selected")!=="true"&&t.getAttribute("aria-pressed")!=="true")t.click();return;}
    if(a.set){var s=stage.querySelector(a.set[0]);if(s&&s.value!==a.set[1]){s.value=a.set[1];s.dispatchEvent(new Event("change",{bubbles:true}));}return;}
    if(a.check){var c=stage.querySelector(a.check[0]);if(c&&c.checked!==a.check[1]){c.checked=a.check[1];c.dispatchEvent(new Event("change",{bubbles:true}));}}}
  function run(list){(list||[]).forEach(act);}
  function place(){cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){
    if(cur<0||!stage.clientWidth)return;var t=stage.querySelector(steps[cur].t);
    if(!t||!t.getClientRects().length){if(!hot.hidden)hot.hidden=true;tip.style.visibility="hidden";return;}
    if(hot.hidden)hot.hidden=false;tip.style.visibility="";
    var sr=stage.getBoundingClientRect(),r=t.getBoundingClientRect(),
      cx=Math.min(r.left+Math.min(r.width/2,140),sr.right-18)-sr.left,cy=r.top+Math.min(r.height/2,40)-sr.top;
    hot.style.left=cx+"px";hot.style.top=cy+"px";
    var sw=stage.clientWidth,sh=stage.clientHeight,tw=tip.offsetWidth,th=tip.offsetHeight,below=r.bottom-sr.top+14,above=r.top-sr.top-th-14,
      x=Math.max(8,Math.min(sw-tw-8,cx-24)),y=below+th<=sh-8?below:(above>=8?above:Math.min(sh-th-8,cy+22));
    tip.style.left=Math.round(x)+"px";tip.style.top=Math.round(y)+"px";});}
  function show(i,scroll){if(i<0||i>=steps.length)return;cur=i;run(steps[i].pre);
    var s=steps[i],last=i===steps.length-1;
    q(".count").textContent="Step "+(i+1)+" of "+steps.length;q("progress").value=(i+1)/steps.length;
    tip.textContent=s.c;hot.setAttribute("aria-label",s.c+(last?"":" Next step."));
    prevB.disabled=i===0;nextB.hidden=last;resB.hidden=!last;
    hint.textContent="The demo is live: try it yourself at any step.";
    place();
    if(scroll)requestAnimationFrame(function(){var t=stage.querySelector(s.t);if(!t)return;var r=t.getBoundingClientRect();
      if(r.top<80||r.bottom>innerHeight-40)window.scrollBy({top:r.top-innerHeight/2+r.height/2,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});});}
  function forward(){run(steps[cur].go);if(cur<steps.length-1)show(cur+1,true);else place();}
  hot.addEventListener("click",function(e){e.stopPropagation();forward();});
  nextB.addEventListener("click",forward);prevB.addEventListener("click",function(){show(cur-1,true);});
  resB.addEventListener("click",function(){run(spec.reset);show(0,true);});
  new ResizeObserver(place).observe(stage);
  new MutationObserver(function(ms){if(ms.some(function(m){return m.target!==hot&&m.target!==tip&&!tip.contains(m.target);}))place();}).observe(stage,{childList:true,subtree:true,attributes:true,attributeFilter:["aria-selected","class","hidden"]});
  window.addEventListener("resize",place);
  var api={root:root,active:true,key:function(k){if(k==="ArrowRight")forward();else show(cur-1,true);},start:function(){if(cur<0)show(0,false);else place();}};
  tours.push(api);return api;};
})();

(function(){
"use strict";
var docEl=document.documentElement;
var m=location.hash.match(/^#\/work\/([\w-]+)/);
if(m){location.replace((document.body.getAttribute("data-root")||"")+"work/"+m[1]+"/");return;}
var tb=document.getElementById("theme");
function syncTheme(){var d=docEl.getAttribute("data-theme")==="dark",l=d?"Switch to light theme":"Switch to dark theme";tb.setAttribute("aria-label",l);tb.title=l;}
tb.addEventListener("click",function(){var d=docEl.getAttribute("data-theme")!=="dark";
  if(d)docEl.setAttribute("data-theme","dark");else docEl.removeAttribute("data-theme");
  try{localStorage.setItem("bp-theme",d?"dark":"light");}catch(e){}syncTheme();});
syncTheme();
var mb=document.getElementById("menu"),nl=document.getElementById("navlist");
function closeMenu(){nl.classList.remove("open");mb.setAttribute("aria-expanded","false");mb.setAttribute("aria-label","Open menu");}
mb.addEventListener("click",function(){var o=!nl.classList.contains("open");nl.classList.toggle("open",o);
  mb.setAttribute("aria-expanded",o);mb.setAttribute("aria-label",o?"Close menu":"Open menu");});
nl.addEventListener("click",function(e){if(e.target.closest("a"))closeMenu();});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&nl.classList.contains("open")){closeMenu();mb.focus();}});
var links=[].slice.call(document.querySelectorAll(".nav ul a")),secs=document.querySelectorAll(".home section[id]");
if(secs.length){var spy=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)
  links.forEach(function(a){a.setAttribute("aria-current",a.hash==="#"+e.target.id);});});},{rootMargin:"-25% 0px -65% 0px"});
  [].forEach.call(secs,function(s){spy.observe(s);});}
var rv=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("seen");rv.unobserve(e.target);}});},{threshold:.12});
[].forEach.call(document.querySelectorAll(".rv,.metric"),function(el){rv.observe(el);});
var bar=document.querySelector("#progress i");
addEventListener("scroll",function(){var max=docEl.scrollHeight-innerHeight;bar.style.transform="scaleX("+(max>0?scrollY/max:0)+")";},{passive:true});
var copy=document.getElementById("copy");
if(copy)copy.addEventListener("click",function(){var addr=copy.getAttribute("data-addr"),done=function(){copy.textContent="Copied";copy.classList.add("done");
  setTimeout(function(){copy.textContent="Copy email";copy.classList.remove("done");},1800);};
  if(navigator.clipboard)navigator.clipboard.writeText(addr).then(done,function(){copy.textContent="Press Ctrl+C";});
  else copy.textContent="Press Ctrl+C";});
[].forEach.call(document.querySelectorAll(".tour[data-kind]"),function(el){
  var t=el.getAttribute("data-kind")==="img"?ImgTour(el,JSON.parse(document.getElementById(el.getAttribute("data-src")).textContent))
    :LiveTour(el,window.__TOURS[el.getAttribute("data-p")]);
  requestAnimationFrame(function(){t.start();});});
})();
