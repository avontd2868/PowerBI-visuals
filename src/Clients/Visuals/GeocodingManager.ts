//----------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//----------------------------------------------------------------

module powerbi.visuals {
    export interface IPoint {
        x: number;
        y: number;
    }

    export class Point implements IPoint {
        public x: number;
        public y: number;

        constructor(x: number = 0, y: number = 0) {
            this.x = x || 0;
            this.y = y || 0;
        }
	}

	export interface IRect {
        left: number;
        top: number;
        width: number;
        height: number;
    }

    export class Rect implements IRect {
        // Fields
        public left: number;
        public top: number;
        public width: number;
        public height: number;

        // Constructor
        constructor(left: number = 0, top: number = 0, width: number = 0, height: number = 0) {
            this.left = left || 0;
            this.top = top || 0;
            this.width = width || 0;
            this.height = height || 0;
        }
    }

    export interface I2DTransformMatrix {
        m00: number;
        m01: number;
        m02: number;

        m10: number;
        m11: number;
        m12: number;
        // 3rd row not used so we don't declare it
    }

    /** Transformation matrix math wrapper */
    export class Transform {

        // Fields
        private _inverse: Transform;
        public matrix: I2DTransformMatrix;

        // Constructor
        constructor(m?: I2DTransformMatrix) {
            this.matrix = m || {
                m00: 1, m01: 0, m02: 0,
                m10: 0, m11: 1, m12: 0,
            };
        }

        // Methods
        public applyToPoint(point: IPoint): IPoint {
            if (!point) {
                return point;
            }
            var m = this.matrix;
            return {
                x: m.m00 * point.x + m.m01 * point.y + m.m02,
                y: m.m10 * point.x + m.m11 * point.y + m.m12,
            };
        }

        public applyToRect(rect: Rect): IRect {
            if (!rect) {
                return rect;
            }

            var x0 = rect.left;
            var y0 = rect.top;

            var m = this.matrix;
            var isScaled = m.m00 !== 1 || m.m11 !== 1;
            var isRotated = m.m01 !== 0 || m.m10 !== 0;
            if (!isRotated && !isScaled) {
                // Optimize for the translation only case
                return { left: x0 + m.m02, top: y0 + m.m12, width: rect.width, height: rect.height };
            }

            var x1 = rect.left + rect.width;
            var y1 = rect.top + rect.height;

            var minX: number;
            var maxX: number;
            var minY: number;
            var maxY: number;

            if (isRotated) {
                var p0x = m.m00 * x0 + m.m01 * y0 + m.m02;
                var p0y = m.m10 * x0 + m.m11 * y0 + m.m12;
                var p1x = m.m00 * x0 + m.m01 * y1 + m.m02;
                var p1y = m.m10 * x0 + m.m11 * y1 + m.m12;
                var p2x = m.m00 * x1 + m.m01 * y0 + m.m02;
                var p2y = m.m10 * x1 + m.m11 * y0 + m.m12;
                var p3x = m.m00 * x1 + m.m01 * y1 + m.m02;
                var p3y = m.m10 * x1 + m.m11 * y1 + m.m12;
                minX = Math.min(p0x, p1x, p2x, p3x);
                maxX = Math.max(p0x, p1x, p2x, p3x);
                minY = Math.min(p0y, p1y, p2y, p3y);
                maxY = Math.max(p0y, p1y, p2y, p3y);
            } else {
                var p0x = m.m00 * x0 + m.m02;
                var p0y = m.m11 * y0 + m.m12;
                var p3x = m.m00 * x1 + m.m02;
                var p3y = m.m11 * y1 + m.m12;
                minX = Math.min(p0x, p3x);
                maxX = Math.max(p0x, p3x);
                minY = Math.min(p0y, p3y);
                maxY = Math.max(p0y, p3y);
            }

            return { left: minX, top: minY, width: maxX - minX, height: maxY - minY };
        }

