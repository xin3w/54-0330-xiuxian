// 定义全局
var pages = [], titles = []

jQuery.hrefReplace = function () {
  $.each($("a"), function (index, value) {
    var aHref = $(this).attr("href");
    if (aHref == "javascript:void(0)" || aHref == "" || aHref == "#") {
      $(this).removeAttr("target");
      $(this).attr("href", "javascript:void(0)");
    }
  });
}
jQuery.goPage = function () {
  var reg = /[^\/]+(?!.*\/)/g;
  var fileName = location.href.match(reg) ? location.href.match(reg)[0] : 'index.html';
  var pos = 0;
  for (var i = 0; i < pages.length; i++) {
    if (pages[i] == fileName) {
      pos = i;
      document.title = titles[pos]
    }
  }
  document.onkeyup = function (e) {
    var e = e || window.event;
    switch (e.keyCode) {
      case 37:
        if (pos > 0) {
          if (reg.test(location.href)) {
            location.href = location.href.replace(reg, pages[pos - 1]);
          } else {
            location.href = location.href + pages[pos - 1];
          }
        }
        break;
      case 39:
        if (pos + 1 != pages.length) {
          if (reg.test(location.href)) {
            location.href = location.href.replace(reg, pages[pos + 1]);
          } else {
            location.href = location.href + pages[pos + 1];
          }
        }
        break;
      case 38:
        location.href = "/"
    }
  };
}
jQuery.getQueryString = function (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  var q = window.location.pathname.substr(1).match(reg_rewrite);
  if (r != null) {
    return unescape(r[2]);
  } else if (q != null) {
    return unescape(q[2]);
  } else {
    return null;
  }
}
jQuery.init = function () {
  $.ajax({
    type: "get",
    url: "data.json",
    dataType: "JSON",
    success: function (res) {
      var data = res.data;
      // 渲染首页目录列表
      if ($('#index').length) {
        var h3 = '';
        var li = '';
        var ul = '';
        var html = ''
        for (var i = 0; i < data.length; i++) {
          h3 = "<h3>" + data[i].category + "</h3>"
          li = ''
          for (var j = 0; j < data[i].data.length; j++) {
            li += '<li class="list-group-item"><a href="' + data[i].data[j].url + '">' + data[i].data[j].title + '</a></li>'
          }
          ul = '<ul class="list-group">' + li + '</ul>'
          html = h3 + ul
          $('#index .container').append(html)
        }
      }
      // 全局url添加
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].data.length; j++) {
          pages.push(data[i].data[j].url)
          titles.push(data[i].data[j].title)
        }
      }
      $.goPage()
    }
  });

}

$(function () {
  $.init()
  $.hrefReplace()
});