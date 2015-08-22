var found = searching = null;
var checks = 0;

initFontAwesome();
checkHandleAvailability();

function checkHandleAvailability() {
  if ( found != null ) {
    // the domain is available, yay!
    detectReSearch();

    var domain_container = getElementByXpath('//*[@id="exactMatch"]/div/div[1]');
    var domain = getElementByXpath('//*[@id="exactMatch"]/div/div[1]/p[2]');

    var available = getElementByXpath('//*[@id="exactMatch"]/div/div[1]/p[1]');

    if ( available != null ) {
      available.insertAdjacentHTML('beforeend', '<span style="font-size: 15px; color: #CCC; padding-left: 10px;"><i class="fa fa-twitter" style="padding: 0 5px 0 0;" id="rembrandt-twitter"></i> <i class="fa fa-facebook" style="padding: 0 5px 0 5px;" id="rembrandt-facebook"></i> <i class="fa fa-instagram" style="padding: 0 5px 0 5px;" id="rembrandt-instagram"></i> <i class="fa fa-pinterest" style="padding: 0 0 0 5px;" id="rembrandt-pinterest"></i></span>');
    }

    // check twitter, facebook, instagram, and pinterest for username availability
    if ( domain != null ) {
      var domain_parts = domain.textContent.split(".");

      if ( domain_parts.length > 0 ) {
        var brand = domain_parts[0].trim();
        var xhr = {};

        var networks = ['twitter','facebook','instagram','pinterest'];

        networks.map(function(network) {
          xhr[network] = new XMLHttpRequest();
          xhr[network].open("GET", 'https://www.' + network +'.com/' + brand, true);
          xhr[network].onreadystatechange = function() {
            if (xhr[network].readyState == 4) {
              if (xhr[network].status == 404) {
                document.getElementById("rembrandt-" + network).style.color = '#8dc63f';
              }
            }
          }
          xhr[network].send();
        });

      }
    }
  } else {
    // look for the "Your domain is available" text about once a second
    found = getElementByXpath('//*[@id="exactMatch"]/div/div[1]/p[text() = "Your domain is available!"]');

    setTimeout( checkHandleAvailability, 1000 );
  }
}

function detectReSearch() {
  if ( searching != null ) {
    // loading div found, re-run social network lookups
    searching = null;
    checkHandleAvailability();
  } else {
    // since re-searching is done via ajax, keep an eye out for the loading div
    searching = getElementByXpath('//*[@id="exactMatch"]/center/h1');

    setTimeout( detectReSearch, 100 );
  }
}

// source: http://stackoverflow.com/questions/4535816/how-to-use-font-face-on-a-chrome-extension-in-a-content-script
function initFontAwesome() {
  var fa = document.createElement('style');
  fa.type = 'text/css';
  fa.textContent = '@font-face { font-family: FontAwesome; src: url("'+ chrome.extension.getURL('lib/fa/fonts/fontawesome-webfont.woff?v=4.0.3')+ '"); }';

  document.head.appendChild(fa);
}

// source: http://stackoverflow.com/questions/10596417/is-there-a-way-to-get-element-by-xpath-using-javascript-in-selenium-webdriver
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}