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
var call_stack = [];

var module_detail = module.exports = function (car_params) { //brand, model, year_from, year_to,price_from, price_to

    var q = tress(function(url, callback){
        needle.get(url, function(err, res){
            if (err || res.statusCode !== 200) {
                log.e((err || res.statusCode) + ' - ' + url);
                return callback(true); // возвращаем url в начало очереди
            }

            var $ = cheerio.load(res.body);

            $('.listing-item ').eq(1)//each(function (i) {
                results.push({
                    name: $('.listing-item-title').eq(1).text().trim(),
                    link: $('.listing-item-title h4 > a').eq(1).attr('href'),
                    description: $('.listing-item-desc').eq(1).text().trim(),
                    value: $('.listing-item-message-in').eq(1).text().trim(),
                    year: $('.listing-item-price span').eq(1).text().trim(),
                    price: {
                        BYN:$('.listing-item-price strong').eq(1).text().trim(),
                        USD:$('.listing-item-price small').eq(1).text().trim()
                    },
                    location: $('.listing-item-location').eq(1).text().trim(),
                    img: $('.product-thumb img').attr('src'),

                });
            // });

            $('.pages-numbers-link').each(function() {
                call_stack.push($(this).attr('href'))

                // q.push($(this).attr('href')); // todo проверить выполнение. первая ссылка пагинатора общая
                // console.log(this.attr('href'))
            });

            // $('.bpr_next>a').each(function() {
            //     q.push(resolve(URL+'', $(this).attr('href')));
            // });
            console.log(results);
            callback();
        });
    }, -1000);

    q.drain = function(){
        fs.writeFileSync('./av/av_detail.json', JSON.stringify(results, null, 4));
        var i=1;

        var myTimer = setInterval(function () {
          i++ ;
          if (i < call_stack.length){
              q.push(call_stack[i])
              log.i(q.running());
          } else {
              clearInterval(myTimer);
          }
        }, 3000);
        console.log('finish');

    }
    q.retry = function(){
        q.pause();
        // в this лежит возвращённая в очередь задача.
        log.i('Paused on:', this);
        setTimeout(function(){
            q.resume();
            log.i('Resumed');
        }, 300000); // 5минут av. часто валит сокет изза парсинга
    }

    q.push("https://cars.av.by/search?brand_id%5B%5D="+car_params.brand+"&model_id%5B%5D="+car_params.model+"&year_from="+car_params.year_from+"&year_to="+car_params.year_to+"&currency=USD&price_from="+car_params.price_from+"price_to="+car_params.price_to);

    return results

}
