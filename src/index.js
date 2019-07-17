require(['./Darwin.js'], ({ Darwin }) => {
  // init DOM
  const parent = document.createElement('div');
  parent.classList.add('parent');
  document.body.appendChild(parent);

  // add badge
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

  const inputEl = document.createElement('input'); // input DOM element

  let currentCodeElement = getCodeElement(parent, 'code', 'p');
  currentCodeElement.classList.add('active');
  currentCodeElement.appendChild(inputEl);

  // focusing input element
  inputEl.focus();

  // handle events
  inputEl.addEventListener('keydown', ({ key }) => {
    if (key === 'Enter') { // invoke code
      // get code
      const code = inputEl.value;

      // invoke code and append output element
      const output = getCodeElement(parent, 'output', 'p');
      output.innerHTML = _.flowRight(
        arr => arr.join(' '), // array to string
        _.partial(_.filter, _, el => el !== undefined), // remove undefined
        el => el instanceof Array ? _.flattenDeep(el) : [el], // to Array
        Darwin // 🐟 interpretation
      )(code);

      // init current code element
      currentCodeElement.classList.remove('active');
      currentCodeElement.removeChild(currentCodeElement.lastChild);
      currentCodeElement.innerText = code;

      inputEl.value = '';

      currentCodeElement = getCodeElement(parent, 'code', 'p');
      currentCodeElement.classList.add('active');
      currentCodeElement.appendChild(inputEl);

      // history
      if (code !== '') {
        history.splice(history.length - 1, 0, code);
        historyIndex = history.length - 1;
      }

      // scroll to bottom
      window.scrollTo(0, document.querySelector('p.code.active').offsetTop);

      // focusing input el
      inputEl.focus();
    } else if (key === 'ArrowUp' && historyIndex > 0) { // find history
      inputEl.value = history[--historyIndex];
    } else if (key === 'ArrowDown' && historyIndex < history.length - 1) { // find history
      inputEl.value = history[++historyIndex];
    }
  });

  // scroll handler
  window.addEventListener('scroll', () => {
    if (window.scrollY < 1) {
      badge.classList.remove('top');
    } else {
      badge.classList.add('top');
    }
  });

  /* tools */

  /**
    * get a new dom element
    * 
    * @param {HTMLElement} parent parent DOM element
    * @param {String} className css class name
    * @param {String} nodeName node element name (default: 'p')
    */
  function getCodeElement (parent, className, nodeName = 'p') {
    const el = document.createElement(nodeName);
    el.classList.add(className);
    parent.appendChild(el);
    return el;
  }
});
