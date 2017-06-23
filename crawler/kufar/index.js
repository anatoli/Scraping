/**
 * Created by arinovich.anatoli on 23.06.2017.
 */
var log = require('cllc')();
var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');
// var module_detail = require('../abw/module_detail');

var URL = {
    name: 'kufar',
    URL: 'https://www.kufar.by/%D0%BC%D0%B8%D0%BD%D1%81%D0%BA_%D0%B3%D0%BE%D1%80%D0%BE%D0%B4/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%BE%D0%B1%D0%B8%D0%BB%D0%B8-%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B5%D1%82%D1%81%D1%8F'
}

var results = [];
var base = []; // todo массив ссылок на полный список с https://cars.av.by

var kufar = module.exports = function () {
// todo получение списка всех ссылок на все марки
    var q = tress(function (url, callback) {
        needle.get(url, function (err, res) {
            if (err || res.statusCode !== 200) {
                log.e((err || res.statusCode) + ' - ' + url);
                return callback(true); // возвращаем url в начало очереди
            }

            var $ = cheerio.load(res.body);
            //Todo абирает список марок с домашней страницы ABW.by
            $('.list_ads__info_container').each(function (i) {
                base.push({
                    name: $("a[itemprop ='name']").eq(i).text(),
                    releaseDate: $("time[itemprop ='releaseDate']").eq(i).attr('datetime'),
                    price: $("b[itemprop ='offers']").eq(i).text().trim(),
                    link:$("a[itemprop ='name']").eq(i).attr('href')
                })
            })
            callback();
        });
    }, 20);

    q.drain = function () {
        fs.writeFileSync('./kufar/' + URL.name + '.json', JSON.stringify(base, null, 4));
        // var sch_link = [];
        // base.forEach(function(item, i, arr) {
        //     sch_link.push(module_detail(item.link));
        // })
        // // console.log(sch_link);
        log.finish();
        log('Работа закончена');
    }

    q.push(URL.URL);

}