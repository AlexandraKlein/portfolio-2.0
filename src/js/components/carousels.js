import "./jquery-global";
import slick from "slick-carousel";

export function SlickCarousel() {
  $(".carousel").slick({
    dots: true,
    infinite: true,
    variableWidth: true,
    slidesToShow: 1,
    prevArrow: $(".arrow-prev"),
    nextArrow: $(".arrow-next"),
  });

  $(".slick-active .slide").addClass("active animate");

  $(".carousel").on("afterChange", function () {
    $(this)
      .find(".slick-active .slide")
      .addClass("animate")
      .siblings()
      .removeClass("animate");

    $(this)
      .find(".slide")
      .removeClass("open")
      .find(".btn .text")
      .text("Learn More");
  });

  $(".carousel .slick-active").addClass("animate");

  $(".carousel .slide")
    .toArray()
    .forEach(el => {
      const $el = $(el);
      const $btn = $el.find(".btn");

      $btn.click(() => {
        let buttonText = $el.hasClass("open") ? "Learn More" : "Back";
        $el.toggleClass("open");

        $btn.find(".text").text(buttonText);
      });
    });
}