        public translate(xOffset: number, yOffset: number): void {
            if (xOffset !== 0 || yOffset !== 0) {
                var m = createTranslateMatrix(xOffset, yOffset);
                this.matrix = mutliplyMatrices(this.matrix, m);
                this._inverse = null;
            }
        }

        public scale(xScale: number, yScale: number): void {
            if (xScale !== 1 || yScale !== 1) {
                var m = createScaleMatrix(xScale, yScale);
                this.matrix = mutliplyMatrices(this.matrix, m);
                this._inverse = null;
            }
        }

        public rotate(angleInRadians: number): void {
            if (angleInRadians !== 0) {
                var m = createRotationMatrix(angleInRadians);
                this.matrix = mutliplyMatrices(this.matrix, m);
                this._inverse = null;
            }
        }

        public add(other: Transform) {
            if (other) {
                this.matrix = mutliplyMatrices(this.matrix, other.matrix);
                this._inverse = null;
            }
        }

        public getInverse(): Transform {
            if (!this._inverse) {
                this._inverse = new Transform(createInverseMatrix(this.matrix));
            }
            return this._inverse;
        }
    }

    export function createTranslateMatrix(xOffset: number, yOffset: number): I2DTransformMatrix {
        return {
            m00: 1, m01: 0, m02: xOffset,
            m10: 0, m11: 1, m12: yOffset,
        };
    }

    export function createScaleMatrix(xScale: number, yScale: number): I2DTransformMatrix {
        return {
            m00: xScale, m01: 0, m02: 0,
            m10: 0, m11: yScale, m12: 0
        };
    }

    export function createRotationMatrix(angleInRads: number): I2DTransformMatrix {
        var a = angleInRads;
        var sinA = Math.sin(a);
        var cosA = Math.cos(a);
        return {
            m00: cosA, m01: -sinA, m02: 0,
            m10: sinA, m11: cosA, m12: 0,
        };
    }

    export function createInverseMatrix(m: I2DTransformMatrix): I2DTransformMatrix {
        var determinant = m.m00 * m.m11 - m.m01 * m.m10;
        var invdet = 1 / determinant;
        return {
            m00: m.m11 * invdet,
            m01: - m.m01 * invdet,
            m02: (m.m01 * m.m12 - m.m02 * m.m11) * invdet,

            m10: -m.m10 * invdet,
            m11: m.m00 * invdet,
            m12: - (m.m00 * m.m12 - m.m10 * m.m02) * invdet
        };
    }

    function mutliplyMatrices(a: I2DTransformMatrix, b: I2DTransformMatrix): I2DTransformMatrix {
        return {
            m00: a.m00 * b.m00 + a.m01 * b.m10,
            m01: a.m00 * b.m01 + a.m01 * b.m11,
            m02: a.m00 * b.m02 + a.m01 * b.m12 + a.m02,
            m10: a.m10 * b.m00 + a.m11 * b.m10,
            m11: a.m10 * b.m01 + a.m11 * b.m11,
            m12: a.m10 * b.m02 + a.m11 * b.m12 + a.m12,
        };
    }

    var defaultLevelOfDetail = 11;

    export class MapPolygonInfo {
        private _locationRect: Microsoft.Maps.LocationRect;
        private _baseRect: Rect;
        private _currentRect: Rect;

        constructor() {
            this._locationRect = new Microsoft.Maps.LocationRect(new Microsoft.Maps.Location(30, -30), 60, 60);
        }

        public reCalc(mapControl: Microsoft.Maps.Map, width: number, height: number) {
            var baseLocations = [this._locationRect.getNorthwest(), this._locationRect.getSoutheast()];
            var width = width / 2.00;
            var height = height / 2.00;

            if (!this._baseRect) {
                var l0 = powerbi.visuals.BI.Services.MapServices.locationToPixelXY(this._locationRect.getNorthwest(), defaultLevelOfDetail);
                var l1 = powerbi.visuals.BI.Services.MapServices.locationToPixelXY(this._locationRect.getSoutheast(), defaultLevelOfDetail);
                this._baseRect = new Rect(l0.x, l0.y, l1.x - l0.x, l1.y - l0.y);
            }

            var l = mapControl.tryLocationToPixel(baseLocations);
            this._currentRect = new Rect(l[0].x + width, l[0].y + height, l[1].x - l[0].x, l[1].y - l[0].y);
        }

