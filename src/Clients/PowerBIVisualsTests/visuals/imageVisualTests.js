//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var ImageVisual = powerbi.visuals.ImageVisual;
    describe("ImageVisual", function () {
        it('ImageVisual registered capabilities', function () {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('image').capabilities).toBe(ImageVisual.capabilities);
        });
        it('ImageVisual registered capabilities: objects', function () {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('image').capabilities.objects).toBeDefined();
        });
        it('Image no visual configuration', function () {
            var element = powerbitests.helpers.testDom('200', '300');
            var options = {
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: {
                    transitionImmediate: true
                }
            };
            var image = new ImageVisual();
            image.init(options);
            expect(element.children().length).toBe(0);
        });
        it('Image to about:blank', function () {
            var element = powerbitests.helpers.testDom('200', '300');
            var options = {
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: {
                    transitionImmediate: true
                }
            };
            var image = new ImageVisual();
            image.init(options);
            image.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [],
                        objects: { general: { imageUrl: 'about:blank' } }
                    }
                }]
            });
            expect(element.find('.imageBackground').css('backgroundImage')).toBe('url(about:blank)');
        });
        it('Image from base64 string', function () {
            var element = powerbitests.helpers.testDom('200', '300');
            var options = {
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: {
                    transitionImmediate: true
                }
            };
            var image = new ImageVisual();
            image.init(options);
            var imageBase64value = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAkFBMVEX////+/v78+/vz8e/29PLr5+Tw7etwWEdbPyzTy8Tj3trn4t78+/mTgHOsnZLCt69PMRzX0cvJwLmllYm1qJ53YE8zEQBsUj9QMR68sKZHKRREJA+aiHx+aViGcF7q5t6NeWpkSDafjoAvCwA4FgC4rKSnmJE+HAaKdWhVOCeHeG1TPi5jT0BxX1J5aFtlSznQd83pAAACIklEQVQYGZXBiVraQBiG0ff7s8BMQsJkEaNsalspXbj/u2us1Scg7TM9B64R/0X8H6FMxBPu53ePiCS6bz/qkljCfatK4hnHIxjRjPURiWjCf69AIpYIP44eRCxRdj/bBBFLkHZHh4glQbYOiGgykgoRT2QDIprIhxwRr3AJ8VTuChDvJPFPZQrijQyQuE6vTC94IUiLHMRHMnFGQmSHu+f7vkBckIDcN0PXfR7qJmR5Caj4+mnR1LN5InFGENrDYVHVLviiKIJzIWQp65uG0anCmBKu7ytvTCjNdmVwmJWqDogJEU4NIzPTG0YlCEzdAjFhDPOMP/QbryTAWFcYE4L262lfucx4l7jq0CFAtvGICeGTpN6v5svl/DTrN5t+9rB8/vR0WyMw6kfElHiYMUp8XS22/Wx1WvWbRRXESOT7RGJKrOYmE5cEIm094oxY32cISTaSkMxMYpQOHnHOcDcO443Eu9TliAtSulxjXFHuSsQHxn4ucYVAfCT8vZOIV3KYYUSznfLlgBFHZBk0S09JFOEzjM8PASQuyMQFEQpkNLPOQBITxjVJjWTkj4s6Y0oi/eIQ54QbwAzyuhtclpa8kAT17VODuCCaKgczIE2LXSnJDAj9022D+ECExy5jJEbiRVr3N3ePCeIKoXq/HnzKq9R3m+XzvMpBXCWQa7f9ZrvdbvrV/O521gbAxN+IURKGqm3brvElIxP/ImNCJi78AkZVGOZlPDldAAAAAElFTkSuQmCC';
            image.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [],
                        objects: { general: { imageUrl: imageBase64value } }
                    }
                }]
            });
            expect(element.find('.imageBackground').css('backgroundImage')).toBe('url(' + imageBase64value + ')');
        });
    });
})(powerbitests || (powerbitests = {}));
