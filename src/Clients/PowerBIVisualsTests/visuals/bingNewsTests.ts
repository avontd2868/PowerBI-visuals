//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbitests {
    import BingNews = powerbi.visuals.BingNews;

    describe("BingNews", () => {

        it('BingNews registered capabilities', () => {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('bingNews').capabilities).toBe(BingNews.capabilities);
        });
    }); 

    describe("BingNews tests", () => {
        var v: BingNews, element: JQuery;
        var bingSmallTileDelay = 1000;

        beforeEach(() => {
            element = powerbitests.helpers.testDom('200', '300');
            v = <BingNews> powerbi.visuals.visualPluginFactory.create().getPlugin('bingNews').create();
            v.init({
                element: element,
                host: mocks.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                }
            });
        });    

        it('BingNews_onDataChange', () => {
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: []
                    },
                    bingNews: [{ "__metadata": { "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/News?Query=\u0027Microsoft\u0027&$skip=0&$top=1", "type": "NewsResult" }, "ID": "6c234344-d5b0-4a06-984e-7adbec26ead1", "Title": "Microsoft finds a hilarious way to market a game you’re not supposed to know is coming to Xbox One", "Url": "http://news.yahoo.com/microsoft-finds-hilarious-way-market-game-not-supposed-162403181.html", "Source": "Yahoo News", "Description": "Unless you’ve been paying close attention, you might be convinced that Destiny is a PlayStation 4 exclusive. This couldn’t be further from the truth — in fact, Bungie’s highly anticipated FPS is launching on PS3, PS4, Xbox 360 and Xbox One next ...", "Date": "2014-09-05T16:18:16Z" }, { "__metadata": { "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/News?Query=\u0027Microsoft\u0027&$skip=1&$top=1", "type": "NewsResult" }, "ID": "80bb8300-a4a4-4a0c-bc1f-607bc3c2923e", "Title": "System Update: Microsoft to offer free game with Xbox One purchase next week", "Url": "http://www.nydailynews.com/entertainment/tv/system-update-microsoft-offer-free-game-xbox-purchase-week-article-1.1929109", "Source": "New York Daily News", "Description": "Now that\u0027s more like it. For the last several months, Sony\u0027s PlayStation 4 has dominated sales numbers, outpacing Microsoft\u0027s next-gen Xbox One. But for at least one week, the Xbox One just might be the sales king. Next week, from Sept. 7-13, Microsoft ...", "Date": "2014-09-05T14:38:03Z" }, { "__metadata": { "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/News?Query=\u0027Microsoft\u0027&$skip=2&$top=1", "type": "NewsResult" }, "ID": "7c69650e-5d79-4e17-a8f1-f83fe122b1dc", "Title": "Can You Smell That? It\u0027s Microsoft\u0027s Brilliant Stealth Marketing Strategy For \u0027Destiny\u0027", "Url": "http://www.forbes.com/sites/jasonevangelho/2014/09/05/can-you-smell-that-its-microsofts-brilliant-stealth-marketing-strategy-for-destiny/", "Source": "Forbes", "Description": "Microsoft Microsoft is prohibited from running any advertisements for Destiny, Activision and Bungie’s wildly anticipated first-person shooter. While it’s not an exclusive title for Sony Sony platforms, that clause is part of Sony’s exclusivity ...", "Date": "2014-09-05T12:00:34Z" }, { "__metadata": { "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/News?Query=\u0027Microsoft\u0027&$skip=3&$top=1", "type": "NewsResult" }, "ID": "aba258db-16c3-4dfe-8d46-8e2cda98b1c1", "Title": "Microsoft Introduces Three New Smartphones", "Url": "http://bits.blogs.nytimes.com/2014/09/04/microsoft-introduces-three-new-smartphones/?_php=true&_type=blogs&_r=0", "Source": "Bits Blog NYTimes", "Description": "BERLIN — Microsoft is adding to its smartphone collection. On Thursday, the tech giant introduced three new devices, its first ones since the completion in April of its $7.5 billion deal for Nokia’s cellphone business and just a few months after ...", "Date": "2014-09-04T19:25:34Z" }, { "__metadata": { "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/News?Query=\u0027Microsoft\u0027&$skip=4&$top=1", "type": "NewsResult" }, "ID": "a84fc9c4-d34c-483c-9e5d-abc3f132401f", "Title": "Microsoft launches Nokia X2 for Rs 8,699", "Url": "http://timesofindia.indiatimes.com/tech/mobiles/Microsoft-launches-Nokia-X2-for-Rs-8699/articleshow/41804520.cms", "Source": "Times of India", "Description": "NEW DELHI: Beefing up its budget smartphone portfolio, Microsoft Devices has launched Nokia X2, priced at Rs 8,699, in India to compete more aggressively with the likes of Samsung as well as homegrown firms like Micromax. The Nokia X2 was unveiled globally ...", "Date": "2014-09-05T18:12:48Z" }, { "__metadata": { "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/News?Query=\u0027Microsoft\u0027&$skip=5&$top=1", "type": "NewsResult" }, "ID": "934c83f1-d014-4d62-966c-a9c43dd1c29b", "Title": "Microsoft\u0027s Bing Image tool draws a copyright infringement suit", "Url": "http://www.networkworld.com/article/2603029/microsoft-subnet/microsofts-bing-image-tool-draws-a-copyright-infringement-suit.html", "Source": "Network World", "Description": "Microsoft\u0027s Bing Image Widget is designed to give publishers the ability to publish images from the Bing search engine on their web page, but Getty Images is accusing Microsoft of \"massive infringement\" and is suing over it. Microsoft released Bing Image ...", "Date": "2014-09-05T15:56:48Z" }, { "__metadata": { "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/News?Query=\u0027Microsoft\u0027&$skip=6&$top=1", "type": "NewsResult" }, "ID": "88d39209-0d54-4203-b345-e09a3f51c9e5", "Title": "Microsoft can’t advertise Destiny the game, so they made Destiny the fragrance", "Url": "http://www.geek.com/games/microsoft-cant-advertise-destiny-the-game-so-they-made-destiny-the-fragrance-1603663/", "Source": "Geek", "Description": "This year things have gotten downright silly when it comes to exclusively promoting games for next generation consoles. First Microsoft’s not-so-exclusive announcement for the new Tomb Raider rattled gamers around the world, and now it looks like Sony ...", "Date": "2014-09-05T13:55:06Z" }]
                }]
            });

            expect($('.bingNews')).toBeInDOM();
            expect($('.newsList')).toBeInDOM();
            expect($('.newsList li').length).toBe(3);
        });

        // VSTS 3907832: Test disabled - test was failing in gated checkin queue - though passing locally
        //it('BingNews_OnResize_Small', (done) => {
        //    resizeTestSetup();

        //    v.onResizing({
        //        height: 50,
        //        width: element.width()
        //    }, 0);

        //    // Need a wait here, since there is a delay before the small tile switches in the single item layout via animation.
        //    setTimeout(() => {
        //        expect($('.newsList li').length).toBe(1);
        //        done();
        //    }, bingSmallTileDelay);
        //});    

        it('BingNews_OnResize_Large', () => {
            resizeTestSetup();

            v.onResizing({
                height: 500,
                width: element.width()
            }, 0);
            expect($('.newsList li').length).toBe(7);
        });    

        it('BingNews_OnResize_SmallThenLarge', (done) => {
            resizeTestSetup();

            v.onResizing({
                height: 50,
                width: element.width()
            }, 0);

            v.onResizing({
                height: 500,
                width: element.width()
            }, 0);

            expect($('.newsList li').length).toBe(7);

            // Need a wait here, since there is a delay before the small tile switches in the single item layout via animation.
            setTimeout(() => {
                expect($('.newsList li').length).toBe(7);
                done();
            }, bingSmallTileDelay);
        });

        function resizeTestSetup(): void {
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: []
                    },
                    bingNews: [{ "__metadata": { "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/News?Query=\u0027Microsoft\u0027&$skip=0&$top=1", "type": "NewsResult" }, "ID": "6c234344-d5b0-4a06-984e-7adbec26ead1", "Title": "Microsoft finds a hilarious way to market a game you’re not supposed to know is coming to Xbox One", "Url": "http://news.yahoo.com/microsoft-finds-hilarious-way-market-game-not-supposed-162403181.html", "Source": "Yahoo News", "Description": "Unless you’ve been paying close attention, you might be convinced that Destiny is a PlayStation 4 exclusive. This couldn’t be further from the truth — in fact, Bungie’s highly anticipated FPS is launching on PS3, PS4, Xbox 360 and Xbox One next ...", "Date": "2014-09-05T16:18:16Z" }, { "__metadata": { "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/News?Query=\u0027Microsoft\u0027&$skip=1&$top=1", "type": "NewsResult" }, "ID": "80bb8300-a4a4-4a0c-bc1f-607bc3c2923e", "Title": "System Update: Microsoft to offer free game with Xbox One purchase next week", "Url": "http://www.nydailynews.com/entertainment/tv/system-update-microsoft-offer-free-game-xbox-purchase-week-article-1.1929109", "Source": "New York Daily News", "Description": "Now that\u0027s more like it. For the last several months, Sony\u0027s PlayStation 4 has dominated sales numbers, outpacing Microsoft\u0027s next-gen Xbox One. But for at least one week, the Xbox One just might be the sales king. Next week, from Sept. 7-13, Microsoft ...", "Date": "2014-09-05T14:38:03Z" }, { "__metadata": { "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/News?Query=\u0027Microsoft\u0027&$skip=2&$top=1", "type": "NewsResult" }, "ID": "7c69650e-5d79-4e17-a8f1-f83fe122b1dc", "Title": "Can You Smell That? It\u0027s Microsoft\u0027s Brilliant Stealth Marketing Strategy For \u0027Destiny\u0027", "Url": "http://www.forbes.com/sites/jasonevangelho/2014/09/05/can-you-smell-that-its-microsofts-brilliant-stealth-marketing-strategy-for-destiny/", "Source": "Forbes", "Description": "Microsoft Microsoft is prohibited from running any advertisements for Destiny, Activision and Bungie’s wildly anticipated first-person shooter. While it’s not an exclusive title for Sony Sony platforms, that clause is part of Sony’s exclusivity ...", "Date": "2014-09-05T12:00:34Z" }, { "__metadata": { "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/News?Query=\u0027Microsoft\u0027&$skip=3&$top=1", "type": "NewsResult" }, "ID": "aba258db-16c3-4dfe-8d46-8e2cda98b1c1", "Title": "Microsoft Introduces Three New Smartphones", "Url": "http://bits.blogs.nytimes.com/2014/09/04/microsoft-introduces-three-new-smartphones/?_php=true&_type=blogs&_r=0", "Source": "Bits Blog NYTimes", "Description": "BERLIN — Microsoft is adding to its smartphone collection. On Thursday, the tech giant introduced three new devices, its first ones since the completion in April of its $7.5 billion deal for Nokia’s cellphone business and just a few months after ...", "Date": "2014-09-04T19:25:34Z" }, { "__metadata": { "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/News?Query=\u0027Microsoft\u0027&$skip=4&$top=1", "type": "NewsResult" }, "ID": "a84fc9c4-d34c-483c-9e5d-abc3f132401f", "Title": "Microsoft launches Nokia X2 for Rs 8,699", "Url": "http://timesofindia.indiatimes.com/tech/mobiles/Microsoft-launches-Nokia-X2-for-Rs-8699/articleshow/41804520.cms", "Source": "Times of India", "Description": "NEW DELHI: Beefing up its budget smartphone portfolio, Microsoft Devices has launched Nokia X2, priced at Rs 8,699, in India to compete more aggressively with the likes of Samsung as well as homegrown firms like Micromax. The Nokia X2 was unveiled globally ...", "Date": "2014-09-05T18:12:48Z" }, { "__metadata": { "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/News?Query=\u0027Microsoft\u0027&$skip=5&$top=1", "type": "NewsResult" }, "ID": "934c83f1-d014-4d62-966c-a9c43dd1c29b", "Title": "Microsoft\u0027s Bing Image tool draws a copyright infringement suit", "Url": "http://www.networkworld.com/article/2603029/microsoft-subnet/microsofts-bing-image-tool-draws-a-copyright-infringement-suit.html", "Source": "Network World", "Description": "Microsoft\u0027s Bing Image Widget is designed to give publishers the ability to publish images from the Bing search engine on their web page, but Getty Images is accusing Microsoft of \"massive infringement\" and is suing over it. Microsoft released Bing Image ...", "Date": "2014-09-05T15:56:48Z" }, { "__metadata": { "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/News?Query=\u0027Microsoft\u0027&$skip=6&$top=1", "type": "NewsResult" }, "ID": "88d39209-0d54-4203-b345-e09a3f51c9e5", "Title": "Microsoft can’t advertise Destiny the game, so they made Destiny the fragrance", "Url": "http://www.geek.com/games/microsoft-cant-advertise-destiny-the-game-so-they-made-destiny-the-fragrance-1603663/", "Source": "Geek", "Description": "This year things have gotten downright silly when it comes to exclusively promoting games for next generation consoles. First Microsoft’s not-so-exclusive announcement for the new Tomb Raider rattled gamers around the world, and now it looks like Sony ...", "Date": "2014-09-05T13:55:06Z" }]
                }]
            });

            expect($('.bingNews')).toBeInDOM();
            expect($('.newsList')).toBeInDOM();
            expect($('.newsList li').length).toBe(3);
        }
    });
}