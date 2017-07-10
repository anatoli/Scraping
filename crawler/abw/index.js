var log = require('cllc')();
var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');
var module_detail = require('./module_detail');

var URL = {
        name: 'abw',
        URL: 'https://www.abw.by/'
    }

https://www.abw.by/car/sell/?search=1&type=1&sort=&marka%5B%5D=102&model%5B%5D=1214&capacity1=&capacity2=&mileage1=&mileage2=&year1=1996&year2=2017&price1=100&price2=7000&country=&text=&day=

var results = [];
var base = []; // todo массив ссылок на полный список с https://cars.av.by


var ABW = module.exports = function () {
// todo получение списка всех ссылок на все марки
    var q = tress(function (url, callback) {
        needle.get(url, function (err, res) {
            if (err || res.statusCode !== 200) {
                log.e((err || res.statusCode) + ' - ' + url);
                return callback(true); // возвращаем url в начало очереди
            }

            var $ = cheerio.load(res.body);
            //Todo абирает список марок с домашней страницы ABW.by
            $('ul.filter-marka > li.filter-marka-item').each(function (i) {
                base.push({
                    name: $('ul.filter-marka > li.filter-marka-item a').eq(i).text().trim(),
                    count: $('ul.filter-marka > li.filter-marka-item a > span').eq(i).text(), // может понадобится для определения изменений в списке (количество записей по марке)
                    link: $('ul.filter-marka > li.filter-marka-item a').eq(i).attr('href')
                });
                log.step();
            });
            callback();
        });
    }, -1000);

    q.drain = function () {
        fs.writeFileSync('./abw/' + URL.name + '.json', JSON.stringify(base, null, 4));
        var sch_link = [];
        for (i = 0; i < base.length-1; i++) { //todo -1 потому что последний елемент массива имее ссылку неверного формата
            sch_link.push(module_detail(base[i].link));
        }
        // console.log(sch_link);
        log.finish();
        log('Работа закончена');
    }

    q.push(URL.URL);

}
