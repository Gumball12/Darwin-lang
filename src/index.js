require(['./Darwin.js'], ({ Darwin }) => {
  // init DOM
  const parent = document.createElement('div');
  parent.classList.add('parent');
  document.body.appendChild(parent);

  const badge = document.createElement('p');
  badge.innerHTML = [
    '/**',
    '* 🐟 Darwin language',
    '* Simplest Lisp-like postfix FPL',
    '* @author shj (<a target="_blank" href="https://github.com/Gumball12/Darwin-lang">@Gumball12</a>)',
    '* ',
    /*
    '* HELP: help',
    '* EXAMPLES: examples',
    */
    '*/'
  ].join('<br>');
  badge.classList.add('badge');
  parent.appendChild(badge);

  // init variables
  const history = ['']; // code history
  let historyIndex = 0;

  let code = '';
  let index = code.length;
  let currentCodeElement = getCodeElement(parent, 'code');
  currentCodeElement.classList.add('active');

  updateCodeElement(currentCodeElement, code, index);

  // keydown handler
  window.addEventListener('keydown', (evt) => {
    evt.preventDefault();

    const { key } = evt;

    if (key.length === 1) { // insert codes
      code = code.slice(0, index) + key + code.slice(index);
      index++;
    } else if (key === 'Backspace' && index > 0) { // backspace
      code = code.slice(0, index - 1) + code.slice(index);
      index--;
    } else if (key === 'Delete') { // delete
      code = code.slice(0, index) + code.slice(index + 1);
    } else if (key === 'Enter') { // invoke code
      // invoke code and append output element
      const output = getCodeElement(parent, 'output');
      output.innerHTML = _.flowRight(
        arr => arr.join(' '),
        _.partial(_.filter, _, el => el !== undefined),
        el => {
          if (el instanceof Array) {
            return _.flattenDeep(el);
          } else {
            return [el];
          }
        },
        Darwin
      )(code);

      // init current code element
      currentCodeElement.classList.remove('active');
      currentCodeElement = getCodeElement(parent, 'code');
      currentCodeElement.classList.add('active');

      // history
      if (code !== '') {
        history.splice(history.length - 1, 0, code);
        historyIndex = history.length - 1;
      }

      // init variables
      code = '';
      index = 0;

      // scroll to bottom
      window.scrollTo(0, document.querySelector('p.code.active').offsetTop);
    } else if (key === 'ArrowLeft' && index > 0) { // to left
      index--;
    } else if (key === 'ArrowRight' && index < code.length) { // to right
      index++;
    } else if (key === 'ArrowUp' && historyIndex > 0) {
      code = history[--historyIndex];
      index = code.length;
    } else if (key === 'ArrowDown' && historyIndex < history.length - 1) {
      code = history[++historyIndex];
      index = code.length;
    } else if (key === 'End') {
      index = code.length;
    } else if (key === 'Home') {
      index = 0;
    }

    updateCodeElement(currentCodeElement, code, index);
  });

  // scroll handler
  window.addEventListener('scroll', evt => {
    if (window.scrollY < 1) {
      badge.classList.remove('top');
    } else {
      badge.classList.add('top');
    }
  });

  /* tools */

  /**
    * get a new code element(p)
    * 
    * @param {HTMLElement} parent parent DOM element
    * @param {String} className css class name
    */
  function getCodeElement (parent, className) {
    const el = document.createElement('p');
    el.classList.add(className);
    parent.appendChild(el);
    return el;
  }

  /**
    * update current code element
    * 
    * @param {HTMLElement} codeElement current code element
    * @param {String} code
    * @param {Number} index
    */
  function updateCodeElement (codeElement, code, index) {
    codeElement.innerHTML = `${code.slice(0, index)}<span class="bar"></span>${code.slice(index)}`;
  }
});