        public get scale(): number {
            if (this._baseRect) {
                return this._currentRect.width / this._baseRect.width;
            }
            return 1.0;
        }

        public get transform(): Transform {
            var base = this._baseRect;
            var current = this._currentRect;
            var transform = new Transform();
            transform.translate(current.left, current.top);
            transform.scale((current.width / base.width), (current.height / base.height));
            transform.translate(-base.left, -base.top);
            return transform;
        }

        public get outherTransform() {
            var base = this._baseRect;
            var current = this._currentRect;
            var transform = new Transform();
            transform.translate(current.left, current.top);
            var scale = Math.sqrt(current.width / base.width);
            transform.scale(scale, scale);
            return transform;
        }

        public setViewBox(svg: SVGSVGElement) {
            var rect = svg.getBoundingClientRect();
            var current = this._currentRect;
            svg.setAttribute("viewBox", [-current.left, -current.top, rect.width, rect.height].join(" "));
        }

        public get innerTransform() {
            var base = this._baseRect;
            var current = this._currentRect;
            var transform = new Transform();
            var scale = current.width / base.width;
            transform.scale(scale, scale);
            transform.translate(-base.left, -base.top);
            return transform;
        }

        public transformToString(transform: Transform) {
            var m = transform.matrix;
            return "matrix(" + m.m00 + " " + m.m10 + " " + m.m01 + " " + m.m11 + " " + m.m02 + " " + m.m12 + ")";
        }
    }
}

module powerbi.visuals.BI.Services.GeocodingManager {
    'use strict';

    export var Settings = {
        // Maximum Bing requests at once. The Bing have limit how many request at once you can do per socket.
        MaxBingRequest: 6,

        // Maximum cache size of cached geocode data.
        MaxCacheSize: 3000,

        // Maximum cache overflow of cached geocode data to kick the cache reducing.
        MaxCacheSizeOverflow: 100,

        // Bing Keys and URL
        BingKey: "AidYBxBA7LCx2Uo3v-4QJE2zRVgvqg4KquhupR_dRRIGbmKd1A1CpWnjEJulgAUe",
        BingUrl: "https://dev.virtualearth.net/REST/v1/Locations?",
        BingUrlGeodata: "https://platform.bing.com/geo/spatial/v1/public/Geodata?",

        // Switch the data result for geodata polygons to by double array instead locations array
        UseDoubleArrayGeodataResult: true,
        UseDoubleArrayDequeueTimeout: 0,
    };

    export interface BingAjaxService {
        (url: string, settings: JQueryAjaxSettings): any;
    }
    export var safeCharacters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
    // Used for test mockup    
    export var BingAjaxCall: BingAjaxService = $.ajax;

    export var CategoryTypes = {
        Address: "Address",
        City: "City",
        Continent: "Continent",
        CountryRegion: "Country", // The text has to stay "Country" because it is used as a key in the geocoding caching dictionary
        County: "County",
        Longitude: "Longitude",
        Latitude: "Latitude",
        Place: "Place",
        PostalCode: "PostalCode",
        StateOrProvince: "StateOrProvince"
    };

    export var CategoryTypeArray = [
        "Address",
        "City",
        "Continent",
        "Country",
        "County",
        "Longitude",
        "Latitude",
        "Place",
        "PostalCode",
        "StateOrProvince"
    ];

    export function isCategoryType(value: string): boolean {
        return CategoryTypeArray.indexOf(value) > -1;
    }

