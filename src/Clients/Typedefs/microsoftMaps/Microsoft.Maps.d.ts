declare module Microsoft.Maps {

    /*
        Global functions
    */

    /*
        Loads the specified registered module, making its functionality available. An optional function can be specified that is called when the module is loaded.
        To register a module, use the registerModule method.

        The following Bing Maps modules are available:

        Microsoft.Maps.AdvancedShapes
        Microsoft.Maps.Directions
        Microsoft.Maps.Overlays.Style
        Microsoft.Maps.Search
        Microsoft.Maps.Themes.BingTheme
        Microsoft.Maps.Traffic
        Microsoft.Maps.VenueMaps
    */
    export function loadModule(moduleKey: string, options?: { callback: () => void; }): void;
    /*
        Signals that the specified module has been loaded and if specified, calls the callback function in loadModule. Call this method at the end of your module script.
    */
    export function moduleLoaded(moduleKey: string): void;

    /*
        Registers a module with the map control. The name of the module is specified in moduleKey, the module script is defined in scriptUrl, and the options provides the location of a *.css file to load with the module.
        Tip: To minimize possible conflicts with other custom modules, choose a unique module name (defined in moduleKey). For example, you can use your company name in the name of the module.
        Once you have registered a module, you can make its functionality available by loading it using loadModule.
    */
    export function registerModule(moduleKey: string, scriptUrl: string, options?: string[]): void;

    /*
        Tagging interface for items in an EntityCollection
    */
    export interface Entity {
        //No members
    }

    /*
        Represents the coordinates of the position of the user.
    */
    export class Coordinates {
        /*************
        * PROPERTIES *
        **************/
        /*
            The accuracy, in meters, of the latitude and longitude values.
        */
        accuracy: number;

        /*
            The altitude of the location.
        */
        altitude: number;

        /*
            The accuracy, in meters, of the altitude value.
        */
        altitudeAccuracy: number;

        /*
            The direction of travel of the hosting device.
        */
        heading: number;

        /*
            The latitude of the location.
        */
        latitude: number;

        /*
            The longitude of the location.
        */
        longitude: number;

        /*
            The ground speed of the hosting device, in meters per second.
        */
        speed: number;
    }

    /*
        Contains methods for obtaining and displaying the user’s current location.
        Note: This functionality is only available on browsers that support the W3C GeoLocation API.
    */
    export class GeoLocationProvider {
        constructor (map: Map);

        /*
            Renders a geo location accuracy circle on the map. The accuracy circle is created with the center at the specified location, using the given radiusInMeters, and with the specified number of segments for the accuracy circle polygon. Additional options are also available to adjust the style of the polygon.
        */
        addAccuracyCircle(center: Location, radiusInMeters: number, segments: number, options: PositionCircleOptions): void;

        /*
            Cancels the processing of the current getCurrentPosition request. This method prevents the response from being processed.
        */
        cancelCurrentRequest(): void;

        /*
            Obtains the user’s current location and displays it on the map.
            Important:
                The accuracy of the user location obtained using this method varies widely depending on the desktop browser or mobile device of the requesting client. Desktop users may experience low user location accuracy (accuracy circles with large radiuses), while mobile user location accuracy may be much greater (a few meters).
        */
        getCurrentPosition(options: PositionOptions): void;

        /*
            Removes the current geo location accuracy circle.
        */
        removeAccuracyCircle(): void;
    }

    export class MouseEventArgs {
        eventName: string;
        handled: boolean;
        isPrmary: boolean;
        isSecondary: boolean;
        isTouchEvent: boolean;
        originalEvent: any;
        pageX: number;
        pageY: number;
        target: any;
        targetType: string;
        wheelDelta: number;

        getX(): number;
        getY(): number;
    }

    export class KeyEventArgs {
        altKey: boolean;
        ctrlKey: boolean;
        eventName: string;
        //A boolean indicating whether the event is handled. If this property is set to true, the default map control behavior for the event is cancelled.
        handled: boolean;
        //The ASCII character code that identifies the keyboard key that was pressed.
        keyCode: string;
        originalEvent: any;
        shiftKey: boolean;
    }

    export class LocationRect {
        constructor (center: Location, width: number, height: number);

        center: Location;
        height: number;
        width: number;

        static fromCorners(northwest: Location, southeast: Location): LocationRect;
        static fromEdges(north: number, west: number, south: number, east: number, altitude: number, altitudeReference: AltitudeReference): LocationRect;

        static fromLocations(...locations: Location[]): LocationRect;
        static fromString(str: string): LocationRect;

        clone(): LocationRect;
        contains(location: Location): boolean;
        getEast(): number;
        getNorth(): number;
        getNorthwest(): Location;
        getSouth(): number;
        getSoutheast(): Location;
        getWest(): number;
        insersects(rect: LocationRect): boolean;
        toString(): string;
    }

    export class Location {
        constructor (latitude: number, longitude: number, altitude?: number, altitudeReference?: AltitudeReference);

        altitude: number;
        altitudeReference: AltitudeReference;
        latitude: number;
        longitude: number;

        static areEqual(location1: Location, location2: Location): boolean;
        static normalizeLongitude(longitude: number): number;

        clone(): Location;
        toString(): string;
    }

    /*
        Defines the reference point from which the altitude is measured.
    */
    export class AltitudeReference {
        /*
            The altitude is measured from the ground level.
        */
        static ground: string;
        /*
            The altitude is measured from the WGS 84 ellipsoid of the Earth.
        */
        static ellipsoid: string;

        /*
            Determines if the specified reference is a supported AltitudeReference.
        */
        static isValid(reference: AltitudeReference): boolean;
    }

    export class MapMode {
        getDrawShapesInSingleLayer(): boolean;
        setDrawShapesInSingleLayer(drawInSingleLayer: boolean): void;
        setViewChangeEndDelay(delay: number): void;
    }

    export class MapTypeId {
        static aerial: string;
        static auto: string;
        static birdseye: string;
        static collinsBart: string;
        static mercator: string;
        static ordnanceSurvey: string;
        static road: string;
    }

    /*
        Represents a color.
    */
    export class Color {
        /*
            Initializes a new instance of the Color class. The a parameter represents opacity. The range of valid values for all parameters is 0 to 255.
        */
        constructor (a: number, r: number, g: number, b: number);

        /*
            The opacity of the color. The range of valid values is 0 to 255.
        */
        a: number;

        /*
            The red value of the color. The range of valid values is 0 to 255.
        */
        r: number;

        /*
            The green value of the color. The range of valid values is 0 to 255.
        */
        g: number;

        /*
            The blue value of the color. The range of valid values is 0 to 255.
        */
        b: number;

        /*
            Creates a copy of the Color object.
        */
        static clone(color: Color): Color;

        /*
            Converts the specified hex string to a Color.
        */
        static fromHex(hex: string): Color;

        /*
            Returns a copy of the Color object.
        */
        clone(): Color;

        /*
            Returns the opacity of the Color as a value between 0 (a=0) and 1 (a=255).
        */
        getOpacity(): number;

        /*
            Converts the Color into a 6-digit hex string. Opacity is ignored. For example, a Color with values (255,0,0,0) is returned as hex string #000000.
        */
        toHex(): string;

        /*
            Converts the Color object to a string.
        */
        toString(): string;
    }

    export interface MapOptions {
        backgroundColor?: Color;
        credentials?: string;
        customizeOverlays?: boolean;
        disableBirdseye?: boolean;
        disableKeyboardInput?: boolean;
        disableMouseInput?: boolean;
        disablePanning?: boolean;
        disableTouchInput?: boolean;
        disableUserInput?: boolean;
        disableZooming?: boolean;
        enableClickableLogo?: boolean;
        enableSearchLogo?: boolean;
        fixedMapPosition?: boolean;
        height?: number;
        inertiaIntensity?: number;
        showBreadcrumb?: boolean;
        showCopyright?: boolean;
        showDashboard?: boolean;
        showMapTypeSelector?: boolean;
        showScalebar?: boolean;
        theme?: any;
        tileBuffer?: number;
        useInertia?: boolean;
        width?: number;
    }

    export interface ViewOptions {
        //Properties
        animate?: boolean;
        bounds?: LocationRect;
        center?: Location;
        centerOffset?: Point;
        heading?: number;
        labelOverlay?: LabelOverlay;
        mapTypeId?: string;
        padding?: number;
        zoom?: number;
    }

    export class PixelReference {
        //The pixel is defined relative to the map control’s root element, where the top left corner of the map control is (0, 0). Using this option might cause a page reflow which may negatively impact performance.
        static control: string;
        //The pixel is defined relative to the page, where the top left corner of the HTML page is (0, 0). This option is best used when working with mouse or touch events. Using this option might cause a page reflow which may negatively impact performance.
        static page: string;
        //The pixel is defined in viewport coordinates, relative to the center of the map, where the center of the map is (0, 0). This option is best used for positioning geo-aligned entities added to the user layer.
        static viewport: string;

        static isValid(reference: PixelReference): boolean;
    }

    export class Point {
        constructor (x: number, y: number);

        x: number;
        y: number;

        static areEqual(point1: Point, point2: Point): boolean;
        static clone(point: Point): Point;

        clone(): Point;
        toString(): string;
    }

    export class Infobox implements Entity { }

    export class Polygon implements Entity {
        constructor (locations: Location[], options?: PolygonOptions);

        getFillColor(): Color;
        getLocations(): Location[];
        getStrokeColor(): Color;
        getStrokeDashArray(): string;
        getStrokeThickness(): number;
        getVisible(): boolean;
        setLocations(locations: Location[]): void;
        setOptions(options: PolylineOptions): void;
        toString(): string;

        click: (eventArgs: MouseEventArgs) => any;
        dbclick: (eventArgs: MouseEventArgs) => any;
        entitychanged: (entity: Entity) => any;
        mousedown: (eventArgs: MouseEventArgs) => any;
        mouseout: (eventArgs: MouseEventArgs) => any;
        mouseover: (eventArgs: MouseEventArgs) => any;
        mouseup: (eventArgs: MouseEventArgs) => any;
        rightclick: (eventArgs: MouseEventArgs) => any;
    }

    export class Polyline implements Entity {
        constructor (locations: Location[], options?: PolylineOptions);

        getLocations(): Location[];
        getStrokeColor(): Color;
        getStrokeDashArray(): string;
        getStrokeThickness(): number;
        getVisible(): boolean;
        setLocations(locations: Location[]): void;
        setOptions(options: PolylineOptions): void;
        toString(): string;

        click: (eventArgs: MouseEventArgs) => any;
        dbclick: (eventArgs: MouseEventArgs) => any;
        entitychanged: (entity: Entity) => any;
        mousedown: (eventArgs: MouseEventArgs) => any;
        mouseout: (eventArgs: MouseEventArgs) => any;
        mouseover: (eventArgs: MouseEventArgs) => any;
        mouseup: (eventArgs: MouseEventArgs) => any;
        rightclick: (eventArgs: MouseEventArgs) => any;
    }

    export class Pushpin implements Entity {
        constructor (location: Location, options?: PushpinOptions);
        getAnchor(): Point;
        getIcon(): string;
        getHeight(): number;
        getLocation(): Location;
        getText(): string;
        getTextOffset(): Point;
        getTypeName(): string;
        getVisible(): boolean;
        getWidth(): number;
        getZIndex(): number;
        setLocation(location: Location): void;
        setOptions(options: PushpinOptions): void;
        toString(): string;

        click: (eventArgs: MouseEventArgs) => any;
        dblclick: (eventArgs: MouseEventArgs) => any;
        drag: (object: Pushpin) => any;
        dragend: (eventArgs: MouseEventArgs) => any;
        dragstart: (eventArgs: MouseEventArgs) => any;
        entitychanged: (object: { entity: Entity; }) => any;
        mousedown: (eventArgs: MouseEventArgs) => any;
        mouseout: (eventArgs: MouseEventArgs) => any;
        mouseover: (eventArgs: MouseEventArgs) => any;
        mouseup: (eventArgs: MouseEventArgs) => any;
        rightclick: (eventArgs: MouseEventArgs) => any;
    }

    export class TileLayer implements Entity {
        constructor (options: TileLayerOptions);

        getOpacty(): number;
        /*
        Returns the tile source of the tile layer.
        The projection parameter accepts the following values: mercator, enhancedBirdseyeNorthUp, enhancedBirdseyeSouthUp, enhancedBirdseyeEastUp, enhancedBirdseyeWestUp
        */
        getTileSource(projection: string): TileSource;
        getZIndex(): number;
        setOptions(options: TileLayerOptions): void;
        toString(): string;

        tiledownloadcomplete: () => any;
    }

    export class PositionError {
        /*
            The error code.
            Any one of the following error codes may be returned:
            0 - An error occurred that is not covered by other error codes.

            1 - The application does not have permission to use the GeoLocation API.

            2 - The position of the host device could not be determined.

            3 - The specified timeout was exceeded.
        */
        code: number;

        //The error message. This message is for the developer and is not intended to be displayed to the end user.
        message: string;
    }

    export class LabelOverlay {
        //Map labels are not shown on top of imagery.
        static hidden: string;
        //Map labels are shown on top of imagery.
        static visible: string;

        static isValid(labelOverlay: LabelOverlay): boolean;
    }

    export class EntityState {
        //The entity is highlighted on the map.
        static highlighted: string;

        //The entity is not highlighted or selected.
        static none: string;

        //The entity is selected on the map.
        static selected: string;
    }

    /*
        Defines a tile layer’s visibility during animation.
    */
    export class AnimationVisibility {
        //The map control determines whether or not to show a tile layer based on system capability. If a browser can render a tile layer with acceptable performance, it is displayed during animations.
        static auto: string;

        //The tile layer is not displayed during animation.
        static hide: string;

        //The tile layer is displayed during animations. This option may impact performance on older browsers.
        static show: string;
    }

    export class InfoboxType {
        //A smaller info box with space for a title.
        static mini: string;

        //The default info box style. This standard info box makes space for a title, title link, description, and other links if they are specified.
        static standard: string;
    }

    export class Position {
        //The position as a W3C Coordinates object.
        coords: Coordinates;
        //The time when the position was determined, in the form of a DOMTimeStamp.
        timestamp: string;
    }

    export interface TileSourceOptions {
        height?: number;
        //The string that constructs the URLs used to retrieve tiles from the tile source. This property is required. The uriConstructor will replace {subdomain} and {quadkey}.
        uriConstructor: string;
        width?: number;
    }

    export class TileSource {
        constructor (options: TileSourceOptions);

        getHeight(): number;
        getUriConstructor(): string;
        getWidth(): string;
        toString(): string;
    }

    export interface TileLayerOptions {
        animationDisplay?: AnimationVisibility;
        downloadTimeout?: number;
        mercator?: TileSource;
        opacity?: number;
        visible?: boolean;
        zIndex?: number;
    }

    export interface PushpinOptions {
        anchor?: Point;
        draggable?: boolean;
        height?: number;
        htmlContent?: string;
        icon?: string;
        infobox?: Infobox;
        state?: EntityState;
        text?: string;
        textOffset?: Point;
        typeName?: string;
        visible?: boolean;
        width?: number;
        zIndex?: number;
    }

    export interface PositionOptions {
        enableHighAccuracy?: boolean;
        /*
        The function to call when an error occurs during the user location request. The callback function must accept one argument.
        The argument object contains two properties, internalError, a PositionError type, and errorCode, a number.
        
        Any one of the following errorCode values may be returned:
        1 - The application origin does not have permission to use the GeoLocation API.

        2 - The position of the user could not be determined because of a device failure.

        3 - The time specified in timeout has been exceeded.

        4 - A request is already in process.

        5 - The user’s browser does not support geo location.
        */
        errorCallback?: (internalError: PositionError, errorCode: number) => void;
        maximumAge?: number;
        showAccuracyCircle?: boolean;
        successCallback?: (center: Location, position: Position) => void;
        timeout?: number;
        updateMapView?: boolean;
    }

    //TODO: Change options interfaces so a concrete class and an interface exists
    export interface PositionCircleOptions {
        //The polygon options for the geo location accuracy circle.
        polygonOptions?: PolygonOptions;
        //A boolean indicating whether to display the geo location accuracy circle. The default value is true. If this property is set to false, a geo location accuracy circle is not drawn and any existing accuracy circles are removed.
        showOnMap?: boolean;
    }

    export interface PolylineOptions {
        //The color of the outline of the polygon.
        strokeColor?: Color;
        //A string representing the stroke/gap sequence to use to draw the outline of the polygon. The string must be in the format S, G, S*, G*, where S represents the stroke length and G represents gap length. Stroke lengths and gap lengths can be separated by commas or spaces. For example, a stroke dash string of “1 4 2 1” would draw the polygon outline with a dash, four spaces, two dashes, one space, and then repeated.
        strokeDashArray?: string;
        //The thickness of the outline of the polygon.
        strokeThickness?: number;
        //A boolean indicating whether to show or hide the polygon. A value of false indicates that the polygon is hidden, although it is still an entity on the map.
        visible?: boolean;
    }

    export interface PolygonOptions {
        //The color of the inside of the polygon.
        fillColor?: Color;
        //The info box associated with this polygon. If an info box is assigned and the Microsoft.Maps.Themes.BingTheme module is loaded, then the info box appears when the hover or click events of the polygon occur.
        infobox?: Infobox;
        //The color of the outline of the polygon.
        strokeColor?: Color;
        //A string representing the stroke/gap sequence to use to draw the outline of the polygon. The string must be in the format S, G, S*, G*, where S represents the stroke length and G represents gap length. Stroke lengths and gap lengths can be separated by commas or spaces. For example, a stroke dash string of “1 4 2 1” would draw the polygon outline with a dash, four spaces, two dashes, one space, and then repeated.
        strokeDashArray?: string;
        //The thickness of the outline of the polygon.
        strokeThickness?: number;
        //A boolean indicating whether to show or hide the polygon. A value of false indicates that the polygon is hidden, although it is still an entity on the map.
        visible?: boolean;
    }

    export interface InfoboxOptions {
        //A list of the info box actions, where each item is a label (the link text) or icon (the URL of the image to use as the icon link) and eventHandler (name of the function handling a click of the action link).
        actions?: { label?: string; icon?: string; eventHandler: () => void; };
        //The string displayed inside the info box.
        description?: string;
        htmlContent?: string;
        id?: string;
        location?: Location;
        offset?: Point;
        showCloseButton?: boolean;
        showPointer?: boolean;
        pushpin?: Pushpin;
        title?: string;
        titleAction?: { label?: string; eventHandler: () => void; };
        titleClickHandler?: string;
        typeName?: InfoboxType;
        visible?: boolean;
        width?: number;
        height?: number;
    }

    /*
        Contains a collection of entities. An Entity can be any one of the following types: Infobox, Polygon, Polyline, Pushpin, TileLayer, or EntityCollection.
    */
    export interface EntityCollectionOptions {
        bubble?: boolean;
        visible?: boolean;
        zIndex?: number;
    }

    export class EntityCollection implements Entity {
        /*
         * CONSTRUCTOR
         */

        /*
            Initializes a new instance of the EntityCollection class.
        */
        EntityCollection(options?: EntityCollectionOptions);

        /*
         * METHODS
         */

        /*
            Removes all entities from the collection.
        */
        clear(): void;
        get(index: number): Entity;
        getLength(): number;
        getVisible(): boolean;
        getZIndex(): number;
        indexOf(entity: Entity): number;
        insert(entity: Entity, index: number): void;
        pop(): Entity;
        push(entity: Entity): void;
        remove(entity: Entity): Entity;
        removeAt(index: number): Entity;
        setOptions(options: EntityCollectionOptions): void;
        toString(): string;

        //Events
        entityAdded: (object: { collection: EntityCollection; entity: Entity; }) => any;
        entityChanged: (object: { collection: EntityCollection; entity: Entity; }) => any;
        entityRemoved: (object: { collection: EntityCollection; entity: Entity; }) => any;
    }

    export class Map {
        //Constructors
        constructor (mapElement: HTMLElement, options?: MapOptions);
        constructor (mapElement: HTMLElement, options?: ViewOptions);
        width: number;
        height: number;

        //Properties
        entities: EntityCollection;

        //Static Methods
        getVersion(): string;

        //Methods
        blur(): void;
        dispose(): void;
        focus(): void;
        getBounds(): LocationRect;
        getCenter(): Location;
        getCopyrights(callback: (attributions: string[]) => void ): string[];
        getCredentials(callback: (credentials: string) => void ): void;
        getHeading(): number;
        getHeight(): number;
        getImageryId(): string;
        getMapTypeId(): string;
        getMetersPerPixel(): number;
        getMode(): MapMode;
        getModeLayer(): Node;
        getOptions(): MapOptions;
        getPageX(): number;
        getRootElement(): Node;
        getTargetBounds(): LocationRect;
        getTargetCenter(): Location;
        getTargetHeading(): number;
        getTargetMetersPerPixel(): number;
        getTargetZoom(): number;
        getUserLayer(): Node;
        getViewportX(): number;
        getViewportY(): number;
        getWidth(): number;
        getZoom(): number;
        getZoomRange(): { min: number; max: number; };
        isDownloadingTiles(): boolean;
        isMercator(): boolean;
        isRotationEnabled(): boolean;
        setMapType(mapTypeId: string): void;
        setOptions(options: { height: number; width: number; }): void;
        setView(options: ViewOptions): void;
        restrictZoom(min: number, max: number);
        tryLocationToPixel(location: Location, reference?: PixelReference): Point;
        tryLocationToPixel(location: Location[], reference?: PixelReference): Point[];
        tryPixelToLocation(point: Point, reference?: PixelReference): Location;
        tryPixelToLocation(point: Point[], reference?: PixelReference): Location[];

        //Events
        click: (eventArgs: MouseEventArgs) => any;
        copyrightchanged: () => any;
        dblclick: (eventArgs: MouseEventArgs) => any;
        imagerychanged: () => any;
        keydown: (eventArgs: KeyEventArgs) => any;
        keypress: (eventArgs: KeyEventArgs) => any;
        keyup: (eventArgs: KeyEventArgs) => any;
        maptypechanged: () => any;
        mousedown: (eventArgs: MouseEventArgs) => any;
        mousemove: (eventArgs: MouseEventArgs) => any;
        mouseout: (eventArgs: MouseEventArgs) => any;
        mouseover: (eventArgs: MouseEventArgs) => any;
        mouseup: (eventArgs: MouseEventArgs) => any;
        mousewheel: (eventArgs: MouseEventArgs) => any;
        rightlick: (eventArgs: MouseEventArgs) => any;
        targetviewchanged: () => any;
        tiledownloadcomplete: () => any;
        viewchange: () => any;
        viewchangeend: () => any;
        viewchangestart: () => any;
    }

    module Events {
        function addHandler(target: any, eventName: string, handler: any);
    }
}