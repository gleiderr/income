export const setVH = () => {
  const debouce = f => {
    let currentDebouce;
    return () => {
      clearTimeout(currentDebouce);
      currentDebouce = setTimeout(() => f(), 15);
    };
  };

  const throttle = f => {
    let inThrottle = false;
    return () => {
      if (!inThrottle) {
        inThrottle = setTimeout(() => {
          f();
          inThrottle = false;
        }, 15);
      }
    };
  };

  /*const scroll = () => {
    let element;
    const {hash = '#incomedocs'} = window.location;
    // alert(`.${hash}.`);
    // console.log(hash);
    switch(hash) {
      case '#incomedocs':
      case '#incomechat':
        element = document.querySelector(hash);
        element && element.scrollIntoView();
        break;
      default:
        element = document.querySelector('#incomedocs');
        element && element.scrollIntoView();
    }
  };*/

  const resize = () => {
    //Recupera e atribui unidade de altura da tela corrente
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    //Rola para sessão corrente
    //scroll();
  };

  resize();
  window.addEventListener('resize', throttle(resize));
  //window.addEventListener('scroll', throttle(scroll));
};

/*function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};*/
