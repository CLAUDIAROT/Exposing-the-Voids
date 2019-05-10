// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */
var controller = new ScrollMagic.Controller();

var pinIntroScene = new ScrollMagic.Scene({
  triggerElement: '#map04',
  triggerHook: 0,
  duration: '100%'
})
.setPin('#map04')
.addTo(controller);

var pinIntroScene = new ScrollMagic.Scene({
  triggerElement: '#map03',
  triggerHook: 0,
  duration: '200%'
})
.setPin('#map03')
.addTo(controller);

var pinIntroScene = new ScrollMagic.Scene({
  triggerElement: '#map02',
  triggerHook: 0,
  duration: '300%'
})
.setPin('#map02')
.addTo(controller);

var pinIntroScene = new ScrollMagic.Scene({
  triggerElement: '#map01',
  triggerHook: 0,
  duration: '400%'
})
.setPin('#map01')
.addTo(controller);


