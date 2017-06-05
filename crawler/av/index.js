/**
 * Created by arinovich.anatoli on 05.06.2017.
 */
var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');

var results = [];

var AV = module.exports = function (URL) {

 var q = tress(function(url, callback){
     needle.get(url, function(err, res){
         if (err) throw err;

         var $ = cheerio.load(res.body);

         $('.product-full-inner').each(function (i) {
             results.push({
                 name: $('.product-full-inner .data-first .title').eq(1).text().trim(),
                 value: $('.product-full-inner .excerpt').eq(i).text().trim(), // может понадобится для определения изменений в списке (количество записей по марке)
                 link: $('.product-full-inner a').eq(i).attr('href')
             });
         });
         // if($('.listing-wrap')){
         //     console.log($('.listing-wrap .listing-item'));
         //     results.push({
         //         title: $('h1').text(),
         //         date: $('.b_infopost>.date').text(),
         //         href: url
         //     });
         // }

         $('.next').each(function() {
             q.push(URL + $(this).attr('href'));
             // console.log(this.attr('href'))
         });

         // $('.bpr_next>a').each(function() {
         //     q.push(resolve(URL+'', $(this).attr('href')));
         // });
         console.log(results);

         callback();
     });
 }, 1);

 q.drain = function(){
     fs.writeFileSync('./abw/abw_next.json', JSON.stringify(results, null, 4));
     console.log('finish');

 }

 q.push(URL);

return results

}
