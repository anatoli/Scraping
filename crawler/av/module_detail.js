/**
 * Created by arinovich.anatoli on 05.06.2017.
 */
var log = require('cllc')();
var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');


var call_stack = [];
var results = [];

var results_module = function () {
    return results.filter( function (result) {
        if (result.id) {
            return result;
        }
    })
}

var module_detail = function (car_params) { //brand, model, year_from, year_to,price_from, price_to

    var q = tress(function(url, callback){
        needle.get(url, function(err, res){
            if (err || res.statusCode !== 200) {
                log.e((err || res.statusCode) + ' - ' + url);
                return callback(true); // возвращаем url в начало очереди
            }

            var $ = cheerio.load(res.body);

            $('.listing-item ').each(function (i) {
                results.push({
                    name: $('.listing-item-title').eq(i).text().trim(),
                    link: $('.listing-item-title h4 > a').eq(i).attr('href'),
                    description: $('.listing-item-desc').eq(i).text().trim(),
                    value: $('.listing-item-message-in').eq(i).text().trim(),
                    year: $('.listing-item-price span').eq(i).text().trim(),
                    price: {
                        BYN:$('.listing-item-price strong').eq(i).text().trim(),
                        USD:$('.listing-item-price small').eq(i).text().trim()
                    },
                    location: $('.listing-item-location').eq(i).text().trim(),
                    img: $('.listing-item-image-in img').attr('src'),

                });
            });

            $('.pages-numbers-link').each(function() {
                call_stack.push($(this).attr('href'))

                // q.push($(this).attr('href')); // todo проверить выполнение. первая ссылка пагинатора общая
                // console.log(this.attr('href'))
            });

            // $('.bpr_next>a').each(function() {
            //     q.push(resolve(URL+'', $(this).attr('href')));
            // });
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

    var url = "https://cars.av.by/search?brand_id%5B%5D="+car_params.brand+"&model_id%5B%5D="+car_params.model+"&year_from="+car_params.yearFrom+"&year_to="+car_params.yearTo+"&currency=USD&price_from="+car_params.costFrom+"price_to="+car_params.costTo;
    q.push(url);
    return results;
}

module.exports.results_module = results_module;
module.exports.module_detail = module_detail;