    export var BingEntities = {
        Continent: "Continent",
        Sovereign: "Sovereign",
        CountryRegion: "CountryRegion",
        AdminDivision1: "AdminDivision1",
        AdminDivision2: "AdminDivision2",
        PopulatedPlace: "PopulatedPlace",
        Postcode: "Postcode",
        Postcode1: "Postcode1",
        Neighborhood: "Neighborhood",
        Address: "Address",
    };

    export interface ILocation {
        latitude: number;
        longitude: number;
    }

    export interface ILocationRect {
        northWest: ILocation;
        southEast: ILocation;
    }

    export interface GeocodeCallback {
        (error: Error, coordinate: IGeocodeCoordinate): void;
    }

    export interface IGeocodeQuery {
        query: string;
        category: string;
        levelOfDetail?: number;
        longitude?: number;
        latitude?: number;
    }

    export interface IGeocodeBoundaryPolygon {
        nativeBing: string;
        // array of lat/long pairs as [lat1, long1, lat2, long2,...]
        geographic?: Float64Array;
        geographicBounds?: Microsoft.Maps.LocationRect;

        // array of absolute pixel position pairs [x1,y1,x2,y2,...]. It can be used by the client for cache the data. 
        absolute?: Float64Array;
        absoluteBounds?: Rect;

        // string of absolute pixel position pairs "x1 y1 x2 y2...". It can be used by the client for cache the data.
        absoluteString?: string;
    }

    export interface IGeocodeCoordinate {
        latitude?: number;
        longitude?: number;
        locations?: IGeocodeBoundaryPolygon[]; // one location can have multiple boundary polygons
    }

    interface IGeocodeQueueItem {
        query: GeocodeQuery;
        deferred: any;
    }

    // Static variables for caching, maps, etc
    var geocodeQueue: IGeocodeQueueItem[];
    var activeRequests;
    var categoryToBingEntity: { [key: string]: string; };
    var categoryToBingEntityGeodata: { [key: string]: string; };
    var geocodingCache: IGeocodingCache;

    export class GeocodeQuery implements IGeocodeQuery {
        public query: string;
        public category: string;
        public key: string;
        private _cacheHits: number;

        constructor(query: string = "", category: string  = "") {
            this.query = query;
            this.category = category;
            this.key = (this.query + "/" + this.category).toLowerCase();
            this._cacheHits = 0;
            if (!geocodingCache) {
                geocodingCache = Services.createGeocodingCache(Settings.MaxCacheSize, Settings.MaxCacheSizeOverflow);
            }
        }

        public incrementCacheHit(): void {
            this._cacheHits++;
        }

        public getCacheHits(): number {
            return this._cacheHits;
        }

        public getBingEntity(): string {
            var category = this.category.toLowerCase();
            if (!categoryToBingEntity) {
                categoryToBingEntity = {};
                categoryToBingEntity[CategoryTypes.Continent.toLowerCase()] = BingEntities.Continent;
                categoryToBingEntity[CategoryTypes.CountryRegion.toLowerCase()] = BingEntities.Sovereign;
                categoryToBingEntity[CategoryTypes.StateOrProvince.toLowerCase()] = BingEntities.AdminDivision1;
                categoryToBingEntity[CategoryTypes.County.toLowerCase()] = BingEntities.AdminDivision2;
                categoryToBingEntity[CategoryTypes.City.toLowerCase()] = BingEntities.PopulatedPlace;
                categoryToBingEntity[CategoryTypes.PostalCode.toLowerCase()] = BingEntities.Postcode;
                categoryToBingEntity[CategoryTypes.Address.toLowerCase()] = BingEntities.Address;
            }
            return categoryToBingEntity[category] || "";
        }

