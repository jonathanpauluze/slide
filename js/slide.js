import debounce from './debounce.js';

export class Slide {
  constructor({ container, wrapper }) {
    this.container = document.querySelector(container);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    }
    this.activeClass = 'active';
  }

  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    
    return this.dist.finalPosition - this.dist.movement;
  }

  transition(active) {
    this.wrapper.style.transition = active ? 'transform .3s' : '';
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
    this.transition(false);
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
    this.transition(true);
    this.changeSlideOnEnd();
  }

  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1
    }
  }

  slidePosition(slide) {
    const margin = (this.container.offsetWidth - slide.offsetWidth) / 2;

    return -(slide.offsetLeft - margin);
  }

  slidesConfig() {
    this.slideArray =  [...this.wrapper.children].map(element => {
      const position = this.slidePosition(element);

      return {
        position,
        element
      }
    });
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index];

    this.moveSlide(this.slideArray[index].position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
  }

  changeActiveClass() {
    this.slideArray.forEach(item => item.element.classList.remove('active'));
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  activePrevSlide() {
    this.index.prev !== undefined && this.changeSlide(this.index.prev);
  }

  activeNextSlide() {
    this.index.next !== undefined && this.changeSlide(this.index.next);
  }

  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 500);
  }

  addResizeEvent() {
    window.addEventListener('resize', debounce(this.onResize, 200));
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = this.onResize.bind(this);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    this.slidesConfig();
    this.changeSlide(0);
    this.transition(true);
    this.addResizeEvent();

    return this;
  }
}

export class SlideNav extends Slide {
  addArrow({ prevElement, nextElement }) {
    this.prevElement = document.querySelector(prevElement);
    this.nextElement = document.querySelector(nextElement);
    this.addArrowEvents();
  }

  addArrowEvents() {
    this.prevElement.addEventListener('click', this.activePrevSlide);
    this.nextElement.addEventListener('click', this.activeNextSlide);
  }


}