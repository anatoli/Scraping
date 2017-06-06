/**
 * Created by arinovich.anatoli on 05.06.2017.
 */
var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');

var results = [];

var module_detail = module.exports = function (URL) {

    var q = tress(function(url, callback){
        needle.get(url, function(err, res){
            if (err) throw err;

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
                    img: $('.product-thumb >img').attr('src'),

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

            $('.pages-numbers-link').each(function() {
                q.push($(this).attr('href')); // todo проверить выполнение. первая ссылка пагинатора общая
                // console.log(this.attr('href'))
            });

            // $('.bpr_next>a').each(function() {
            //     q.push(resolve(URL+'', $(this).attr('href')));
            // });
            console.log(results);

            callback();
        });
    }, 10);

    q.drain = function(){
        fs.writeFileSync('./av/av_next.json', JSON.stringify(results, null, 4));
        console.log('finish');

    }

    q.push(URL);
    q.error = function(err) {
        console.log('Job ' + this + ' failed with error ' + err);

        return(err)
    };

    return results

}
