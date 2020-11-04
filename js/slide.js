export default class Slide {
  constructor({ container, wrapper }) {
    this.container = document.querySelector(container);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    }
  }

  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    
    return this.dist.finalPosition - this.dist.movement;
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.wrapper.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  onStart(event) {
    const moveType = event.type === 'mousedown' ? 'mousemove' : 'touchmove';

    if (event.type === 'mousedown') {
      event.preventDefault();
      this.dist.startX = event.clientX;
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
    }

    this.wrapper.addEventListener(moveType, this.onMove);
  }

  onMove(event) {
    const pointerPosition = event.type === 'mousemove' ? event.clientX : event.changedTouches[0].clientX;

    const finalPosition = this.updatePosition(pointerPosition);

    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    const moveType = event.type === 'mouseup' ? 'mousemove' : 'touchmove';

    this.wrapper.removeEventListener(moveType, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
  }

  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }
  
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();

    return this;
  }
}