        public getUrl(): string {
            var url = Settings.BingUrl + "key=" + Settings.BingKey;
            var entityType = this.getBingEntity();
            var queryAdded = false;
            if (entityType) {
                if (entityType === BingEntities.Postcode) {
                    url += "&includeEntityTypes=Postcode,Postcode1,Postcode2,Postcode3,Postcode4";
                }
                else if (this.query.indexOf(",") === -1 && (entityType === BingEntities.AdminDivision1 || entityType === BingEntities.AdminDivision2)) {
                    queryAdded = true;
                    url += "&adminDistrict=" + decodeURIComponent(this.query);
                }
                else {
                    url += "&includeEntityTypes=" + entityType;
                }
            }

            if (!queryAdded) {
                url += "&q=" + decodeURIComponent(this.query);
            }

            var cultureName = navigator.userLanguage || navigator["language"];
            if (cultureName) {
                url += "&c=" + cultureName;
            }

            url += "&maxRes=20";
            return url;
        }
    }

    export class GeocodeBoundaryQuery extends GeocodeQuery {
        public latitude: number;
        public longitude: number;
        public levelOfDetail: number;
        public maxGeoData: number;

        constructor(latitude: number, longitude: number, category, levelOfDetail, maxGeoData = 3) {
            super([latitude, longitude, levelOfDetail, maxGeoData].join(","), category);
            this.latitude = latitude;
            this.longitude = longitude;
            this.levelOfDetail = levelOfDetail;
            this.maxGeoData = maxGeoData;
        }

        public getBingEntity(): string {
            var category = this.category.toLowerCase();
            if (!categoryToBingEntityGeodata) {
                categoryToBingEntityGeodata = {};
                categoryToBingEntityGeodata[CategoryTypes.CountryRegion.toLowerCase()] = BingEntities.CountryRegion;
                categoryToBingEntityGeodata[CategoryTypes.StateOrProvince.toLowerCase()] = BingEntities.AdminDivision1;
                categoryToBingEntityGeodata[CategoryTypes.County.toLowerCase()] = BingEntities.AdminDivision2;
                categoryToBingEntityGeodata[CategoryTypes.City.toLowerCase()] = BingEntities.PopulatedPlace;
                categoryToBingEntityGeodata[CategoryTypes.PostalCode.toLowerCase()] = BingEntities.Postcode1;
            }
            return categoryToBingEntityGeodata[category] || "";
        }

        public getUrl(): string {
            var url = Settings.BingUrlGeodata + "key=" + Settings.BingKey + "&$format=json";
            var entityType = this.getBingEntity();
            if (!entityType) {
                return null;
            }

            var cultureName = navigator.userLanguage || navigator["language"];
            var cultures = cultureName.split("-");
            var data = [this.latitude, this.longitude, this.levelOfDetail, "'" + entityType + "'", 1, 0, "'" + cultureName + "'"];
            if (cultures.length > 1) {
                data.push("'" + cultures[1] + "'");
            }
            return url + "&SpatialFilter=GetBoundary(" + data.join(", ") + ")";
        }
    }

    export function geocodeCore(geocodeQuery: GeocodeQuery): any {
        var result = geocodingCache ? geocodingCache.getCoordinates(geocodeQuery) : undefined;
        var deferred = $.Deferred();

        if (result) {
            deferred.resolve(result);
        } else {
            geocodeQueue.push({ query: geocodeQuery, deferred: deferred });
            dequeue();
        }
        return deferred;
    }

    export function geocode(query: string, category: string = ""): any {
        return geocodeCore(new GeocodeQuery(query, category));
    }

    export function geocodeBoundary(latitude: number, longitude: number, category: string = "", levelOfDetail: number = 2, maxGeoData: number = 3): any {
        return geocodeCore(new GeocodeBoundaryQuery(latitude, longitude, category, levelOfDetail, maxGeoData));
    }

    function dequeue(decrement: number = 0) {
        activeRequests -= decrement;
        while (activeRequests < Settings.MaxBingRequest) {

            if (geocodeQueue.length === 0) {
                break;
            }

            activeRequests++;
			makeRequest(geocodeQueue.shift());
        }
    }

