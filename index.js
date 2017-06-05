var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');
var AV = require('./crawler/av/index.js');

var URL = [
    {
        name: 'av',
        URL: 'https://cars.av.by/'
    },
    {
        name: 'abw',
        URL: 'https://www.abw.by/'
    }
    ];
var results = [];
var base = []; // todo массив ссылок на полный список с https://cars.av.by


// todo получение списка всех ссылок на все марки
var baseURI = 'https://www.abw.by/'

var q = tress(function(url, callback){
    needle.get(url, function(err, res){
        if (err) throw err;

        var $ = cheerio.load(res.body);
        //Todo абирает список марок с домашней страницы ABW.by
        $('ul.filter-marka > li.filter-marka-item').each(function (i) {
            base.push({
                name: $('ul.filter-marka > li.filter-marka-item a').eq(i).text().trim(),
                value: $('ul.filter-marka > li.filter-marka-item a > span').eq(i).text(), // может понадобится для определения изменений в списке (количество записей по марке)
                link: $('ul.filter-marka > li.filter-marka-item a').eq(i).attr('href')
            });
        });
        //Todo абирает список марок с домашней страницы AV.by
        // $('ul.brandslist > li.brandsitem.brandsitem--primary').each(function (i) {
        //     base.push({
        //         name: $('li.brandsitem.brandsitem--primary span').eq(i).text(),
        //         value: $('li.brandsitem.brandsitem--primary small').eq(i).text(), // может понадобится для определения изменений в списке (количество записей по марке)
        //         link: $('li.brandsitem.brandsitem--primary a').eq(i).attr('href')
        //     });
        //     AV(base[i].link);
        // });

        callback();
    });
}, 1);

q.drain = function(){
    fs.writeFileSync('./abw/'+URL[1].name+'.json', JSON.stringify(base, null, 4));
    var sch_link = [];
    for( i=0; i<base.length; i++) {
        sch_link.push(AV(base[i].link));
    }
    console.log(sch_link);
}

q.push(URL[1].URL);