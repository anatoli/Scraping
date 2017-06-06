var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');
var module_detail = require('./module_detail');

var URL = {
        name: 'av',
        URL: 'https://cars.av.by/'
    }

var results = [];
var base = []; // todo массив ссылок на полный список с https://cars.av.by

var AV = module.exports = function () {
// todo получение списка всех ссылок на все марки
    var q = tress(function (url, callback) {
        needle.get(url, function (err, res) {
            if (err) throw err;

            var $ = cheerio.load(res.body);

            //Todo собирает список марок с домашней страницы AV.by
            $('ul.brandslist > li.brandsitem.brandsitem--primary').each(function (i) {
                base.push({
                    name: $('li.brandsitem.brandsitem--primary span').eq(i).text(),
                    count: $('li.brandsitem.brandsitem--primary small').eq(i).text(), // может понадобится для определения изменений в списке (количество записей по марке)
                    link: $('li.brandsitem.brandsitem--primary a').eq(i).attr('href')
                });
            });
            callback();
        });
    }, 10);

    q.drain = function () {
        fs.writeFileSync('./av/' + URL.name + '.json', JSON.stringify(base, null, 4));
        var sch_link = [];
        for (i = 0; i < base.length; i++) {
            sch_link.push(module_detail(base[i].link));
        }
        console.log(sch_link);
    }

    q.push(URL.URL);

}
