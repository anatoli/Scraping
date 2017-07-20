var log = require('cllc')();
var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');
var request = require('request-promise');
var module_detail = require('./module_detail');

var URL = {
        name: 'av_id',
        URL: 'https://cars.av.by'
}

var brand = []; // todo массив ссылок на полный список с https://cars.av.by

var AV = module.exports = function () { // brand, model, year_from, year_to,price_from, price_to

// todo получение списка всех ссылок на все марки
    var q = tress(function (url, callback) {
        var models= [];
        needle.get(url, function (err, res) {
            if (err || res.statusCode !== 200) {
                log.e((err || res.statusCode) + ' - ' + url);
                return callback(true); // возвращаем url в начало очереди
            }

            var $ = cheerio.load(res.body);
            var options = $('select[name *= "brand_id"] option');
            options.each(function (each_index) {
                var id = $(this).attr('value');
                var name = $(this).text();
                var model_array =  request({
                    method: 'GET',
                    uri: "https://av.by/public/parameters.php?event=Model_List_Search&category_parent="+id
                })
                    .then(function (res, body) {
                        var models_str_array = res.split('\n');
                        var car_models = []; //todo список моделей полученный динамически.  массив для распршивания строки моделей.
                        models_str_array.forEach( function (el, index, p3) {
                            var i = el.indexOf('=');
                            if (el.substring(0,i) != 0) {
                                car_models.push({
                                    id: el.substring(0,i),
                                    name: el.substring(i+1)
                                });
                            }
                        })
                        models.push({
                            id: id,
                            name: name,
                            model: car_models
                        });
                        if(each_index === options.length-2 ) {
                            fs.appendFileSync('./av/cars_model_id.json', JSON.stringify(models, null, 4));
                        }
                    })
                    .catch(function (err) {
                        // console.log(err)
                    })
                if (id !== "") {
                    brand.push({
                        id: id,
                        name: name,
                        model_array: model_array

                    })
                }
            });
            callback();
        });
    }, -1000);

    q.drain = function () {
        fs.writeFileSync('./av/' + URL.name + '.json', JSON.stringify(brand, null, 4));
        log.finish();
        log('Работа закончена');
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

    q.push(URL.URL);

}