    function makeRequest(item: IGeocodeQueueItem) {

        // Check again if we already got the coordinate;
        var result = geocodingCache ? geocodingCache.getCoordinates(item.query) : undefined;
        if (result) {
            setTimeout(() => dequeue(1));
            item.deferred.resolve(result);
            return;
        }

        // Unfortunately the Bing service doesn't support CORS, only jsonp. This issue must be raised and revised.
        // VSTS: 1396088 - Tracking: Ask: Bing geocoding to support CORS
        var config: JQueryAjaxSettings = {
            type: "GET",
            dataType: "jsonp",
            jsonp: "jsonp"
        };

        var url = item.query.getUrl();
        if (!url) {
            completeRequest(item, new Error("Unsupported query."));
        }

        BingAjaxCall(url, config).then(
            (data) => {
                try {
                    if (item.query instanceof GeocodeBoundaryQuery) {
                        var result = data;
                        if (result && result.d && Array.isArray(result.d.results) && result.d.results.length > 0) {
                            var entity = result.d.results[0];
                            var primitives = entity.Primitives;
                            if (primitives && primitives.length > 0) {
                                var coordinates: IGeocodeCoordinate = {
                                    latitude: (<GeocodeBoundaryQuery>item.query).latitude,
                                    longitude: (<GeocodeBoundaryQuery>item.query).longitude,
                                    locations: []
                                };

                                primitives.sort((a, b) => {
                                    if (a.Shape.length < b.Shape.length) {
                                        return 1;
                                    }
                                    if (a.Shape.length > b.Shape.length) {
                                        return -1;
                                    }
                                    return 0;
                                });

                                var maxGeoData = Math.min(primitives.length, (<GeocodeBoundaryQuery>item.query).maxGeoData);

                                for (var i = 0; i < maxGeoData; i++) {
                                    var ringStr = primitives[i].Shape;
                                    var ringArray = ringStr.split(",");

                                    for (var j = 1; j < ringArray.length; j++) {
                                        coordinates.locations.push({ nativeBing: ringArray[j] });
                                    }
                                }

                                completeRequest(item, null, coordinates);
                            }
                            else {
                                completeRequest(item, new Error("Geocode result is empty."));
                            }
                        }
                        else {
                            completeRequest(item, new Error("Geocode result is empty."));
                        }
                    }
                    else {
                        var resources = data.resourceSets[0].resources;
                        if (Array.isArray(resources) && resources.length > 0) {
                            var index = getBestResultIndex(resources, item.query);
                            var pointData = resources[index].point.coordinates;
                            var coordinates: IGeocodeCoordinate = {
                                latitude: parseFloat(pointData[0]),
                                longitude: parseFloat(pointData[1])
                            };
                            completeRequest(item, null, coordinates);
                        }
                        else {
                            completeRequest(item, new Error("Geocode result is empty."));
                        }
                    }
                }
                catch (error) {
                    completeRequest(item, error);
                }
            },
            (error) => {
                completeRequest(item, error);
            });
    }

    var dequeueTimeoutId;

    function completeRequest(item: IGeocodeQueueItem, error: Error, coordinate: IGeocodeCoordinate = null) {
        dequeueTimeoutId = setTimeout(() => dequeue(1), Settings.UseDoubleArrayGeodataResult ? Settings.UseDoubleArrayDequeueTimeout : 0);

        if (error) {
            item.deferred.reject(error);
        }
        else {
            if (geocodingCache)
                geocodingCache.registerCoordinates(item.query, coordinate);
            item.deferred.resolve(coordinate);
        }
    }

    function getBestResultIndex(resources: any[], query: GeocodeQuery) {
        var targetEntity = query.getBingEntity().toLowerCase();
        for (var index = 0; index < resources.length; index++) {
            var resultEntity = (resources[index].entityType || "").toLowerCase();
            if (resultEntity === targetEntity) {
                return index;
            }
        }
        return 0;
    }

    export function reset(): void {
        geocodeQueue = [];
        activeRequests = 0;
        categoryToBingEntity = null;
        clearTimeout(dequeueTimeoutId);
    }

