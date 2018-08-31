import $ from 'jquery/dist/jquery.min';

const ele = '.promotion-carousel';
const $window = $(window);
const viewportHeight = $window.height();

let ui = {
  promo: ele + ' .promotion',
  promoText: ele + ' .promo-text',
  navigationItems: '.navigation a'
};

$.fn.isOnScreen = function() {
  const viewport = {
    top : $window.scrollTop()
  };

  viewport.bottom = viewport.top + $window.height();

  const bounds = this.offset();
  bounds.bottom = this.offset().top + this.outerHeight();

  return (!(viewport.bottom < bounds.top || viewport.top > bounds.bottom));
};

export default class ScrollEvents {

  constructor() {
    const $promo = $('.promotion');
    const $promoText = $('.promo-text');

    this.updateNavigation();

    function smoothScroll(target) {
      $('body, html').animate({'scrollTop':target.offset().top}, 600);
    }

    $(ui.navigationItems).on('click', e => {
      e.preventDefault();
      smoothScroll($(e.currentTarget.hash));
    });

    $window.on('scroll', () => {

      $(ui.promo).toArray().forEach(el => {
        const $el = $(el);
        if ($el.isOnScreen()) {
          this.scrolly($el);
        }
      });

      this.updateNavigation();
      this.fadeAtTop($(ui.promoText));
    });
  }

  scrolly(el) {
    const topOffset = el.offset().top;
    const height = el.height();
    let scrollTop = $window.scrollTop();
    const maxPixels = height / 4;
    const percentageScrolled = (scrollTop - topOffset) / height;
    let backgroundOffset = maxPixels * percentageScrolled;

    backgroundOffset = Math.round(Math.min(maxPixels, Math.max(0, backgroundOffset)));

    el.css(`background-position`, `right 0px top ${backgroundOffset}px`);
  }

  fadeAtTop(el) {
    const startPos = 0.25;

    el.toArray().forEach(el => {
      const $el = $(el);
      let position = $el.offset().top - $window.scrollTop() + viewportHeight / 6;
      let opacity = position < viewportHeight * startPos ? position / (viewportHeight * startPos) * 1 : 1;

      $el.css('opacity', opacity);
    });
  }

  updateNavigation() {
    $(ui.promo).toArray().forEach((el) => {
      let $el = $(el);
      let activeSection = $(`.navigation a[href="#${$el.attr('id')}"]`).data('number') - 1;
      if ( ( $el.offset().top - $window.height()/2 < $window.scrollTop() ) && ( $el.offset().top + $el.height() - $window.height()/2 > $window.scrollTop() ) ) {
        $(ui.navigationItems).eq(activeSection).addClass('active');
      } else {
        $(ui.navigationItems).eq(activeSection).removeClass('active');
      }
    });
  }
};
