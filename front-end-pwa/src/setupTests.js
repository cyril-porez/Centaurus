jest.mock('axios', () => require('axios/dist/node/axios.cjs'));


import '@testing-library/jest-dom';

// (optionnel) Forcer axios en CommonJS sous Jest si besoin
// jest.mock('axios', () => require('axios/dist/node/axios.cjs'));

const origError = console.error;
console.error = (...args) => {
  const text = args
    .map(a => (a && a.message ? a.message : String(a)))
    .join(' ');
  // Masque le warning "ReactDOMTestUtils.act is deprecated"
  if (text.includes('ReactDOMTestUtils.act') && text.includes('deprecated')) {
    return;
  }
  return origError(...args);
};

const origWarn = console.warn;
console.warn = (...args) => {
  const text = args
    .map(a => (a && a.message ? a.message : String(a)))
    .join(' ');
  // Masque les warnings "React Router Future Flag Warning"
  if (text.includes('React Router Future Flag Warning')) {
    return;
  }
  return origWarn(...args);
};