    reset();
}

module powerbi.visuals.BI.Services.MapServices {
    'use strict';

    // Bing map min/max boundaries
    export var MinAllowedLatitude = -85.05112878;
    export var MaxAllowedLatitude = 85.05112878;
    export var MinAllowedLongitude = -180;
    export var MaxAllowedLongitude = 180;
    export var TileSize = 256;
    export var MaxLevelOfDetail = 23;
    export var MinLevelOfDetail = 1;
    export var MaxAutoZoomLevel = 5;
    export var DefaultLevelOfDetail = 11;
    export var WorkerErrorName = "___error___";

    var safeCharacters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

    export function clip(n: number, minValue: number, maxValue: number): number {
        return Math.min(Math.max(n, minValue), maxValue);
    }

    export function getMapSize(levelOfDetail: number): number {
        if (levelOfDetail === 23)
            return 2147483648;  //256 << 23 overflow the integer and return a negative value

        if (Math.floor(levelOfDetail) === levelOfDetail)
            return 256 << levelOfDetail;

        return 256 * Math.pow(2, levelOfDetail);
    }

    // latLongArray is a Float64Array as [lt0, lon0, lat1, long1, lat2, long2,....]
    // the output is a Float64Array as [x0, y0, x1, y1, x2, y2,....]
    export function latLongToPixelXYArray(latLongArray: Float64Array, levelOfDetail: number): Float64Array {
        var result = new Float64Array(latLongArray.length);
        for (var i = 0; i < latLongArray.length; i += 2) {
            var latitude = clip(latLongArray[i], MinAllowedLatitude, MaxAllowedLatitude);
            var longitude = clip(latLongArray[i + 1], MinAllowedLongitude, MaxAllowedLongitude);

            var x: number = (longitude + 180) / 360;
            var sinLatitude: number = Math.sin(latitude * Math.PI / 180);
            var y: number = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);

            var mapSize: number = getMapSize(levelOfDetail);
            result[i] = clip(x * mapSize + 0.5, 0.0, mapSize - 1);
            result[i + 1] = clip(y * mapSize + 0.5, 0.0, mapSize - 1);
        }
        return result;
    }

    export function pointArrayToString(array: Float64Array) {
        var maxLength = 80000;
        if (array.length > maxLength) {
            var result: string = "";
            for (var i = 0; i < array.length; i += maxLength) {
                var array1 = Array.apply([], array.subarray(i, i + maxLength));
                result += array1.join(" ") + " ";
            }
            return result;
        }
        return Array.apply([], array).join(" ");
    }

    export function pointArrayToArray(array: Float64Array): number[] {
        var maxLength = 80000;
        var result: number[] = [];
        if (array.length > maxLength) {
            for (var i = 0; i < array.length; i += maxLength) {
                var array1 = Array.apply([], array.subarray(i, i + maxLength));
                result.concat(array1);
            }
            return result;
        }
        return Array.apply([], array);
    }

    export function getLocationBoundaries(latLongArray: Float64Array): Microsoft.Maps.LocationRect {
        var northWest = {
            latitude: -90, longitude: 180
        };
        var southEast = {
            latitude: 90, longitude: -180
        };

        for (var i = 0; i < latLongArray.length; i += 2) {
            northWest.latitude = Math.max(latLongArray[i], northWest.latitude);
            northWest.longitude = Math.min(latLongArray[i + 1], northWest.longitude);
            southEast.latitude = Math.min(latLongArray[i], southEast.latitude);
            southEast.longitude = Math.max(latLongArray[i + 1], southEast.longitude);
        }

        northWest.longitude = clip(northWest.longitude, -180, 180);
        southEast.longitude = clip(southEast.longitude, -180, 180);

        return Microsoft.Maps.LocationRect.fromCorners(
            new Microsoft.Maps.Location(northWest.latitude, northWest.longitude),
            new Microsoft.Maps.Location(southEast.latitude, southEast.longitude));
    }

    // this code is taken from Bing.
    // see Point Compression Algorithm http://msdn.microsoft.com/en-us/library/jj158958.aspx
    // see Decompression Algorithm in http://msdn.microsoft.com/en-us/library/dn306801.aspx
    export function parseEncodedSpatialValueArray(value): Float64Array {
        var list: number[] = [];
        var index = 0;
        var xsum = 0;
        var ysum = 0;
        var max = 4294967296;

        while (index < value.length) {
            var n = 0;
            var k = 0;

            while (1) {

                if (index >= value.length) {
                    return null;
                }

                var b = safeCharacters.indexOf(value.charAt(index++));
                if (b === -1) {
                    return null;
                }

                var tmp = ((b & 31) * (Math.pow(2, k)));

                var ht = tmp / max;
                var lt = tmp % max;

                var hn = n / max;
                var ln = n % max;

                var nl = (lt | ln) >>> 0;
                n = (ht | hn) * max + nl;
                k += 5;
                if (b < 32) break;
            }

            var diagonal = Math.floor((Math.sqrt(8 * n + 5) - 1) / 2);
            n -= diagonal * (diagonal + 1) / 2;
            var ny = Math.floor(n);
            var nx = diagonal - ny;
            nx = (nx >> 1) ^ -(nx & 1);
            ny = (ny >> 1) ^ -(ny & 1);
            xsum += nx;
            ysum += ny;
            var lat = ysum * 0.00001;
            var lon = xsum * 0.00001;

            list.push(lat);
            list.push(lon);
        }
        return new Float64Array(list);
    }

    export function calcGeoData(data: powerbi.visuals.BI.Services.GeocodingManager.IGeocodeCoordinate) {
        var locations = data.locations;

        for (var i = 0; i < locations.length; i++) {
            var location = locations[i];
            if (!location.geographic) {
                location.geographic = MapServices.parseEncodedSpatialValueArray(location.nativeBing);
            }
            var polygon = location.geographic;
            if (polygon) {
                if (!location.absolute) {
                    location.absolute = MapServices.latLongToPixelXYArray(polygon, MapServices.DefaultLevelOfDetail);
                    location.absoluteString = MapServices.pointArrayToString(location.absolute);
                    location.geographicBounds = MapServices.getLocationBoundaries(polygon);
                    location.absoluteBounds = MapServices.locationRectToRectXY(location.geographicBounds, MapServices.DefaultLevelOfDetail);
                }
            }
        }
    }

    export function latLongToPixelXY(latitude: number, longitude: number, levelOfDetail: number): powerbi.visuals.Point {
        var array = latLongToPixelXYArray(new Float64Array([latitude, longitude]), levelOfDetail);
        return new powerbi.visuals.Point(array[0], array[1]);
    }

    export function locationToPixelXY(location: Microsoft.Maps.Location, levelOfDetail: number): powerbi.visuals.Point {
        return latLongToPixelXY(location.latitude, location.longitude, levelOfDetail);
    }

    export function locationRectToRectXY(locationRect: Microsoft.Maps.LocationRect, levelOfDetail: number): powerbi.visuals.Rect {
        var topleft = locationToPixelXY(locationRect.getNorthwest(), levelOfDetail);
        var bottomRight = locationToPixelXY(locationRect.getSoutheast(), levelOfDetail);
        return new powerbi.visuals.Rect(topleft.x, topleft.y, bottomRight.x - topleft.x, bottomRight.y - topleft.y);
    }

    export function pixelXYToLocation(pixelX: number, pixelY: number, levelOfDetail: number): Microsoft.Maps.Location {
        var mapSize = getMapSize(levelOfDetail);
        var x = (clip(pixelX, 0, mapSize - 1) / mapSize) - 0.5;
        var y = 0.5 - (clip(pixelY, 0, mapSize - 1) / mapSize);
        var latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
        var longitude = 360 * x;
        return new Microsoft.Maps.Location(latitude, longitude);
    }
}