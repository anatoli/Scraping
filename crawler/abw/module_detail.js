/**
 * Created by arinovich.anatoli on 05.06.2017.
 */
var log = require('cllc')();
var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');

var results = [];

var module_detail = module.exports = function (URL) {

    var q = tress(
        function(url, callback){
        needle.get(url, function(err, res){
            if (err || res.statusCode !== 200) {
                log.e((err || res.statusCode) + ' - ' + url);
                return callback(true); // возвращаем url в начало очереди
            }

            var $ = cheerio.load(res.body);

            $('.product-full-inner').each(function (i) {
                results.push({
                    name: $('.product-full-inner .data-first .title').eq(i).text().trim(),
                    link: $('.product-full-inner a').eq(i).attr('href'),
                    description:$('.product-full-inner .description').eq(i).text().trim(),
                    value: $('.product-full-inner .excerpt').eq(i).text().trim(),
                    year: $('.data-second-item .data-year div:first-child').eq(i).text().trim(),
                    price: {
                        BYN:$('.data-price-byn').eq(i).text().trim(),
                        USD:$('.data-price-usd').eq(i).text().trim()
                    },
                    location: $('.location').eq(i).text().trim(),
                    img: $('.product-thumb >img').attr('src'),

                });
            });


            $('.next').each(function() {
                q.push(URL + $(this).attr('href'));
            });

            // $('.bpr_next>a').each(function() {
            //     q.push(resolve(URL+'', $(this).attr('href')));
            // });
            console.log(results);

            callback();
        });
    }, 20);

    q.drain = function(){
        fs.writeFileSync('./abw/abw_next.json', JSON.stringify(results, null, 4));
        console.log('finish');

    }

    q.retry = function(){
        q.pause();
        // в this лежит возвращённая в очередь задача.
        log.i('Paused on:', this);
        setTimeout(function(){
            q.resume();
            log.i('Resumed');
        }, 120000); // 2минут
    }

    q.push(URL);

    return results

}
