//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

/* tslint:disable:no-unused-variable */
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

        private rootSelector: string = '#itemContainer';
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
                        name: 'col1',
                        type: ValueType.fromDescriptor({text: true})
                    },
                    {
                        name: 'col2',
                        isMeasure: true,
                        type: ValueType.fromDescriptor({numeric: true})
                    }],
            };

            this.dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['abc', 'def', 'ghi'],
                        identity: [null, null, null],
                    }],
                    values: powerbi.data.DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        min: 100000,
                        max: 200000,
                        subtotal: 300000,
                        values: [100000, 200000, 150000],
                    }])
                }
            };

        }
        
        public startup(): void {
            this.pluginService = powerbi.visuals.visualPluginFactory.create();
            this.colorAllocatorFactory = powerbi.visuals.createColorAllocatorFactory();

            this.rootElement = $(this.rootSelector);

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
            var c = $('<div/>');
            c.height(this.height);
            c.width(this.width);
            c.addClass('visual');
            c.css({
                'background-color': 'white',
                'padding': '10px',
                'margin': '5px'
            });
            this.rootElement.append(c);
            return c;
        }

        public getElement(): JQuery {
            this.clear();         
            return this.createViz();
        }

        public render(plugin): void {
          
            var v = plugin.create();
            v.init({
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

            v.onDataChanged({ dataViews: [this.dataView] });
        }
    }
}
