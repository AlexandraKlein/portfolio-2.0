import $ from 'jquery/dist/jquery.min';

export default class IsOnScreen {
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
   }
}