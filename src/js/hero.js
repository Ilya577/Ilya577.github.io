jQuery(document).ready(function ($) {

  if (window.innerWidth >= 960) {
    $(".hero").css({
      height: window.innerHeight,
    });
    $(".delivery-img").css({
      height: 0.18 * window.innerHeight,
    });
  }
  
});
