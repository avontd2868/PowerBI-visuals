//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export interface ImageDataViewObjects extends DataViewObjects {
        general: ImageDataViewObject;
    }

    export interface ImageDataViewObject extends DataViewObject {
        imageUrl: string;
    }

    export class ImageVisual implements IVisual {
        public static capabilities: VisualCapabilities = {
            objects: {
                general: {
                    properties: {
                        imageUrl: {
                            type: { misc: { imageUrl: true } } 
                        }
                    }
                }
            }
        };

        private element: JQuery;

        public init(options: VisualInitOptions) {
            this.element = options.element;
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            this.element.empty();

            var dataViews = options.dataViews;
            if (!dataViews || dataViews.length === 0)
                return;

            var objects = <ImageDataViewObjects>dataViews[0].metadata.objects;
            if (!objects || !objects.general)
                return;

            var div = $("<div class='imageBackground' />");

            if (objects.general.imageUrl)
                div.css("backgroundImage", "url(" + objects.general.imageUrl + ")");

            div.appendTo(this.element);
        }

        public onResizing(viewport: IViewport, duration: number): void {
        }
    }
} 