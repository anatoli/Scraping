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


    function modelsBrands(id) { // возвращает список моделей для id - бренда.

        const options = {
            method: 'GET',
            uri: "https://av.by/public/parameters.php?event=Model_List_Search&category_parent="+id }
​
        request(options)
            .then(function (res) {
                return res.data;
            })
            .catch(function (err) {
               console.log(err)
            })
    }

// todo получение списка всех ссылок на все марки
    var q = tress(function (url, callback) {
        needle.get(url, function (err, res) {
            if (err || res.statusCode !== 200) {
                log.e((err || res.statusCode) + ' - ' + url);
                return callback(true); // возвращаем url в начало очереди
            }

            var $ = cheerio.load(res.body);
            $('select[name *= "brand_id"] option').each(function () {
                var id = $(this).attr('value');
                var name = $(this).text();
                brand.push({
                    id: id,
                    name: name,
                    model_array: modelsBrands(id)

                })
            })
            console.log(res.body);
            console.log(brand);
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
