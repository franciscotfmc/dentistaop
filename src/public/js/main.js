function ready(fn) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(fn, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function gtag_report_conversion(event) {
  gtag('event', 'conversion', {
    'send_to': event
  });

  return false;
}

(function () {
  ready(function () { });
})();