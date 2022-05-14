let inspectBox8 = document.querySelector('.box8')


inspectBox8.addEventListener('animationstart', (event) =>
  console.log('animation started', event),
);

inspectBox8.addEventListener('animationend', (event) =>
  console.log('animation ended', event),
);

inspectBox8.addEventListener('animationiteration', (event) =>
  console.log('animation iteration', event),
);
