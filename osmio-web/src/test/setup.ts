import '@testing-library/jest-dom/vitest'

// boneyard-js mide el contenedor con ResizeObserver y escucha el tema del
// sistema con matchMedia. jsdom no implementa ninguno de los dos, así que sin
// estos stubs cualquier test que monte `<Skeleton>` falla al primer render.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

if (!('ResizeObserver' in window)) {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  ;(window as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver =
    ResizeObserverStub as unknown as typeof ResizeObserver
}
