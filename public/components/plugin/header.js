
  $('ul.nav li.dropdown').hover(function() {
  var obj = $(this);
  $(this).find('.dropdown-menu').stop(true, true).delay(80,function () {
    obj.addClass('open');
  });
}, function() {
  var obj = $(this);
  $(this).find('.dropdown-menu').stop(true, true).delay(90).fadeOut(90, function () {
    obj.removeClass('open');
  });

});
$('ul.nav li.dropdown').hover(function() {
  var obj = $(this);
  $(this).find('.dropdown-menu').stop(true, true).delay(80,function () {
    obj.addClass('open');
  });
}, function() {
  var obj = $(this);
  $(this).find('.dropdown-menu').stop(true, true).delay(90).fadeOut(90, function () {
    obj.removeClass('open');
  });

})
