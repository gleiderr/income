import { JSDOM } from 'jsdom';

export function initDOM() {
  const {window} = new JSDOM(`<!DOCTYPE html><body></body></html>`);
  global.window = window;
  global.document = window.document;
  //Polyfill de requestAnimationFrame
  global.requestAnimationFrame =  window.requestAnimationFrame = 
  callback => setTimeout(callback, 0);
}