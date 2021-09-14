jQuery(document).ready(function ($) {

    $( ".menu" ).click(function() {
        if($('.nav__list').css('display') == "none"){
            $(".nav__list").css({
                display: "flex"
            })
        }
        else {
            $(".nav__list").css({
                display: "none"
            })
        }
    });
    
  });
  