import $ from 'jquery/dist/jquery.slim';

export default class Navigation {

  constructor() {

    $.fn.isOnScreen = function() {
      const viewport = {
        top : $(window).scrollTop()
      };

      viewport.bottom = viewport.top + $(window).height();

      const bounds = this.offset();
      bounds.bottom = this.offset().top + this.outerHeight();

      return (!(viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    };

    const $promo = $('.promotion');

    $(window).on('scroll', () => {

      $promo.toArray().forEach(el => {
        const $el = $(el);

        if ($el.isOnScreen()) {

          for(let i=0; i<$el.length; i++) {
            this.scrolly($el);
          }
        }
      });

    });
  }

  scrolly(el) {
    const topOffset = el.offset().top;
    const height = el.height();
    let scrollTop = $(window).scrollTop();
    const maxPixels = height / 4;
    const percentageScrolled = (scrollTop - topOffset) / height;
    let backgroundOffset = maxPixels * percentageScrolled;

    backgroundOffset = Math.round(Math.min(maxPixels, Math.max(0, backgroundOffset)));

    el.css(`background-position`, `right 0px top ${backgroundOffset}px`);
  }

};
