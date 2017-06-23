var AV = require('./crawler/av/index');
var ABW = require('./crawler/abw/index');
var kufar = require('./crawler/kufar/index');
var fs = require ('fs');

// AV();
// ABW();
// kufar();
var request = require("request"),
    cheerio = require("cheerio"),
    url ='https://www.kufar.by/%D0%BC%D0%B8%D0%BD%D1%81%D0%BA_%D0%B3%D0%BE%D1%80%D0%BE%D0%B4/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%BE%D0%B1%D0%B8%D0%BB%D0%B8-%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B5%D1%82%D1%81%D1%8F?ps=&pe=&cu=BYR&rs=33&re=37&cb=&cbl1=&ms=&me=&conr=&eng=&cgb=&cps=&cpe='
    request(url, function (error, response, body) {
     if (!error) {
        var $ = cheerio.load(body);
        $('.list_ads__info_container').each(function (i) {
            var b = {
                name: $("a[itemprop ='name']").text(),
                releaseDate: $("time[itemprop ='releaseDate']").eq(i).attr('datetime'),
                price: $("b[itemprop ='offers']").eq(i).text().trim(),
                link:$("a[itemprop ='name']").eq(i).attr('href')
            }
            console.log(b);
        })
    } else {
        console.log("We’ve encountered an error: " + error);
        }
    });


