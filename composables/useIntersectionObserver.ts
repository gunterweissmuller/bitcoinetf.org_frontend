import { watch, WatchStopHandle } from 'vue';
import { useWindowSize } from '@vueuse/core';

interface IntersectionObserverConfig {
  root: null | HTMLElement;
  rootMargin: string;
  threshold: number;
}

interface UseInterSectionObserver {
  setObserver: () => void;
  getObserver: () => void;
  observe: (observable : HTMLElement | string) => void;
  disconnect: () => void;
}

type Callback = (entries : IntersectionObserverEntry[], observer: IntersectionObserver) => void;

const { height } = useWindowSize();

export class UseIntersectionObserver implements UseInterSectionObserver {
  protected config = computed<IntersectionObserverConfig>(() => ({
    root: null,
    rootMargin: height.value + 'px',
    threshold: 1.0
  }));

  protected observer : null | IntersectionObserver = null;

  protected watcher : null | WatchStopHandle = null;

  constructor (private cb : Function) {
    this.setObserver();
  }

  protected callback : Callback = (entries) => {
    if (entries[0].isIntersecting) {
      this.cb();
    }
  }

  public setObserver(callback : Callback = this.callback, config : IntersectionObserverConfig = this.config.value) {
    if (this.watcher) {
      this.watcher();
    }

    this.watcher = watch(height, () => {
      this.disconnect();
      this.observer = new IntersectionObserver(callback, config);
    }, { immediate: true })
  }

  public getObserver() {
    return this.observer;
  }

  public observe(observable : HTMLElement | string) {
    let target;
    if (typeof observable === 'object' && observable instanceof HTMLElement) {
      target = observable;
    } else if (typeof observable === 'string') {
      target  = document.querySelector(observable);
    } else {
      throw new Error(`Observable is passed incorrectly: ${observable}`);
    }

    if (target) {
      this.observer?.observe(target);
    } else {
      throw new Error(`Observable not found: ${observable}`);
    }
  }

  public disconnect() {
    this.observer?.disconnect();
  }
}