/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved. 
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *   
 *  The above copyright notice and this permission notice shall be included in 
 *  all copies or substantial portions of the Software.
 *   
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.visuals {
    "use strict";

    export module shapes {
        import Utility = jsCommon.Utility;

        export interface IPoint {
            x: number;
            y: number;
        }

        export module Point {

            export function offset(point: IPoint, offsetX: number, offsetY: number): IPoint {
                var newPointX = ((point.x + offsetX) >=0) ? (point.x + offsetX) : 0;
                var newPointY = ((point.y + offsetY) >=0) ? (point.y + offsetY) : 0;
                return { x: newPointX, y: newPointY };
            }

            export function equals(point: IPoint, other: IPoint): boolean {
                return point !== undefined && point !== null && other !== undefined && other !== null && point.x === other.x && point.y === other.y;
            }

            export function clone(point: IPoint): IPoint {
                return (point!==null)? { x: point.x, y: point.y }:null;
            }

            export function toString(point: IPoint): string {
                return "{x:" + point.x + ", y:" + point.y + "}";
            }

            export function serialize(point: IPoint): string {
                return point.x + "," + point.y;
            }

            export function getDistance(point: IPoint, other: IPoint): number {
                if ((point === null) || (other) === null) {
                    return null;
                }
                var diffX = other.x - point.x;
                var diffY = other.y - point.y;
                return Math.sqrt(diffX * diffX + diffY * diffY);
            }

            export function equalWithPrecision(point1: IPoint, point2: IPoint): boolean {
                return point1 === point2 ||
                    (point1 !== undefined && point2 !== undefined && Double.equalWithPrecision(point1.x, point2.x) && Double.equalWithPrecision(point1.y, point2.y));
            }

            export function parsePoint(value: any, defaultValue?: IPoint): IPoint {
                if (value === null) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else if (value === undefined) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else {
                      if (value.length === 2) {
                        return { x: Utility.parseNumber(value[0]), y: Utility.parseNumber(value[1]) };
                      } else if (typeof value === "string") {
                          var parts = (<string>value).split(",");
                          if (parts.length !== 2) {
                              return (defaultValue === undefined) ? null : defaultValue;
                          }
                          return { x: Utility.parseNumber(parts[0]), y: Utility.parseNumber(parts[1]) };
                      } else if ((value.length !== 2) && (typeof value !== "string")){
                          return (defaultValue === undefined) ? null : defaultValue;
                      }
                        else {
                        return { x: Utility.parseNumber(value.x), y: Utility.parseNumber(value.y) };
                    }
                }
            }
        }

        export interface ISize {
            width: number;
            height: number;
        }

        export module Size {

            export function isEmpty(size: ISize): boolean {
                return size.width === 0 && size.height === 0;
            }

            export function equals(size: ISize, other: ISize): boolean {
                return size !== undefined && size !== null && other !== undefined && other !== null && size.width === other.width && size.height === other.height;
            }

            export function clone(size: ISize): ISize {
                return (size!==null)? { width: size.width, height: size.height }:null;
            }

            export function inflate(size: ISize, padding: IThickness): ISize {
                var result = clone(size);
                if (padding) {
                    result.width += padding.left + padding.right;
                    result.height += padding.top + padding.bottom;
                }
                return result;
            }

            export function deflate(size: ISize, padding: IThickness): ISize {
                var result = clone(size);
                if (padding) {
                    result.width = result.width - padding.left - padding.right;
                    if (result.width < 0) {
                        result.width = 0;
                    }
                    result.height = result.height - padding.top - padding.bottom;
                    if (result.height < 0) {
                        result.height = 0;
                    }
                }
                return result;
            }

            export function combine(size: ISize, other: ISize): ISize {
                if (other) {
                    size.width = Math.max(size.width, other.width);
                    size.height = Math.max(size.height, other.height);
                }
                return size;
            }

            export function toRect(size: ISize): IRect {
                return { left: 0, top: 0, width: size.width, height: size.height };
            }

            export function toString(size: ISize): string {
                return "{width:" + size.width + ", height:" + size.height + "}";
            }

            export function equal(size1: ISize, size2: ISize): boolean {
                return size1 === size2 ||
                    (size1 !== undefined && size2 !== undefined && size1.width === size2.width && size1.height === size2.height);
            }

            export function equalWithPrecision(size1: ISize, size2: ISize): boolean {
                return size1 === size2 ||
                    (size1 !== undefined && size2 !== undefined && Double.equalWithPrecision(size1.width, size2.width) && Double.equalWithPrecision(size1.height, size2.height));
            }

            export function parseSize(value: any, defaultValue?: ISize): ISize {
                if (value === null) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else if (value === undefined) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else {
                    if (value.length === 2) {
                        return { width: Utility.parseNumber(value[0]), height: Utility.parseNumber(value[1]) };
                    } else if (typeof value === "string") {
                        var parts = (<string>value).split(",");
                        if (parts.length !== 2) {
                            return (defaultValue === undefined) ? null : defaultValue;
                        }
                        return { width: Utility.parseNumber(parts[0]), height: Utility.parseNumber(parts[1]) };
                    }
                      else if ((value.length !== 2) && (typeof value !== "string")) {
                            return (defaultValue === undefined) ? null : defaultValue;
                    } else {
                        return { width: Utility.parseNumber(value.width), height: Utility.parseNumber(value.height) };
                    }
                }
            }
        }

        export interface IRect {
            left: number;
            top: number;
            width: number;
            height: number;
        }

        export module Rect {

            export function getOffset(rect: IRect): IPoint {
                return { x: rect.left, y: rect.top };
            }

            export function getSize(rect: IRect): ISize {
                return { width: rect.width, height: rect.height };
            }

            export function setSize(rect: IRect,value: ISize): void {
                rect.width = value.width;
                rect.height = value.height;
            }

            export function right(rect: IRect): number {
                return rect.left + rect.width;
            }

            export function bottom(rect: IRect): number {
                return rect.top + rect.height;
            }

            export function topLeft(rect: IRect): IPoint {
                return {x:rect.left,y: rect.top};
            }

            export function topRight(rect: IRect): IPoint {
                return {x:rect.left + rect.width,y: rect.top};
            }

            export function bottomLeft(rect: IRect): IPoint {
                return {x:rect.left,y: rect.top + rect.height};
            }

            export function bottomRight(rect: IRect): IPoint {
                return {x:rect.left + rect.width,y: rect.top + rect.height};
            }

            export function equals(rect: IRect,other: IRect): boolean {
                return other !== undefined && other !== null &&
                    rect.left === other.left && rect.top === other.top && rect.width === other.width && rect.height === other.height;
            }

            export function clone(rect: IRect): IRect {
                return (rect!==null)? {left:rect.left,top: rect.top,width: rect.width,height: rect.height}:null;
            }

            export function toString(rect: IRect): string {
                return "{left:" + rect.left + ", top:" + rect.top + ", width:" + rect.width + ", height:" + rect.height + "}";
            }

            export function offset(rect: IRect, offsetX: number, offsetY: number): IRect {
                var newLeft = ((rect.left + offsetX) >= 0) ? rect.left + offsetX : 0;
                var newTop = ((rect.top + offsetY) >= 0) ? rect.top + offsetY : 0;

                return { left: newLeft, top: newTop,width: rect.width,height: rect.height};
            }

            export function inflate(rect: IRect, padding: IThickness): IRect {
                var result = clone(rect);
                if (padding) {
                    result.left -= padding.left;
                    result.top -= padding.top;
                    result.width += padding.left + padding.right;
                    result.height += padding.top + padding.bottom;
                }
                return result;
            }

            export function deflate(rect: IRect, padding: IThickness): IRect {
                var result = clone(rect);
                if (padding) {
                    result.left += padding.left;
                    result.top += padding.top;
                    result.width -= padding.left + padding.right;
                    result.height -= padding.top + padding.bottom;
                }
                return result;
            }

            export function inflateBy(rect: IRect,padding: number): IRect {
                return {left:rect.left - padding, top: rect.top - padding,width: rect.width + padding + padding, height: rect.height + padding + padding};
            }

            export function deflateBy(rect: IRect,padding: number): IRect {
                return {left: rect.left + padding,top: rect.top + padding, width:rect.width - padding - padding, height:rect.height - padding - padding};
            }

            // @return the closest point on the rect to the (x,y) point given.
            // in case the (x,y) given is inside the rect, (x,y) will be returned. otherwise, a point on a border will be returned.
            export function getClosestPoint(rect: IRect, x: number, y: number): IPoint {
                return {
                    x: Math.min(Math.max(rect.left, x), rect.left + rect.width),
                    y: Math.min(Math.max(rect.top, y), rect.top + rect.height)
                };
            }

            export function equal(rect1: IRect, rect2: IRect): boolean {
                return rect1 === rect2 ||
                    (rect1 !== undefined && rect2 !== undefined && rect1.left === rect2.left && rect1.top === rect2.top && rect1.width === rect2.width && rect1.height === rect2.height);
            }

            export function equalWithPrecision(rect1: IRect, rect2: IRect): boolean {
                return rect1 === rect2 ||
                    (rect1 !== undefined && rect2 !== undefined &&
                    Double.equalWithPrecision(rect1.left, rect2.left) && Double.equalWithPrecision(rect1.top, rect2.top) &&
                    Double.equalWithPrecision(rect1.width, rect2.width) && Double.equalWithPrecision(rect1.height, rect2.height));
            }

            export function isEmpty(rect: IRect): boolean {
                return rect === undefined || rect === null || (rect.width === 0 && rect.height === 0);
            }

            export function containsPoint(rect: IRect, point: IPoint): boolean {
                if ((rect === null) || (point === null)) {
                    return false;
                }
                return rect.left <= point.x && point.x <= rect.left + rect.width && rect.top <= point.y && point.y <= rect.top + rect.height;
            }

            export function isIntersecting(rect1: IRect, rect2: IRect): boolean {
                if (!rect1 || !rect2) {
                    return false;
                }
                var left = Math.max(rect1.left, rect2.left);
                var right = Math.min(rect1.left + rect1.width, rect2.left + rect2.width);
                if (left > right) {
                    return false;
                }
                var top = Math.max(rect1.top, rect2.top);
                var bottom = Math.min(rect1.top + rect1.height, rect2.top + rect2.height);
                return top <= bottom;
            }

            export function intersect(rect1: IRect, rect2: IRect): IRect {
                if (!rect1) {
                    return rect2;
                }
                if (!rect2) {
                    return rect1;
                }
                var left = Math.max(rect1.left, rect2.left);
                var top = Math.max(rect1.top, rect2.top);
                var right = Math.min(rect1.left + rect1.width, rect2.left + rect2.width);
                var bottom = Math.min(rect1.top + rect1.height, rect2.top + rect2.height);
                if (left <= right && top <= bottom) {
                    return { left: left, top: top, width: right - left, height: bottom - top };
                } else {
                    return { left: 0, top: 0, width: 0, height: 0 };
                }
            }

            export function combine(rect1: IRect, rect2: IRect): IRect {
                if (!rect1) {
                    return rect2;
                }
                if (!rect2) {
                    return rect1;
                }
                var left = Math.min(rect1.left, rect2.left);
                var top = Math.min(rect1.top, rect2.top);
                var right = Math.max(rect1.left + rect1.width, rect2.left + rect2.width);
                var bottom = Math.max(rect1.top + rect1.height, rect2.top + rect2.height);

                return { left: left, top: top, width: right - left, height: bottom - top };
            }

            export function parseRect(value: any, defaultValue?: IRect): IRect {
                if (value === null) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else if (value === undefined) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else {
                    if (value.length === 4) {
                        return {left:Utility.parseNumber(value[0]), top: Utility.parseNumber(value[1]), width:Utility.parseNumber(value[2]), height:Utility.parseNumber(value[3])};
                    } else if (typeof value === "string") {
                        var parts = (<string>value).split(",");
                        if (parts.length !== 4) {
                            return (defaultValue === undefined) ? null : defaultValue;
                        }
                        return {
                            left: Utility.parseNumber(parts[0]), top: Utility.parseNumber(parts[1]), width:Utility.parseNumber(parts[2]), height:Utility.parseNumber(parts[3])};
                    }
                    else if ((value.length !== 4) && (typeof value !== "string")) {
                        return (defaultValue === undefined) ? null : defaultValue;
                    }
                    else{ 
                        return {left:Utility.parseNumber(value.left), top:Utility.parseNumber(value.top), width:Utility.parseNumber(value.width), height:Utility.parseNumber(value.height)};
                    }
                }
            }
        }
        
        export interface IThickness {
            top: number;
            left: number;
            right: number;
            bottom: number;
        }

        export module Thickness {

            export function inflate(thickness: IThickness,other: IThickness): IThickness {
                var result = clone(thickness);
                if (other) {
                    result.left = thickness.left + other.left;
                    result.right = thickness.right + other.right;
                    result.bottom = thickness.bottom + other.bottom;
                    result.top = thickness.top + other.top;
                }
                return result;
            }

            export function getWidth(thickness: IThickness): number {
                return thickness.left + thickness.right;
            }

            export function getHeight(thickness: IThickness): number {
                return thickness.top + thickness.bottom;
            }

            export function clone(thickness: IThickness): IThickness {
                return (thickness!==null)? {left:thickness.left, top:thickness.top, right:thickness.right, bottom:thickness.bottom}:null;
            }

            export function equals(thickness: IThickness, other: IThickness): boolean {
                return thickness !== undefined && thickness !== null && other !== undefined && other !== null && thickness.left === other.left && thickness.bottom === other.bottom && thickness.right === other.right && thickness.top === other.top;
            }

            export function flipHorizontal(thickness: IThickness): void {
                var temp = thickness.right;
                thickness.right = thickness.left;
                thickness.left = temp;
            }

            export function flipVertical(thickness: IThickness): void {
                var top = thickness.top;
                thickness.top = thickness.bottom;
                thickness.bottom = top;
            }

            export function toString(thickness: IThickness): string {
                return "{top:" + thickness.top + ", left:" + thickness.left + ", right:" + thickness.right + ", bottom:" + thickness.bottom + "}";
            }

            export function toCssString(thickness: IThickness): string {
                return thickness.top + "px " + thickness.right + "px " + thickness.bottom + "px " + thickness.left + "px";
            }

            export function isEmpty(thickness: IThickness): boolean {
                return thickness.left === 0 && thickness.top === 0 && thickness.right === 0 && thickness.bottom === 0;
            }

            export function equal(thickness1: IThickness, thickness2: IThickness): boolean {
                return thickness1 === thickness2 ||
                    (thickness1 !== undefined && thickness2 !== undefined && thickness1.left === thickness2.left && thickness1.top === thickness2.top && thickness1.right === thickness2.right && thickness1.bottom === thickness2.bottom);
            }

            export function equalWithPrecision(thickness1: IThickness, thickness2: IThickness): boolean {
                return thickness1 === thickness2 ||
                    (thickness1 !== undefined && thickness2 !== undefined &&
                    Double.equalWithPrecision(thickness1.left, thickness2.left) && Double.equalWithPrecision(thickness1.top, thickness2.top) &&
                    Double.equalWithPrecision(thickness1.right, thickness2.right) && Double.equalWithPrecision(thickness1.bottom, thickness2.bottom));
            }

            export function parseThickness(value: any, defaultValue?: IThickness, resetValue?: any): IThickness {
                if (value === null) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else if (value === undefined) {
                    return (defaultValue === undefined) ? null : defaultValue;
                } else {
                    if (value.length === 4) {
                        return { left: Utility.parseNumber(value[0]), top: Utility.parseNumber(value[1]), right: Utility.parseNumber(value[2]), bottom: Utility.parseNumber(value[3]) };
                    } else if (typeof value === "string") {
                        var parts = (<string>value).split(",");
                        if (parts.length !== 4) {
                            return (defaultValue === undefined) ? null : defaultValue;
                        }
                        return { left: Utility.parseNumber(parts[0]), top: Utility.parseNumber(parts[1]), right: Utility.parseNumber(parts[2]), bottom: Utility.parseNumber(parts[3]) };
                    } else if ((value.length !== 4) && (typeof value !== "string")) {
                        return (defaultValue === undefined) ? null : defaultValue;
                    }
                    else {
                        return { left: Utility.parseNumber(value.left), top: Utility.parseNumber(value.top), right: Utility.parseNumber(value.right), bottom: Utility.parseNumber(value.bottom) };
                    }
                }
            }
        }

        export interface IVector {
            x: number;
            y: number;
        }

        export module Vector {

            export function isEmpty(vector: IVector): boolean {
                return vector.x === 0 && vector.y === 0;
            }

            export function equals(vector: IVector, other: IPoint): boolean {
                return vector !== undefined && vector !== null && other !== undefined && other !== null && vector.x === other.x && vector.y === other.y;
            }

            export function clone(vector: IVector): IVector {
                return (vector!==null)? {x:vector.x, y:vector.y}:null;
            }

            export function toString(vector: IVector): string {
                return "{x:" + vector.x + ", y:" + vector.y + "}";
            }

            export function getLength(vector: IVector): number {
                return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            }

            export function getLengthSqr(vector: IVector): number {
                return vector.x * vector.x + vector.y * vector.y;
            }

            export function scale(vector: IVector, scalar: number): IVector {
                return {x:vector.x * scalar, y: vector.y * scalar};
            }

            export function normalize(vector: IVector): IVector {
                return !isEmpty(vector)? scale(vector, 1 / getLength(vector)) : vector;
            }

            export function rotate90DegCW(vector: IVector): IVector {
                return {x:vector.y, y: -vector.x};
            }

            export function rotate90DegCCW(vector: IVector): IVector {
                return { x: -vector.y, y: vector.x };
            }

            export function rotate(vector: IVector, angle: number): IVector {
                var newX = vector.x * Math.cos(angle) - vector.y * Math.sin(angle);
                var newY = vector.x * Math.sin(angle) + vector.y * Math.cos(angle);
                return {x:newX, y:newY};
            }

            export function  equal(vector1: IVector, vector2: IVector): boolean {
                return vector1 === vector2 ||
                    (vector1 !== undefined && vector2 !== undefined && vector1.x === vector2.x && vector1.y === vector2.y);
            }

            export function equalWithPrecision(vector1: IVector, vector2: IVector): boolean {
                return vector1 === vector2 ||
                    (vector1 !== undefined && vector2 !== undefined && Double.equalWithPrecision(vector1.x, vector2.x) && Double.equalWithPrecision(vector1.y, vector2.y));
            }

            export function add(vect1: IVector, vect2: IVector): IVector {
                if (!vect1 || !vect2) {
                    return undefined;
                }
                return {x:vect1.x + vect2.x, y:vect1.y + vect2.y};
            }

            export function  subtract(vect1: IVector, vect2: IVector): IVector {
                if (!vect1 || !vect2) {
                    return undefined;
                }
                return {x:vect1.x - vect2.x, y:vect1.y - vect2.y};
            }

            export function  dotProduct(vect1: IVector, vect2: IVector): number {
                if (!vect1 || !vect2) {
                    return undefined;
                }
                return vect1.x * vect2.x + vect1.y * vect2.y;
            }

            export function  getDeltaVector(p0: IPoint, p1: IPoint): IVector {
                if (!p0 || !p1) {
                    return undefined;
                }
                return {x:p1.x - p0.x, y:p1.y - p0.y};
            }
        }

    }
}