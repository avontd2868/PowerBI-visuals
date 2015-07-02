//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

/* tslint:disable:no-unused-variable */

interface JQuery {
    plugin(): JQuery;
    plugin(settings: Object): JQuery;
}

var visual: powerbi.IVisual;

module powerbi.visuals.runner {

    import DataViewTransform = powerbi.data.DataViewTransform;
    
    var dataColors: DataColorPalette = new powerbi.visuals.DataColorPalette();
    var visualStyle: IVisualStyle = {
        titleText: {
            color: { value: 'rgba(51,51,51,1)' }
        },
        subTitleText: {
            color: { value: 'rgba(145,145,145,1)' }
        },
        colorPalette: {
            dataColors: dataColors,
        },
        labelText: {
            color: {
                value: 'rgba(51,51,51,1)',
            },
            fontSize: '11px'
        },
        isHighContrast: false,
    };

    export class VisualsRunner {

        private width: number;
        private height: number;
       
        private rootElement: JQuery;

        private pluginService: IVisualPluginService;
        private colorAllocatorFactory: IColorAllocatorFactory;
        private httpService: IHttpService;

        private dataView: DataView;
        
        public static initialize(): void {         
        }

        private initDataView(): void {

            var dataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        name: 'col1',
                        type: ValueType.fromDescriptor({text: true})
                    },
                    {
                        displayName: 'col2',
                        name: 'col2',
                        isMeasure: true,
                        type: ValueType.fromDescriptor({numeric: true})
                    }],
            };


            var columns: DataViewValueColumn[] = [];
            var column: DataViewValueColumn = {
                source: dataViewMetadata.columns[1],
                min: 100000,
                max: 200000,
                subtotal: 300000,
                values: [100000, 200000, 150000],
            };

            columns.push(column);

            var values: DataViewValueColumns = DataViewTransform.createValueColumns(columns);

            this.dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['abc', 'def', 'ghi'],
                        identity: [null, null, null],
                    }],
                    values: values
                }
            };

        }
        
        public startup(element, options): void {
            this.pluginService = powerbi.visuals.visualPluginFactory.create();
            this.colorAllocatorFactory = powerbi.visuals.createColorAllocatorFactory();

            this.rootElement = $(element);

            this.width = this.rootElement.width() - 40;
            this.height = Math.floor(this.width * 3 / 4);
        
            this.populateVisualTypeSelect();
            this.initDataView();        
        }
        

        private populateVisualTypeSelect(): void {

            var typeSelect = $('#visualTypes');
            typeSelect.append('<option value="">(none)</option>');

            var visuals = this.pluginService.getVisuals();
            for (var i = 0, len = visuals.length; i < len; i++) {
                var visual = visuals[i];
                typeSelect.append('<option value="' + visual.name + '">' + visual.name + '</option>');
            }

            typeSelect.change(() => this.onVisualTypeSelection(typeSelect.val()));
        }

        private onVisualTypeSelection(value: string): void {
                    
            var plugin = this.pluginService.getPlugin(value);
            this.render(plugin);        
        }

        public clear(): void {
            this.rootElement.empty();
        }

        private createViz(): JQuery {
            var element = $('<div/>');
            element.height(this.height);
            element.width(this.width);
            element.addClass('visual');
            element.css({
                'background-color': 'white',
                'padding': '10px',
                'margin': '5px'
            });
            this.rootElement.append(element);
            return element;
        }

        public getElement(): JQuery {
            this.clear();         
            return this.createViz();
        }

        public render(plugin): void {
          
            //var hostServices: powerbi.VisualHostServices;

            var element = plugin.create();
            element.init({
                element: this.getElement(),
                host: null,
                style: visualStyle,
                viewport: {
                    height: this.height,
                    width: this.width
                },
                settings: { slicingEnabled: true },
                interactivity: { isInteractiveLegend: false, selection: false },
                animation: { transitionImmediate: true }
            });

            element.onDataChanged({ dataViews: [this.dataView] });
        }
    }
}


(function ($) {

    $.fn.visuals = function (settings) {
        
        var options = {
            settingA: "Example",
            settingB: 5
        };

        if (settings) {
            $.extend(options, settings);
        }

        return this.each(function (index, element) {
            var runner = new powerbi.visuals.runner.VisualsRunner();
            runner.startup(element, options);
        });
    };

})(jQuery);