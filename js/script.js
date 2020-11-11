import { SlideNav } from './slide.js';

const slideNav = new SlideNav({
  container: '.slide-container',
  wrapper: '.slide-wrapper',

});

slideNav.init();
slideNav.addArrow({
  prevElement: '.prev',
  nextElement: '.next'
});