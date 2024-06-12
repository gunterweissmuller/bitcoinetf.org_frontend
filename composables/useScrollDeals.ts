import { computed } from 'vue';

export class UseScrollDeals {
  private firstScroll : boolean = false;
  private scrollH : number = 0;
  private prevScrollH : number = 0;
  private scrollStep : number = window.innerHeight / 2;
  private deals : number = 0;

  constructor (dealHeight: number, private callback: Function) {
    this.deals = Math.floor(window.innerHeight / (dealHeight * 2));
  }

  public init () {
    window.addEventListener('scroll', () => {
      this.scrollH = window.scrollY;

      if (this.scrollH - this.prevScrollH >= (!this.firstScroll ? this.scrollStep : this.scrollStep * 2)) {
        this.firstScroll = true;
        this.prevScrollH = this.scrollH;
        this.callback();
      }
    });
  }

  public perPageComp = computed<number>(() => !this.firstScroll ? this.deals * 2 : this.deals);
}
