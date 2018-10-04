import $ from 'jquery/dist/jquery.min';

export function isOnScreen(el) {
  const viewport = {
    top : $(window).scrollTop()
  };

  viewport.bottom = viewport.top + $(window).height();

  const bounds = el.offset();
  bounds.bottom = el.offset().top + el.outerHeight();

  return (!(viewport.bottom < bounds.top || viewport.top > bounds.bottom));
}