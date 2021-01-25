var mongoose = require('mongoose');
var statsd = require('./statsd');


var schemaValue = mongoose.Schema({
    value: String,
    date: Date,
    count: Number
});
var Values = mongoose.model('keysearches', schemaValue);

var schemaLink = mongoose.Schema({
    value: String,
    link: String,
    title: String,
    date: Date,
    count: Number
});
var Links = mongoose.model('links', schemaLink);

var schematopLink = mongoose.Schema({
    name: String,
    date: Date,
    value: Object
});
var topLinks = mongoose.model('top', schematopLink);



module.exports = {
    connectDB: function () {
        mongoose.connect('mongodb://localhost:27017/myapp1', { useNewUrlParser: true, useUnifiedTopology: true });
        const fsCnt = mongoose.connection;
        fsCnt.on('open', () => console.log('Connected'));
        fsCnt.on('err', () => console.log('Disconnected'));
        // mongoose.connect("mongodb+srv://vegarnom:vegar8226@cluster0.eotns.mongodb.net/dbda1?retryWrites=true&w=majority  ");
    },

    updateGauge: function () {
        Values.count(function (err, result) {
            if (!err) {
                statsd.gauge('values', result);
            }
        })
    },

    getDash: async function (res) {
        let totalkey = 0;
        let totallink = 0;
        let check;
        let title = '123';
        let values = [];
        let links = [];


        await Values.count({}, function (err, count) {
            totalkey = count;
        });
        await Links.count({}, function (err, countlink) {
            totallink = countlink;
        });

        // Values.aggregate([
        //     { $group: { _id: '$value', i_total: { $sum: 1 }}},
        //     { $project: { _id: 1, i_total: 1 }},
        //     { $sort: { i_total: -1 } },
        //     { $limit : 10 }
        //   ]).
        //   then(function (result) {

        //     for (let i in result) {

        //             let val = result[i];    

        //                 values[val["_id"]] = [val["_id"], val["i_total"]];

        //     }
        //     title = process.env.TITLE || 'Fshare demo'
        //     // [ { maxBalance: 98000 } ]
        //     Links.aggregate([
        //         { $group: { _id: '$link',title : { $first:  "$title" }, i_total: { $sum: 1 }}},
        //         { $project: { _id: 1,title: 1, i_total: 1 }},
        //         { $sort: { i_total: -1 } },
        //         { $limit : 10 }
        //       ]).
        //       then(function (result) {

        //         for (let i in result) {

        //                 let val = result[i];    

        //                     links[val["_id"]] = [val["_id"], val["i_total"], val["title"]];

        //         }
        //         title = process.env.TITLE || 'Fshare demo'
        //         // [ { maxBalance: 98000 } ]
        //         res.render('index', {title, links: links, values: values , totalkey: totalkey, totallink: totallink });

        //       });

        //   });
        var findnamekey = "topkeyall";
        var findnamelink = "toplinkall";

        topLinks.findOne({ name: findnamekey }, {}).
            then(function (result) {
                if (!result) {
                    res.render('index', { title, links: {}, values: {}, totalkey: {}, totallink: {} });
                } else {
                    for (let i in result.value) {

                        let val = result.value[i];

                        values[i] = [val.keyword, val.search_total, val.position];

                    }

                    selectionSortkey(values);


                    title = process.env.TITLE || 'Fshare demo'
                    // [ { maxBalance: 98000 } ]
                    topLinks.findOne({ name: findnamelink }, {}).
                        then(function (result) {

                            // console.log(result.value[0].keyword);
                            // console.log(result.value);

                            for (let i in result.value) {

                                let link = result.value[i];

                                links[i] = [link.link, link.search_total, link.title, link.position];

                            }
                            selectionSort(links);
                            title = process.env.TITLE || 'Fshare demo'
                            // [ { maxBalance: 98000 } ]

                            res.render('index', { title, links: links, values: values, totalkey: totalkey, totallink: totallink });

                        }).catch(err => {
                            console.log(err.message);
                            res.render('index', { title, links: {}, values: {}, totalkey: {}, totallink: {} });
                        });
                }

                // console.log(result.value[0].keyword);
                // console.log(result.value);



            }).catch(err => {
                console.log(err.message);
                res.render('index', { title, links: {}, values: {}, totalkey: {}, totallink: {} });
            });








        //   Links.aggregate([
        //     { $group: { _id: '$link', i_total: { $sum: 1 }}},
        //     { $project: { _id: 1, i_total: 1 }},
        //     { $sort: { i_total: -1 } },
        //     { $limit : 10 }
        //   ]).
        //   then(function (result) {
        //     let values = {};
        //     for (let i in result) {

        //             let val = result[i];    

        //                 values[val["_id"]] = [val["_id"], val["i_total"]];

        //     }

        //     title = process.env.TITLE || 'Fshare demo'
        //     res.render('index', {title, link: values , totalkey: totalkey, totallink: totallink }); // [ { maxBalance: 98000 } ]

        //   });

        // Values.aggregate().
        //     group({ _id: '$value', i_total: { $sum: 1 } }).
        //     exec(function (err, res) {
        //         if (err) return err;
        //         let a = res;
        //         console.log(res); 
        //     });

        // Values.find( async function(err, result) {

        //     if (err) {
        //         console.log(err);
        //         res.send('database error');
        //         return
        //     }

        //     await Values.count({}, function( err, count){
        //         total = count;
        //     });


        // });

    },

    getTopKey: function (value, res) {
        let total = 0;
        let check;
        let title = '';
        let values = [];
        var time;
        var key = "topkeyall";
        if (value != null) {
            key = value;

        }
        if (value == "topkeyall") {
            time = "All";
        }
        if (value == "topkeymonth") {
            time = "Month";
        }
        if (value == "topkeyweek") {
            time = "Week";
        }

        topLinks.findOne({ name: key }, {}).
            then(function (result) {

                // console.log(result.value[0].keyword);
                // console.log(result.value);

                for (let i in result.value) {

                    let val = result.value[i];

                    values[i] = [val.keyword, val.search_total, val.position, i];

                }
                selectionSortkey(values);
                title = process.env.TITLE || 'Fshare demo'
                // [ { maxBalance: 98000 } ]
                res.render('topkey', { title, values: values, total: total, time, valuetimename: value });

            }).catch(err => {
                console.log(err.message);
                res.render('topkey', { title = {}, values: {}, valuetimename: "null" });
            });

        // Values.aggregate().
        //     group({ _id: '$value', i_total: { $sum: 1 } }).
        //     exec(function (err, res) {
        //         if (err) return err;
        //         let a = res;
        //         console.log(res); 
        //     });

        // Values.find( async function(err, result) {

        //     if (err) {
        //         console.log(err);
        //         res.send('database error');
        //         return
        //     }

        //     await Values.count({}, function( err, count){
        //         total = count;
        //     });


        // });

    },


    getTopLink: function (value, res) {
        let total = 0;
        let check;
        let title = '';
        let links = [];
        var time;
        var key = "toplinkall";
        if (value != null) {
            key = value;

        }

        if (value == "toplinkall") {
            time = "All";
        }
        if (value == "toplinkmonth") {
            time = "Month";
        }
        if (value == "toplinkweek") {
            time = "Week";
        }


        topLinks.findOne({ name: key }, {}).
            then(function (result) {

                // console.log(result.value[0].keyword);
                // console.log(result.value);

                for (let i in result.value) {

                    let link = result.value[i];

                    links[i] = [link.link, link.search_total, link.title, link.position, i];

                }
                title = process.env.TITLE || 'Fshare demo'
                // [ { maxBalance: 98000 } ]
                selectionSort(links);

                res.render('toplink', { title, links: links, total: total, time, valuetimename: value });

            }).catch(err => {
                console.log(err.message);
                res.render('toplink', { title = "null", links: {}, time = "null", valuetimename: "null" });
            });

        // Values.aggregate().
        //     group({ _id: '$value', i_total: { $sum: 1 } }).
        //     exec(function (err, res) {
        //         if (err) return err;
        //         let a = res;
        //         console.log(res); 
        //     });

        // Values.find( async function(err, result) {

        //     if (err) {
        //         console.log(err);
        //         res.send('database error');
        //         return
        //     }

        //     await Values.count({}, function( err, count){
        //         total = count;
        //     });


        // });

    },

    getValkey: async function (res) {
        let total = 0;
        let check;
        let title = '';
        let values = {};

        await Values.count({}, function (err, count) {
            total = count;
        });

        Values.aggregate([
            { $group: { _id: '$value', i_total: { $sum: 1 }, date: { $push: '$date' } } },
            { $project: { _id: 1, i_total: 1 } }
        ]).
            then(function (result) {
                for (let i in result) {

                    let val = result[i];
                    let dateT = getDateT(val["date"]);
                    let Time = getDateTime(val["date"]);

                    values[val["_id"]] = [val["_id"], Time, dateT, val["i_total"]];

                }

                title = process.env.TITLE || 'Fshare demo'
                res.render('key', { title, values: values, total: total }); // [ { maxBalance: 98000 } ]

            });

        // Values.aggregate().
        //     group({ _id: '$value', i_total: { $sum: 1 } }).
        //     exec(function (err, res) {
        //         if (err) return err;
        //         let a = res;
        //         console.log(res); 
        //     });

        // Values.find( async function(err, result) {

        //     if (err) {
        //         console.log(err);
        //         res.send('database error');
        //         return
        //     }

        //     await Values.count({}, function( err, count){
        //         total = count;
        //     });


        // });

    },

    getVallink: async function (res) {
        let total = 0;
        let check;
        let title = '';
        let values = {};

        await Links.count({}, function (err, count) {
            total = count;
        });

        Links.aggregate([
            {
                $match: {
                    "link": { "$exists": true },
                    "title": { "$exists": true }
                }
            },
            { $group: { _id: { "link": "$link", "value": "$value" }, title: { $first: "$title" }, value: { $first: "$value" }, i_total: { $sum: 1 } } },
            { $project: { _id: 1, i_total: 1, title: 1, value: 1 } }

        ]).
            then(function (result) {
                let pos = 1;
                for (let i in result) {

                    let val = result[i];


                    values[pos] = [val["_id"]["link"], val["title"], val["i_total"], val["value"]];
                    pos++;




                }

                title = process.env.TITLE || 'Fshare demo'
                res.render('link', { title, values: values, total: total }); // [ { maxBalance: 98000 } ]

            });

        // Values.aggregate().
        //     group({ _id: '$value', i_total: { $sum: 1 } }).
        //     exec(function (err, res) {
        //         if (err) return err;
        //         let a = res;
        //         console.log(res); 
        //     });

        // Values.find( async function(err, result) {

        //     if (err) {
        //         console.log(err);
        //         res.send('database error');
        //         return
        //     }

        //     await Values.count({}, function( err, count){
        //         total = count;
        //     });


        // });

    },



    getlinkbytop10key: async function (key, res) {
        let total = 0;
        let check;
        let keysearch = key;
        let values = {};

        await Links.count({}, function (err, count) {
            total = count;
        });

        Links.aggregate([
            { $group: { _id: '$link', value: { $first: "$value" }, title: { $first: "$title" }, i_total: { $sum: 1 } } },
            { $project: { _id: 1, i_total: 1, value: 1, title: 1 } }

        ]).
            then(function (result) {
                for (let i in result) {

                    let val = result[i];
                    if (val["value"] === key) {
                        values[val["_id"]] = [val["_id"], val["value"], val["i_total"], val["title"]];

                    }

                }

                title = process.env.TITLE || 'Fshare demo'
                res.render('top10key', { keysearch, values: values, total: total }); // [ { maxBalance: 98000 } ]

            });

        // Values.aggregate().
        //     group({ _id: '$value', i_total: { $sum: 1 } }).
        //     exec(function (err, res) {
        //         if (err) return err;
        //         let a = res;
        //         console.log(res); 
        //     });

        // Values.find( async function(err, result) {

        //     if (err) {
        //         console.log(err);
        //         res.send('database error');
        //         return
        //     }

        //     await Values.count({}, function( err, count){
        //         total = count;
        //     });


        // });

    },

    getVallinkbykey: async function (res) {
        let total = 0;
        let check;
        let title = '';
        let values = {};

        await Links.count({}, function (err, count) {
            total = count;
        });

        Links.aggregate([
            { $group: { _id: '$value', i_total: { $sum: 1 } } },
            { $project: { _id: 1, i_total: 1 } }
        ]).
            then(function (result) {
                for (let i in result) {

                    let val = result[i];




                    values[val["_id"]] = [val["_id"], val["i_total"]];




                }

                title = process.env.TITLE || 'Fshare demo'
                res.render('linkbykey', { title, values: values, total: total }); // [ { maxBalance: 98000 } ]

            });

        // Values.aggregate().
        //     group({ _id: '$value', i_total: { $sum: 1 } }).
        //     exec(function (err, res) {
        //         if (err) return err;
        //         let a = res;
        //         console.log(res); 
        //     });

        // Values.find( async function(err, result) {

        //     if (err) {
        //         console.log(err);
        //         res.send('database error');
        //         return
        //     }

        //     await Values.count({}, function( err, count){
        //         total = count;
        //     });


        // });

    },

    getkeyDetail: async function (key, res) {
        let total = 0;
        await Values.count({ value: key }, function (err, count) {
            total = count;
        });
        Values.find({ value: key }, async function (err, result) {



            if (err) {
                console.log(err);
                res.send('database error');
                return
            }


            var values = {};
            for (var i in result) {



                var val = result[i];
                let dateT = getDateT(val["date"]);
                let Time = getDateTime(val["date"]);


                values[val["_id"]] = [val["value"], Time, dateT];





            }
            var title = process.env.TITLE || 'Fshare demo'
            res.render('key-detail', { title, key: key, values: values, total: total });
        });
    },

    getlinkbykeyDetail: async function (key, res) {
        let total = 0;
        let keysearch = key;
        await Links.count({ vaulue: key }, function (err, count) {
            total = count;
        });
        Links.find({ value: key }, async function (err, result) {



            if (err) {
                console.log(err);
                res.send('database error');
                return
            }


            var values = {};
            for (var i in result) {



                var val = result[i];
                let dateT = getDateT(val["date"]);
                let Time = getDateTime(val["date"]);


                values[val["_id"]] = [val["title"], val["link"], Time, dateT];





            }
            let keysearch = key;
            res.render('linkbykey-detail', { keysearch, key: key, values: values, total: total });
        });
    },

    getlinkbylinkDetail: async function (key, res) {
        let total = 0;

        await Links.count({ link: key }, function (err, count) {
            total = count;
        });
        Links.find({ link: key }, async function (err, result) {



            if (err) {
                console.log(err);
                res.send('database error');
                return
            }


            var values = {};
            for (var i in result) {



                var val = result[i];
                let dateT = getDateT(val["date"]);
                let Time = getDateTime(val["date"]);


                values[val["_id"]] = [val["title"], val["link"], Time, dateT, val["value"]];





            }
            let link = key;
            res.render('linkbylink-detail', { link, key: key, values: values, total: total });
        });
    },

    sendVal: function (val, date, res) {
        // var count;
        // find value
        // Values.findOne({value: val}, function(err,obj) { count = obj.count; });



        var request = new Values({ value: val, date: date });
        request.save((err, result) => {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
                return
            }
            this.updateGauge();
            statsd.increment('creations');
            res.status(201).send(JSON.stringify({ status: "ok", value: result["value"], id: result["_id"] }));
        });
    },

    sendLink: function (val, link, title, date, res) {
        // var count;
        // find value
        // Values.findOne({value: val}, function(err,obj) { count = obj.count; });



        var request = new Links({ value: val, link: link, title: title, date: date });
        request.save((err, result) => {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
                return
            }
            this.updateGauge();
            statsd.increment('creations');
            res.status(201).send(JSON.stringify({ status: "ok", value: result["value"], id: result["_id"] }));
        });
    },

    sendtopLink: function (name, date, value, res) {
        // var count;
        // find value
        // Values.findOne({value: val}, function(err,obj) { count = obj.count; });



        var request = new topLinks({ name: name, date: date, value: value });
        request.save((err, result) => {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
                return
            }
            this.updateGauge();
            statsd.increment('creations');
            res.status(201).send(JSON.stringify({ status: "ok", value: result["value"], id: result["_id"] }));
        });
    },

    updatetoplink: async function (timename, index, top, title, link, total, res) {
        // var count;
        // find value
        // Values.findOne({value: val}, function(err,obj) { count = obj.count; });
        index = parseInt(index);
        var topLinkStorageTmp = {};
        if (index < 0) {

            var curr = new Date;


            switch (timename) {
                case null:
                    var dategtelink = new Date("2020-12-06T07:30:19.063Z");
                    var dateltlink = new Date();
                    nametoplink = "toplinkall";
                    break;
                case 'toplinkall':
                    var dategtelink = new Date("2020-12-06T07:30:19.063Z");
                    //var dateltlink = new  Date("2021-01-14T07:30:19.063Z");
                    var dateltlink = new Date();
                    nametoplink = "toplinkall";
                    break;
                case "toplinkmonth":
                    var dategtelink = new Date(curr.getFullYear(), curr.getMonth(), 1);
                    var dateltlink = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
                    nametoplink = "toplinkmonth";
                    break;
                case "toplinkweek":
                    var dategtelink = new Date(curr.setDate(curr.getDate() - curr.getDay()));
                    var dateltlink = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
                    nametoplink = "toplinkweek";
                    break;
                case "toplinkyear":
                    var dategtelink = new Date(new Date().getFullYear(), 0, 1);
                    var dateltlink = new Date(new Date().getFullYear(), 11, 31)
                    nametoplink = "toplinkyear";
                    break;
                default:
                    var dategtelink = new Date("2020-12-06T07:30:19.063Z");
                    var dateltlink = new Date();
                    nametoplink = "toplinkall";
            }

            await Links.aggregate([
                { $match: { date: { $gte: dategtelink, $lt: dateltlink } } },
                { $group: { _id: '$link', i_total: { $sum: 1 }, title: { $first: "$title" } } },
                { $project: { _id: 1, i_total: 1, title: 1 } },
                { $sort: { i_total: -1 } },
                { $limit: 10 }
            ]).
                then(function (result) {

                    for (let i in result) {

                        let val = result[i];

                        let posTmp = parseInt(i) + 1;
                        topLinkStorageTmp[parseInt(i)] = { 'position': posTmp, 'link': val["_id"], 'title': val["title"], 'search_total': val["i_total"] }

                    }



                });


        } else {

            await topLinks.findOne({ name: timename }, {}).
                then(function (result) {

                    // console.log(result.value[0].keyword);
                    // console.log(result.value);

                    for (let i in result.value) {
                        if (i == index) {
                            topLinkStorageTmp[parseInt(i)] = { 'position': parseInt(top), 'link': link, 'title': title, 'search_total': parseInt(total) }

                        } else {

                            let link = result.value[i];

                            // console.log(link.position);
                            topLinkStorageTmp[parseInt(i)] = { 'position': link.position, 'link': link.link, 'title': link.title, 'search_total': link.search_total }

                        }
                    }
                    // title = process.env.TITLE || 'Fshare demo'
                    // [ { maxBalance: 98000 } ]
                    // res.render('topkey', {title, values: values , total: total, time });

                }).catch(err => {
                    console.log(err.message);
            
                });

        }


        await topLinks.update({ name: timename }, { $set: { value: topLinkStorageTmp } }, (err, result) => {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
                return
            }
            this.updateGauge();
            statsd.increment('creations');
            res.redirect('/toplink/' + timename);
            // res.status(201).send(JSON.stringify({status: "ok", value: result["value"], id: result["_id"]}));
        });


    },

    updatetopkey: async function (timename, index, top, key, total, res) {
        // var count;
        // find value
        // Values.findOne({value: val}, function(err,obj) { count = obj.count; });
        index = parseInt(index);
        var topKeyStorageTmp = {};
        if (index < 0) {

            var curr = new Date;

            switch (timename) {
                case null:
                    var dategte = new Date("2020-12-06T07:30:19.063Z");
                    var datelt = new Date();
                    namekeylink = "topkeyall";

                    break;
                case 'topkeyall':
                    var dategte = new Date("2020-12-06T07:30:19.063Z");
                    var datelt = new Date();
                    namekeylink = "topkeyall";
                    break;
                case "topkeyweek":
                    var dategte = new Date(curr.setDate(curr.getDate() - curr.getDay()));
                    var datelt = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
                    namekeylink = "topkeyweek";
                    break;
                case "topkeymonth":
                    var dategte = new Date(curr.getFullYear(), curr.getMonth(), 1);
                    var datelt = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
                    namekeylink = "topkeymonth";
                    break;
                case "topkeyyear":
                    var dategte = new Date(new Date().getFullYear(), 0, 1);
                    var datelt = new Date(new Date().getFullYear(), 11, 31)
                    namekeylink = "topkeyyear";
                    break;
                default:
                    var dategte = new Date("2020-12-06T07:30:19.063Z");
                    var datelt = new Date();
                    namekeylink = "topkeyall";
            }

            await Values.aggregate([
                { $match: { date: { $gte: dategte, $lt: datelt } } },
                { $group: { _id: '$value', i_total: { $sum: 1 } } },
                { $project: { _id: 1, i_total: 1, date: 1 } },
                { $sort: { i_total: -1 } },
                { $limit: 10 }
            ]).
                then(function (result) {

                    for (let i in result) {

                        let val = result[i];

                        let posTmp = parseInt(i) + 1;
                        topKeyStorageTmp[parseInt(i)] = { 'position': posTmp, 'keyword': val["_id"], 'search_total': val["i_total"] }

                    }



                });


        } else {

            await topLinks.findOne({ name: timename }, {}).
                then(function (result) {

                    // console.log(result.value[0].keyword);
                    // console.log(result.value);

                    for (let i in result.value) {
                        if (i == index) {
                            topKeyStorageTmp[parseInt(i)] = { 'position': parseInt(top), 'keyword': key, 'search_total': parseInt(total) }

                        } else {

                            let val = result.value[i];
                            topKeyStorageTmp[parseInt(i)] = { 'position': val.position, 'keyword': val.keyword, 'search_total': val.search_total }

                        }
                    }
                    // title = process.env.TITLE || 'Fshare demo'
                    // [ { maxBalance: 98000 } ]
                    // res.render('topkey', {title, values: values , total: total, time });

                }).catch(err => {
                    console.log(err.message);
            
                });

        }


        await topLinks.update({ name: timename }, { $set: { value: topKeyStorageTmp } }, (err, result) => {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
                return
            }
            this.updateGauge();
            statsd.increment('creations');
            res.redirect('/topkey/' + timename);
            // res.status(201).send(JSON.stringify({status: "ok", value: result["value"], id: result["_id"]}));
        });
    },


    delVal: function (id) {
        Values.remove({ _id: id }, (err) => {
            if (err) {
                console.log(err);
            }
            this.updateGauge();
            statsd.increment('deletions');
        });
    }
};


// Use of Date.now() method 
function getDateTime(dateIP) {
    let today = new Date(dateIP);
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;
}

function getDateT(dateIP) {
    let today = new Date(dateIP);
    let date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    return date;
}


function selectionSort(array) {
    for (let i = 0; i < array.length - 1; i++) {
        let idmin = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j][3] < array[idmin][3]) idmin = j;
        }

        // swap
        let t = array[i];
        array[i] = array[idmin];
        array[idmin] = t;
    }
}

function selectionSortkey(array) {
    for (let i = 0; i < array.length - 1; i++) {
        let idmin = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j][2] < array[idmin][2]) idmin = j;
        }

        // swap
        let t = array[i];
        array[i] = array[idmin];
        array[idmin] = t;
    }
}
