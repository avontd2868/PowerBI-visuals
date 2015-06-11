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

module powerbitests {
    import Shapes = powerbi.visuals.shapes;
    import Point = powerbi.visuals.shapes.Point;
    import Size = powerbi.visuals.shapes.Size;
    import Rect = powerbi.visuals.shapes.Rect;
    import Thickness = powerbi.visuals.shapes.Thickness;
    import Vector = powerbi.visuals.shapes.Vector;

    describe("Point tests",() => {

        var pointA;

        it("offset with positive value",() => {
            var pointA: Shapes.IPoint = { x: 10, y: 10 };
            var offset = Point.offset(pointA,20, 25);
            expect(offset.x).toBe(30);
            expect(offset.y).toBe(35);
        });

        it("offset with negative value",() => {
            var pointA: Shapes.IPoint = { x: 100, y: 100 };
            var offset = Point.offset(pointA,-20, -25);
            expect(offset.x).toBe(80);
            expect(offset.y).toBe(75);
        });

        it("Check equals - return true",() => {
            var pointA: Shapes.IPoint = { x: 100, y: 100 };
            var pointB: Shapes.IPoint = { x: 100, y: 100 };
            var offset = Point.equals(pointA,pointB);
            expect(offset).toBe(true);
        });

        it("Check equals - return false",() => {
            var pointA: Shapes.IPoint = { x: 100, y: 100 };
            var pointB: Shapes.IPoint = { x: 50, y: 100 };
            var offset = Point.equals(pointA,pointB);
            expect(offset).toBe(false);
        });

        it("Check clone",() => {
            var point: Shapes.IPoint = { x: 100, y: 100 };
            var clonePoint = Point.clone(point);
            expect(clonePoint.x).toBe(point.x);
            expect(clonePoint.y).toBe(point.y);
        });

        it("Point - To String",() => {
            var point: Shapes.IPoint = { x: 100, y: 100 };
            var pointToString = Point.toString(point);
            expect(pointToString).toBe("{x:100, y:100}");
        });

        it("Check Serialize",() => {
            var point: Shapes.IPoint = { x: 200, y: 200 };
            var pointSerialize = Point.serialize(point);
            expect(pointSerialize).toBe("200,200");
        });

        it("Check Distance ",() => {
            var pointA: Shapes.IPoint = { x: 200, y: 200 };
            var pointB: Shapes.IPoint = { x: 250, y: 300 };
            var distance = Point.getDistance(pointA,pointB);
            var calculatedDistance = Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + (Math.pow(pointB.y - pointA.y, 2)));
            expect(distance).toBe(calculatedDistance);
        });

        it("Check Distance (null values)",() => {
            pointA = null;
            var pointB: Shapes.IPoint = { x: 150, y: 200 };
            var distance = Point.getDistance(pointA,pointB);
            expect(distance).toBe(null);
        });

        it("Check zero Distance ",() => {
            var pointA: Shapes.IPoint = { x: 200, y: 200 };
            var pointB: Shapes.IPoint = { x: 200, y: 200 };
            var distance = Point.getDistance(pointA, pointB);
            expect(distance).toBe(0);
        });

        it("Equals (static) - return true ",() => {
            var pointA: Shapes.IPoint = { x: 200, y: 200 };
            var pointB: Shapes.IPoint = { x: 200, y: 200 };
            var arePointsEqual = Point.equals(pointA, pointB);
            expect(arePointsEqual).toBe(true);
        });

        it("Equals (static) - point A is null ",() => {
            var pointB: Shapes.IPoint = { x: 200, y: 200 };
            var arePointsEqual = Point.equals(null, pointB);
            expect(arePointsEqual).toBe(false);
        });

        it("Equals (static) - point B is null ",() => {
            var pointA: Shapes.IPoint = { x: 200, y: 200 };
            var arePointsEqual = Point.equals(pointA, null);
            expect(arePointsEqual).toBe(false);
        });

        it("Equals (static) - points are null ",() => {
            var arePointsEqual = Point.equals(null, null);
            expect(arePointsEqual).toBe(false);
        });

        it("Equals with Precision - return true ",() => {
            var pointA: Shapes.IPoint = { x: 200.23, y: 200.32 };
            var pointB: Shapes.IPoint = { x: 200.23, y: 200.32 };
            var arePointsEqual = Shapes.Point.equalWithPrecision(pointA, pointB);
            expect(arePointsEqual).toBe(true);
        });

        it("Parse Point (from string no default value)",() => {
            var pointStr = "200,215";
            var pointA = Point.parsePoint(pointStr);
            expect(pointA.x).toBe(200);
            expect(pointA.y).toBe(215);
        });

        it("Parse Point (from string,2 points)",() => {
            var pointStr = "190,220";
            var pointA = Point.parsePoint(pointStr);
            expect(pointA.x).toBe(190);
            expect(pointA.y).toBe(220);
        });

        it("Parse Point (from string,2 points (default value ignored)",() => {
            var pointStr = "190,220";
            var defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            var pointA = Point.parsePoint(pointStr, defaultValue);
            expect(pointA.x).toBe(190);
            expect(pointA.y).toBe(220);
        });

        it("Parse Point (from empty string)",() => {
            var pointStr = "";
            var pointA = Point.parsePoint(pointStr);
            expect(pointA).toBe(null);
        });

        it("Parse Point - from empty string (default value taken)",() => {
            var pointStr = "";
            var defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            var pointA = Point.parsePoint(pointStr, defaultValue);
            expect(pointA.x).toBe(defaultValue.x);
            expect(pointA.y).toBe(defaultValue.y);
        });

        it("Parse Point (from int array)",() => {
            var intArray = [190, 220];
            var pointA = Point.parsePoint(intArray);
            expect(pointA.x).toBe(190);
            expect(pointA.y).toBe(220);
        });

        it("Parse Point - from int array (default value ignored)",() => {
            var intArray = [190, 220];
            var defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            var pointA = Point.parsePoint(intArray, defaultValue);
            expect(pointA.x).toBe(190);
            expect(pointA.y).toBe(220);
        });

        it("Parse Point (int with more than 2 elements)",() => {
            var intArray = [190, 220, 200, 210];
            var pointA = Point.parsePoint(intArray);
            expect(pointA).toBe(null);
        });

        it("Parse Point (int with more than 2 elements (default value taken)",() => {
            var intArray = [190, 220, 200, 210];
            var defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            pointA = Point.parsePoint(intArray, defaultValue);
            expect(pointA.x).toBe(110);
            expect(pointA.y).toBe(100);
        });

        it("Parse Point (int with one element)",() => {
            var intArray = [190];
            var pointA = Point.parsePoint(intArray);
            expect(pointA).toBe(null);
        });

        it("Parse Point - int with one element (default value taken)",() => {
            var intArray = [190];
            var defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            var pointA = Point.parsePoint(intArray, defaultValue);
            expect(pointA.x).toBe(defaultValue.x);
            expect(pointA.y).toBe(defaultValue.y);
        });

        it("Parse Point (int with empty array)",() => {
            var intArray = [];
            var pointA = Point.parsePoint(intArray);
            expect(pointA).toBe(null);
        });

        it("Parse Point (int with empty array (default value taken)",() => {
            var intArray = [];
            var defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            var pointA = Point.parsePoint(intArray, defaultValue);
            expect(pointA.x).toBe(110);
            expect(pointA.y).toBe(100);
        });

        it("Parse Point  - not string and not array)",() => {
            var num: boolean = true;
            var pointA = Point.parsePoint(num);
            expect(pointA).toBe(null);

        });

        it("Parse Point - not string and not array (default value taken)",() => {
            var num: boolean = true;
            var defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            var pointA = Point.parsePoint(num, defaultValue);
            expect(pointA.x).toBe(110);
            expect(pointA.y).toBe(100);
        });

        it("Parse Point - getting null",() => {
            var pointA = Point.parsePoint(null);
            expect(pointA).toBe(null);
        });

        it("Parse Point - getting null (default value taken)",() => {
            var defaultValue: Shapes.IPoint = { x: 110, y: 100 };
            var pointA = Point.parsePoint(null, defaultValue);
            expect(pointA.x).toBe(110);
            expect(pointA.y).toBe(100);
        });
    });

    describe("Size Tests",() => {

        it("Is Empty - true",() => {
            var size: Shapes.ISize = { width: 0, height: 0 };
            var isEmpty = Size.isEmpty(size);
            expect(isEmpty).toBe(true);
        });

        it("Is Empty - false",() => {
            var size: Shapes.ISize = { width: 50, height: 50 };
            var isEmpty = Size.isEmpty(size);
            expect(isEmpty).toBe(false);
        });

        it("Check equals - return true",() => {
            var sizeA: Shapes.ISize = { width: 120, height: 100 };
            var sizeB: Shapes.ISize = { width: 120, height: 100 };
            var sizeEquals = Size.equals(sizeA,sizeB);
            expect(sizeEquals).toBe(true);
        });

        it("Check equals - return false",() => {
            var sizeA: Shapes.ISize = { width: 120, height: 100 };
            var sizeB: Shapes.ISize = { width: 120, height: 150 };
            var sizeEquals = Size.equals(sizeA, sizeB);
            expect(sizeEquals).toBe(false);
        });

        it("Check equals - null",() => {
            var size: Shapes.ISize = { width: 120, height: 100 };
            var sizeEquals = Size.equals(size, null);
            expect(sizeEquals).toBe(false);
        });

        it("clone",() => {
            var size: Shapes.ISize = { width: 120, height: 100 };
            var sizeCloned = Size.clone(size);
            expect(sizeCloned.width).toBe(size.width);
            expect(sizeCloned.height).toBe(size.height);
        });

        it("clone - null",() => {
            var size = null;
            var sizeCloned = Size.clone(size);
            expect(sizeCloned).toBe(null);
        });

        it("inflate - Positive values",() => {
            var size: Shapes.ISize = { width: 120, height: 100 };
            var padding: Shapes.IThickness = { left: 5, top: 10, right: 5, bottom: 10 };
            var sizeInflated = Size.inflate(size,padding);
            expect(sizeInflated.width).toBe(130);
            expect(sizeInflated.height).toBe(120);
        });

        it("inflate - Zero values",() => {
            var size: Shapes.ISize = { width: 120, height: 100 };
            var padding: Shapes.IThickness = { left: 0, top: 0, right: 0, bottom: 0 };
            var sizeInflated = Size.inflate(size,padding);
            expect(sizeInflated.width).toBe(size.width);
            expect(sizeInflated.height).toBe(size.height);
        });

        it("deflate - Positive values",() => {
            var size: Shapes.ISize = { width: 120, height: 100 };
            var padding: Shapes.IThickness = { left: 5, top: 10, right: 5, bottom: 10 };
            var sizeDeflated = Size.deflate(size,padding);
            expect(sizeDeflated.width).toBe(110);
            expect(sizeDeflated.height).toBe(80);
        });

        it("deflate - Zero values",() => {
            var size: Shapes.ISize = { width: 120, height: 100 };
            var padding: Shapes.IThickness = { left: 0, top: 0, right: 0, bottom: 0 };
            var sizeDeflated = Size.deflate(size,padding);
            expect(sizeDeflated.width).toBe(size.width);
            expect(sizeDeflated.height).toBe(size.height);
        });

        it("Combine 2 sizes",() => {
            var sizeA: Shapes.ISize = { width: 70, height: 110 };
            var sizeB: Shapes.ISize = { width: 30, height: 120 };
            Size.combine(sizeA,sizeB);
            var newSize: Shapes.ISize = { width: 70, height: 120 };
            expect(newSize.width).toBe(70);
            expect(newSize.height).toBe(120);
        });

        it("Combine 2 sizes (A contains B)",() => {
            var sizeA: Shapes.ISize = { width: 150, height: 120 };
            var sizeB: Shapes.ISize = { width: 80, height: 110 };
            var newSize = Size.combine(sizeA, sizeB);
            expect(newSize.width).toBe(sizeA.width);
            expect(newSize.height).toBe(sizeA.height);
        });

        it("Combine 2 sizes (B contains A)",() => {
            var sizeA: Shapes.ISize = { width: 150, height: 120 };
            var sizeB: Shapes.ISize = { width: 180, height: 170 };
            var newSize = Size.combine(sizeA, sizeB);
            expect(newSize.width).toBe(sizeB.width);
            expect(newSize.height).toBe(sizeB.height);
        });

        it("Combine 2 sizes (one empty)",() => {
            var sizeA: Shapes.ISize = { width: 110, height: 120 };
            var sizeB: Shapes.ISize = { width: 0, height: 0 };
            var newSize = Size.combine(sizeA, sizeB);
            expect(newSize.width).toBe(sizeA.width);
            expect(newSize.height).toBe(sizeA.height);
        });

        it("To Rect",() => {
            var size: Shapes.ISize = { width: 120, height: 100 };
            var sizeToRect = Size.toRect(size);
            expect(sizeToRect.left).toBe(0);
            expect(sizeToRect.top).toBe(0);
            expect(sizeToRect.width).toBe(120);
            expect(sizeToRect.height).toBe(100);
        });

        it("To string",() => {
            var size: Shapes.ISize = { width: 150, height: 30 };
            var sizeToString = Size.toString(size);
            expect(sizeToString).toBe("{width:150, height:30}");
        });

        it("Equals (static) - return true ",() => {
            var SizeA: Shapes.ISize = { width: 200, height: 200 };
            var SizeB: Shapes.ISize = { width: 200, height: 200 };
            var areSizesEqual = Size.equals(SizeA, SizeB);
            expect(areSizesEqual).toBe(true);
        });

        it("Equals (static) - size A is null ",() => {
            var SizeB: Shapes.ISize = { width: 200, height: 200 };
            var areSizesEqual = Size.equals(null, SizeB);
            expect(areSizesEqual).toBe(false);
        });

        it("Equals (static) - size B is null ",() => {
            var SizeA: Shapes.ISize = { width: 200, height: 200 };
            var areSizesEqual = Size.equals(SizeA, null);
            expect(areSizesEqual).toBe(false);
        });

        it("Equals (static) - sizes are null ",() => {
            var areSizesEqual = Size.equals(null, null);
            expect(areSizesEqual).toBe(false);
        });

        it("Equals with Precision - return true ",() => {
            var SizeA: Shapes.ISize = { width: 200.23, height: 200.32 };
            var SizeB: Shapes.ISize = { width: 200.23, height: 200.32 };
            var areSizesEqual = Shapes.Size.equalWithPrecision(SizeA, SizeB);
            expect(areSizesEqual).toBe(true);
        });

        it("Parse Size (from string no default value)",() => {
            var sizeStr = "200,215";
            var sizeA = Size.parseSize(sizeStr);
            expect(sizeA.width).toBe(200);
            expect(sizeA.height).toBe(215);
        });

        it("Parse Size (from string,2 points)",() => {
            var sizeStr = "190,220";
            var sizeA = Size.parseSize(sizeStr);
            expect(sizeA.width).toBe(190);
            expect(sizeA.height).toBe(220);
        });

        it("Parse Size - from string,2 points (default value ignored)",() => {
            var sizeStr = "190,220";
            var defaultValue: Shapes.ISize = { width: 110, height: 100 };
            var sizeA = Size.parseSize(sizeStr, defaultValue);
            expect(sizeA.width).toBe(190);
            expect(sizeA.height).toBe(220);
        });

        it("Parse Size (from empty string)",() => {
            var sizeStr = "";
            var sizeA = Size.parseSize(sizeStr);
            expect(sizeA).toBe(null);
        });

        it("Parse Size - from empty string (default value taken)",() => {
            var sizeStr = "";
            var defaultValue: Shapes.ISize = { width: 110, height: 100 };
            var sizeA = Size.parseSize(sizeStr, defaultValue);
            expect(sizeA.width).toBe(110);
            expect(sizeA.height).toBe(100);
        });

        it("Parse Size (from int array)",() => {
            var intArray = [190, 220];
            var sizeA = Size.parseSize(intArray);
            expect(sizeA.width).toBe(190);
            expect(sizeA.height).toBe(220);
        });

        it("Parse Size - from int array (default value ignored)",() => {
            var intArray = [190, 220];
            var defaultValue: Shapes.ISize = { width: 110, height: 100 };
            var sizeA = Size.parseSize(intArray, defaultValue);
            expect(sizeA.width).toBe(190);
            expect(sizeA.height).toBe(220);
        });

        it("Parse Size (int with more than 2 elements)",() => {
            var intArray = [190, 220, 200, 210];
            var sizeA = Size.parseSize(intArray);
            expect(sizeA).toBe(null);
        });

        it("Parse Size (int with more than 2 elements (default value taken)",() => {
            var intArray = [190, 220, 200, 210];
            var defaultValue: Shapes.ISize = { width: 110, height: 100 };
            var sizeA = Size.parseSize(intArray, defaultValue);
            expect(sizeA.width).toBe(defaultValue.width);
            expect(sizeA.height).toBe(defaultValue.height);
        });

        it("Parse Size (int with one element)",() => {
            var intArray = [190];
            var sizeA = Size.parseSize(intArray);
            expect(sizeA).toBe(null);
        });

        it("Parse Size (int with one element (default value taken)",() => {
            var intArray = [190];
            var defaultValue: Shapes.ISize = { width: 110, height: 100 };
            var sizeA = Size.parseSize(intArray, defaultValue);
            expect(sizeA.width).toBe(defaultValue.width);
            expect(sizeA.height).toBe(defaultValue.height);
        });

        it("Parse Size (int with empty array)",() => {
            var intArray = [];
            var sizeA = Size.parseSize(intArray);
            expect(sizeA).toBe(null);
        });

        it("Parse Size (int with empty array (default value taken)",() => {
            var intArray = [];
            var defaultValue: Shapes.ISize = { width: 110, height: 100 };
            var sizeA = Size.parseSize(intArray, defaultValue);
            expect(sizeA.width).toBe(110);
            expect(sizeA.height).toBe(100);
        });

        it("Parse Size (not string and not array)",() => {
            var num: boolean = true;
            var sizeA = Size.parseSize(num);
            expect(sizeA).toBe(null);
        });

        it("Parse Size (not string and not array (default value taken)",() => {
            var num: boolean = true;
            var defaultValue: Shapes.ISize = { width: 110, height: 100 };
            var sizeA = Size.parseSize(num, defaultValue);
            expect(sizeA.width).toBe(110);
            expect(sizeA.height).toBe(100);
        });

        it("Parse Size - getting null",() => {
            var sizeA = Size.parseSize(null);
            expect(sizeA).toBe(null);
        });

        it("Parse Size - getting null (default value taken)",() => {
            var defaultValue: Shapes.ISize = { width: 110, height: 100 };
            var sizeA = Size.parseSize(null, defaultValue);
            expect(sizeA.width).toBe(110);
            expect(sizeA.height).toBe(100);
        });
    });

    describe("Rect tests",() => {

        var rectA;
        var rectB;
        var isEmpty;
        var isIntersecting;
        var defaultRect: Shapes.IRect = { left: 110, top: 100, width: 150, height: 117 };

        function AreRectsEqual(rectA, rectB): boolean {
            return (rectB.left === rectA.left && rectB.top === rectA.top && rectB.width === rectA.width && rectB.height === rectA.height);
        }

        it("Is Empty - true",() => {
            rectA = { left: 0, top: 0, width: 0, height: 0 };
            var isEmpty = Rect.isEmpty(rectA);
            expect(isEmpty).toBe(true);
        });

        it("Is Empty - false",() => {
            rectA = { left: 0, top: 0, width: 50, height: 20 };
            var isEmpty = Rect.isEmpty(rectA);
            expect(isEmpty).toBe(false);
        });

        it("Is Empty - null",() => {
            rectA = null;
            isEmpty = Rect.isEmpty(rectA);
            expect(isEmpty).toBe(true);
        });

        it("Is Intersecting - true",() => {
            rectA = { left: 0, top: 0, width: 200, height: 300 };
            rectB = { left: 170, top: 30, width: 300, height: 400 };
            isIntersecting = Rect.isIntersecting(rectA,rectB);
            expect(isIntersecting).toBe(true);
        });

        it("Is Intersecting - false",() => {
            rectA = { left: 0, top: 0, width: 10, height: 10 };
            rectB = { left: 100, top: 200, width: 500, height: 400 };
            isIntersecting = Rect.isIntersecting(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Is Intersecting - first rect is null",() => {
            rectA = { left: 0, top: 0, width: 200, height: 200 };
            rectB = null;
            isIntersecting = Rect.isIntersecting(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Is Intersecting - second rect is null",() => {
            rectA = null;
            rectB = { left: 0, top: 0, width: 200, height: 200 };
            isIntersecting = Rect.isIntersecting(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Get offset",() => {
            rectA = { left: 0, top: 0, width: 200, height: 200 };
            rectB = Rect.getOffset(rectA);
            expect(rectB.x).toBe(0);
            expect(rectB.y).toBe(0);
        });

        it("Get size",() => {
            rectA = { left: 0, top: 0, width: 200, height: 200 };
            rectB = Rect.getSize(rectA);
            expect(rectB.width).toBe(200);
            expect(rectB.height).toBe(200);
        });

        it("Set size",() => {
            rectA = { left: 0, top: 0, width: 200, height: 200 };
            var newSize: Shapes.ISize = { width: 150, height: 170 };
            Rect.setSize(rectA,newSize);
            expect(rectA.width).toBe(150);
            expect(rectA.height).toBe(170);
        });

        it("Get Right (Property)",() => {
            rectA = { left: 120, top: 50, width: 200, height: 200 };
            var right = Rect.right(rectA);
            expect(right).toBe(320);
        });

        it("Get Bottom (Property)",() => {
            rectA = { left: 70, top: 130, width: 200, height: 200 };
            var bottom = Rect.bottom(rectA);
            expect(bottom).toBe(330);
        });

        it("Get TopLeft (Property)",() => {
            rectA = { left: 0, top: 0, width: 200, height: 200 };
            var topLeft = Rect.topLeft(rectA);
            expect(topLeft.x).toBe(0);
            expect(topLeft.y).toBe(0);
        });

        it("Get TopRight (Property)",() => {
            rectA = { left: 80, top: 170, width: 150, height: 220 };
            var topRight = Rect.topRight(rectA);
            expect(topRight.x).toBe(230);
            expect(topRight.y).toBe(170);
        });

        it("Get BottomLeft (Property)",() => {
            rectA = { left: 0, top: 10, width: 30, height: 220 };
            var bottomLeft = Rect.bottomLeft(rectA);
            expect(bottomLeft.x).toBe(rectA.left);
            expect(bottomLeft.y).toEqual(rectA.top+rectA.height);
        });

        it("Get BottomRight (Property)",() => {
            rectA = { left: 50, top: 90, width: 200, height: 270 };
            var bottomRight = Rect.bottomRight(rectA);
            expect(bottomRight.x).toBe(250);
            expect(bottomRight.y).toBe(360);
        });

        it("Check equals - return true",() => {
            rectA = { left: 50, top: 90, width: 200, height: 270 };
            rectB = { left: 50, top: 90, width: 200, height: 270 };
            var rectEquals = Rect.equals(rectA, rectB);
            expect(rectEquals).toBe(true);
        });

        it("Check equals - return false",() => {
            rectA = { left: 50, top: 90, width: 200, height: 270 };
            rectB = { left: 50, top: 90, width: 250, height: 270 };
            var rectEquals = Rect.equals(rectA, rectB);
            expect(rectEquals).toBe(false);
        });

        it("Check equals - null",() => {
            rectA = { left: 70, top: 90, width: 130, height: 270 };
            var rectEquals = Rect.equals(rectA, null);
            expect(rectEquals).toBe(false);
        });

        it("Clone",() => {
            rectA = { left: 70, top: 90, width: 130, height: 270 };
            rectB = Rect.clone(rectA);
            expect(AreRectsEqual(rectA, rectB)).toBe(true);
        });

        it("Rect ToString",() => {
            rectA = { left: 70, top: 90, width: 130, height: 270 };
            var rectToString = "{left:70, top:90, width:130, height:270}";
            expect(Rect.toString(rectA)).toBe(rectToString);
        });

        it("Rect offset - Positive Values",() => {
            rectA = { left: 70, top: 90, width: 130, height: 270 };
            var rectB = Rect.offset(rectA,30, 30);
            expect(rectB.left).toBe(rectA.left + 30);
            expect(rectB.top).toBe(rectA.top + 30);
            expect(rectB.width).toBe(rectA.width);
            expect(rectB.height).toBe(rectA.height);
        });

        it("Rect offset - Zero Values",() => {
            rectA = { left: 70, top: 90, width: 130, height: 270 };
            var rectB = Rect.offset(rectA,0, 0);
            expect(rectB.left).toBe(rectA.left);

        });

        it("Rect offset - Negative Values",() => {
            rectA = { left: 70, top: 90, width: 130, height: 270 };
            rectB = Rect.offset(rectA,-30, -60);
            expect(rectB.left).toBe(rectA.left - 30);
            expect(rectB.top).toBe(rectA.top - 60);
            expect(rectB.width).toBe(rectA.width);
            expect(rectB.height).toBe(rectA.height);
        });

        it("Rect offset - Negative Offset Bigger than Top Left",() => {
            rectA = { left: 70, top: 90, width: 130, height: 270 };
            rectB = Rect.offset(rectA,-100, -130);
            expect(rectB.left).toBe(0);
            expect(rectB.top).toBe(0);
            expect(rectB.width).toBe(rectA.width);
            expect(rectB.height).toBe(rectA.height);
        });

        it("Rect inflate",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            var thickness: Shapes.IThickness = { left: 30, top: 20, right: 50, bottom: 40 };
            rectB = Rect.inflate(rectA,thickness);
            expect(rectB.left).toBe(40);
            expect(rectB.top).toBe(90);
            expect(rectB.width).toBe(210);
            expect(rectB.height).toBe(330);
        });

        it("Rect inflate - Zero Values",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            var thickness: Shapes.IThickness = { left: 0, top: 0, right: 0, bottom: 0 };
            rectB = Rect.inflate(rectA, thickness);
            expect(rectB.left).toBe(70);
            expect(rectB.top).toBe(110);
            expect(rectB.width).toBe(130);
            expect(rectB.height).toBe(270);
        });

        it("Rect deflate",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            var thickness: Shapes.IThickness = { left: 30, top: 20, right: 50, bottom: 40 };
            rectB = Rect.deflate(rectA, thickness);
            expect(rectB.left).toBe(100);
            expect(rectB.top).toBe(130);
            expect(rectB.width).toBe(50);
            expect(rectB.height).toBe(210);
        });

        it("Rect deflate - Zero Values",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            var thickness: Shapes.IThickness = { left: 0, top: 0, right: 0, bottom: 0 };
            rectB = Rect.deflate(rectA, thickness);
            expect(rectB.left).toBe(70);
            expect(rectB.top).toBe(110);
            expect(rectB.width).toBe(130);
            expect(rectB.height).toBe(270);
        });

        it("Rect inflateBy",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectA = Rect.inflateBy(rectA, 20);
            expect(rectA.left).toBe(50);
            expect(rectA.top).toBe(90);
            expect(rectA.width).toBe(170);
            expect(rectA.height).toBe(310);
        });

        it("Rect inflateBy - Zero Values",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectA = Rect.inflateBy(rectA, 0);
            expect(rectA.left).toBe(70);
            expect(rectA.top).toBe(110);
            expect(rectA.width).toBe(130);
            expect(rectA.height).toBe(270);
        });

        it("Rect deflateBy",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectA = Rect.deflateBy(rectA, 30);
            expect(rectA.left).toBe(100);
            expect(rectA.top).toBe(140);
            expect(rectA.width).toBe(70);
            expect(rectA.height).toBe(210);
        });

        it("Rect deflateBy - Zero Values",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectA = Rect.deflateBy(rectA, 0);
            expect(rectA.left).toBe(70);
            expect(rectA.top).toBe(110);
            expect(rectA.width).toBe(130);
            expect(rectA.height).toBe(270);
        });

        it("Contains Point - Return true",() =>{
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            var newPoint: Shapes.IPoint = { x: 100, y: 140 };
            var isContains = Shapes.Rect.containsPoint(rectA, newPoint);
            expect(isContains).toBe(true);
        });

        it("Contains Point - Return false",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            var newPoint: Shapes.IPoint = { x: 220, y: 170 };
            var isContains = Shapes.Rect.containsPoint(rectA, newPoint);
            expect(isContains).toBe(false);
        });

        it("Contains Point - null",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            var isContains = Shapes.Rect.containsPoint(rectA, null);
            expect(isContains).toBe(false);
        });

        it("Is Intersecting - Return true",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectB = { left: 70, top: 150, width: 130, height: 320 };
            var isIntersecting = Shapes.Rect.isIntersecting(rectA, rectB);
            expect(isIntersecting).toBe(true);
        });

        it("Is Intersecting - Return false",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectB = { left: 30, top: 20, width: 20, height: 20 };
            var isIntersecting = Shapes.Rect.isIntersecting(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Is Intersecting - first null",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectB = null;
            var isIntersecting = Shapes.Rect.isIntersecting(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Is Intersecting - second null",() => {
            rectA = null;
            rectB = { left: 70, top: 110, width: 130, height: 270 };
            var isIntersecting = Shapes.Rect.isIntersecting(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Intersect - Rect A Contains B",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectB = { left: 90, top: 140, width: 20, height: 20 };
            //var intersectingRect = Shapes.Rect.intersect(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Intersect - Rect B Contains A",() => {
            rectA = { left: 110, top: 150, width: 30, height: 25 };
            rectB = { left: 90, top: 140, width: 100, height: 120 };
            //    var intersectingRect = Shapes.Rect.intersect(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Intersect - Rect A Intersect B",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectB = { left: 90, top: 130, width: 80, height: 70 };
            //    var intersectingRect = Shapes.Rect.intersect(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Intersect - Rect A don't Intersect B",() => {
            rectA = { left: 0, top: 0, width: 20, height: 30 };
            rectB = { left: 70, top: 110, width: 130, height: 270 };
            //    var intersectingRect = Shapes.Rect.intersect(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Intersect - Rect A is null",() => {
            rectA = null;
            rectB = { left: 70, top: 110, width: 130, height: 270 };
            //    var intersectingRect = Shapes.Rect.intersect(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Intersect - Rect B is null",() => {
            rectA = { left: 70, top: 110, width: 130, height: 270 };
            rectB = null;
            //    var intersectingRect = Shapes.Rect.intersect(rectA, rectB);
            expect(isIntersecting).toBe(false);
        });

        it("Combine 2 rects",() => {
            rectA = { left: 50, top: 50, width: 50, height: 50 };
            rectB = { left: 60, top: 60, width: 60, height: 60 };
            var newRect = Rect.combine(rectA,rectB);
            var newRectCalculated: Shapes.IRect = { left: 50, top: 50, width: 70, height: 70 };
            expect(AreRectsEqual(newRectCalculated, newRect)).toBe(true);
        });

        it("Combine 2 rects (A contains B)",() => {
            rectA = { left: 150, top: 150, width: 20, height: 20 };
            rectB = { left: 160, top: 160, width: 10, height: 10 };
            var newRect = Rect.combine(rectA, rectB);
            expect(AreRectsEqual(rectA, newRect)).toBe(true);
        });

        it("Combine 2 rects (B contains A)",() => {
            rectA = { left: 150, top: 150, width: 20, height: 20 };
            rectB = { left: 130, top: 130, width: 50, height: 50 };
            var newRect = Rect.combine(rectA, rectB);
            expect(AreRectsEqual(newRect, rectB)).toBe(true);
        });

        it("Combine 2 rects (one empty)",() => {
            rectA = { left: 150, top: 150, width: 20, height: 20 };
            rectB = { left: 0, top: 0, width: 0, height: 0 };
            var newRect = rectA;
            Rect.combine(rectA, rectB);
            expect(AreRectsEqual(rectA, newRect)).toBe(true);
        });

        it("Parse Rect (from string no default value)",() => {
            var rectStr = "200,215,200,180";
            rectA = Rect.parseRect(rectStr);
            expect(rectA.left).toBe(200);
            expect(rectA.top).toBe(215);
            expect(rectA.width).toBe(200);
            expect(rectA.height).toBe(180);
        });

        it("Parse Rect - from string,(default value ignored)",() => {
            var rectStr = "190,220,150,170";
            rectA = Rect.parseRect(rectStr, defaultRect);
            expect(rectA.left).toBe(190);
            expect(rectA.top).toBe(220);
            expect(rectA.width).toBe(150);
            expect(rectA.height).toBe(170);
        });

        it("Parse Rect (from empty string)",() => {
            var rectStr = "";
            rectA = Rect.parseRect(rectStr);
            expect(rectA).toBe(null);
        });

        it("Parse Rect - from empty string (default value taken)",() => {
            var rectStr = "";
            rectA = Rect.parseRect(rectStr, defaultRect);
            expect(rectA.left).toBe(defaultRect.left);
            expect(rectA.top).toBe(defaultRect.top);
            expect(rectA.width).toBe(defaultRect.width);
            expect(rectA.height).toBe(defaultRect.height);
        });

        it("Parse Rect (from int array)",() => {
            var intArray = [190, 220, 100, 150];
            rectA = Rect.parseRect(intArray);
            expect(rectA.left).toBe(190);
            expect(rectA.top).toBe(220);
            expect(rectA.width).toBe(100);
            expect(rectA.height).toBe(150);
        });

        it("Parse Rect - from int array (default value ignored)",() => {
            var intArray = [190, 220, 130, 115];
            rectA = Rect.parseRect(intArray, defaultRect);
            expect(rectA.left).toBe(190);
            expect(rectA.top).toBe(220);
            expect(rectA.width).toBe(130);
            expect(rectA.height).toBe(115);
        });

        it("Parse Rect (int with more than 4 elements)",() => {
            var intArray = [190, 220, 200, 210, 118];
            rectA = Rect.parseRect(intArray);
            expect(rectA).toBe(null);
        });

        it("Parse Rect (int with more than 4 elements (default value ignored)",() => {
            var intArray = [190, 220, 200, 210];
            var defaultValue = { left: 110, top: 100, width: 115, height: 170 };
            rectA = Rect.parseRect(intArray, defaultValue);
            expect(rectA.left).toBe(190);
            expect(rectA.top).toBe(220);
            expect(rectA.width).toBe(200);
            expect(rectA.height).toBe(210);
        });

        it("Parse Rect (int with one element)",() => {
            var intArray = [190];
            rectA = Rect.parseRect(intArray);
            expect(rectA).toBe(null);
        });

        it("Parse Rect (int with one element (default value taken)",() => {
            var intArray = [190];
            rectA = Rect.parseRect(intArray, defaultRect);
            expect(rectA.left).toBe(defaultRect.left);
            expect(rectA.top).toBe(defaultRect.top);
            expect(rectA.width).toBe(defaultRect.width);
            expect(rectA.height).toBe(defaultRect.height);
        });

        it("Parse Rect (int with empty array)",() => {
            var intArray = [];
            rectA = Rect.parseRect(intArray);
            expect(rectA).toBe(null);
        });

        it("Parse Rect (int with empty array (default value taken)",() => {
            var intArray = [];
            var defaultValue = { left: 110, top: 100, width: 115, height: 170 };
            rectA = Rect.parseRect(intArray, defaultValue);
            expect(rectA.left).toBe(defaultValue.left);
            expect(rectA.top).toBe(defaultValue.top);
            expect(rectA.width).toBe(defaultValue.width);
            expect(rectA.height).toBe(defaultValue.height);
        });

        it("Parse Rect (not string and not array)",() => {
            var num: boolean = true;
            rectA = Rect.parseRect(num);
            expect(rectA).toBe(null);
        });

        it("Parse Rect (not string and not array (default value taken)",() => {
            var num: boolean = true;
            var defaultValue = { left: 110, top: 100, width: 115, height: 170 };
            rectA = Rect.parseRect(num, defaultValue);
            expect(rectA.left).toBe(defaultValue.left);
            expect(rectA.top).toBe(defaultValue.top);
            expect(rectA.width).toBe(defaultValue.width);
            expect(rectA.height).toBe(defaultValue.height);
        });

        it("Parse Rect - getting null",() => {
            rectA = Rect.parseRect(null);
            expect(rectA).toBe(null);
        });

        it("Parse Rect - getting null (default value taken)",() => {
            var defaultValue = { left: 110, top: 100, width: 115, height: 170 };
            rectA = Rect.parseRect(null, defaultValue);        
            expect(rectA.left).toBe(defaultValue.left);
            expect(rectA.top).toBe(defaultValue.top);
            expect(rectA.width).toBe(defaultValue.width);
            expect(rectA.height).toBe(defaultValue.height);
        });

    });

    describe("Thickness tests",() => {

        var thicknessA;
        var thicknessB;
        var defaultThickness: Shapes.IThickness = { left: 105, top: 100, right: 122, bottom: 122 };

        it("Inflate",() => {
            thicknessA = { left: 120, top: 100, right: 150, bottom: 170 };
            thicknessB = { left: 20, top: 20, right: 20, bottom: 20 };
            var newThickness = Thickness.inflate(thicknessA, thicknessB);
            expect(newThickness.left).toBe(140);
            expect(newThickness.top).toBe(120);
            expect(newThickness.right).toBe(170);
            expect(newThickness.bottom).toBe(190);
        });

        it("Get Width",() =>{
            thicknessA = { left: 115, top: 134, right: 212, bottom: 270 };
            var thicknessWidth = Thickness.getWidth(thicknessA);
            expect(thicknessWidth).toBe(327);
        });

        it("Get Width - Zero Thickness",() => {
            thicknessA = { left: 0, top: 0, right: 0, bottom: 0 };
            var thicknessWidth = Thickness.getWidth(thicknessA);
            expect(thicknessWidth).toBe(0);
        });

        it("Get Height",() => {
            thicknessA = { left: 80, top: 215, right: 212, bottom: 15 };
            var thicknessHeight = Thickness.getHeight(thicknessA);
            expect(thicknessHeight).toBe(230);
        });

        it("Get Height",() => {
            thicknessA = { left: 0, top: 0, right: 0, bottom: 0 };
            var thicknessHeight = Thickness.getHeight(thicknessA);
            expect(thicknessHeight).toBe(0);
        });

        it("Clone",() => {
            thicknessA = { left: 158, top: 150, right: 215, bottom: 412 };
            thicknessB = Thickness.clone(thicknessA);
            expect(thicknessB.left).toBe(thicknessA.left);
            expect(thicknessB.top).toBe(thicknessA.top);
            expect(thicknessB.right).toBe(thicknessA.right);
            expect(thicknessB.bottom).toBe(thicknessA.bottom);
        });

        it("Clone - null value",() => {
            thicknessA = null;
            thicknessB = Thickness.clone(thicknessA);
            expect(thicknessB).toBe(null);

        });

        it("Equals - return true",() => {
            thicknessA = { left: 87, top: 156, right: 180, bottom: 95 };
            thicknessB = { left: 87, top: 156, right: 180, bottom: 95 };
            var isEquals = Thickness.equals(thicknessA,thicknessB);
            expect(isEquals).toBe(true);
        });

        it("Equals - return false",() => {
            thicknessA = { left: 87, top: 156, right: 180, bottom: 95 };
            thicknessB = { left: 87, top: 100, right: 180, bottom: 95 };
            var isEquals = Thickness.equals(thicknessA, thicknessB);
            expect(isEquals).toBe(false);
        });

        it("Equals - first value is null",() => {
            thicknessA = null;
            thicknessB = { left: 87, top: 156, right: 180, bottom: 95 };
            var isEquals = Thickness.equals(thicknessA, thicknessB);
            expect(isEquals).toBe(false);
        });

        it("Equals - second value is null",() => {
            thicknessA = { left: 87, top: 156, right: 180, bottom: 95 };
            thicknessB = null;
            var isEquals = Thickness.equals(thicknessA, thicknessB);
            expect(isEquals).toBe(false);
        });

        it("Flip Horizontal",() => {
            thicknessA = { left: 87, top: 156, right: 180, bottom: 95 };
            Thickness.flipHorizontal(thicknessA);
            expect(thicknessA.left).toBe(180);
            expect(thicknessA.right).toBe(87);
            expect(thicknessA.top).toBe(156);
            expect(thicknessA.bottom).toBe(95);

        });

        it("Flip Vertical",() => {
            thicknessA = { left: 87, top: 156, right: 180, bottom: 95 };
            Thickness.flipVertical(thicknessA);
            expect(thicknessA.left).toBe(87);
            expect(thicknessA.right).toBe(180);
            expect(thicknessA.top).toBe(95);
            expect(thicknessA.bottom).toBe(156);

        });

        it("To string",() => {
            thicknessA = { left: 158, top: 150, right: 215, bottom: 412 };
            var thicknessString = Thickness.toString(thicknessA);
            expect(thicknessString).toBe("{top:150, left:158, right:215, bottom:412}");

        });

        it("To Css String",() => {
            thicknessA = { left: 95, top: 140, right: 217, bottom: 107 };
            var thicknessString = Thickness.toCssString(thicknessA);
            expect(thicknessString).toBe("140px 217px 107px 95px");

        });

        it("Is Empty true",() => {
            thicknessA = { left: 0, top: 0, right: 0, bottom: 0 };
            var isEmpty = Thickness.isEmpty(thicknessA);
            expect(isEmpty).toBe(true);

        });

        it("Is Empty false",() => {
            thicknessA = { left: 125, top: 130, right: 114, bottom: 47 };
            var isEmpty = Thickness.isEmpty(thicknessA);
            expect(isEmpty).toBe(false);

        });

        it("Equals (static) - return true ",() => {
            thicknessA = { left: 87, top: 156, right: 180, bottom: 95 };
            thicknessB = { left: 87, top: 156, right: 180, bottom: 95 };
            var areThicknessesEqual = Thickness.equals(thicknessA, thicknessB);
            expect(areThicknessesEqual).toBe(true);
        });

        it("Equals (static) - return false ",() => {
            thicknessA = { left: 125, top: 130, right: 114, bottom: 47 };
            thicknessB = { left: 125, top: 130, right: 110, bottom: 47 };
            var areThicknessesEqual = Thickness.equals(thicknessA, thicknessB);
            expect(areThicknessesEqual).toBe(false);
        });

        it("Equals (static) - Thickness A is null ",() => {
            var thicknessB: Shapes.IThickness = { left: 125, top: 130, right: 114, bottom: 47 };
            var areThicknessesEqual = Thickness.equals(null, thicknessB);
            expect(areThicknessesEqual).toBe(false);
        });

        it("Equals (static) - Thickness B is null ",() => {
            var thicknessA: Shapes.IThickness = { left: 125, top: 130, right: 114, bottom: 47 };
            var areThicknessesEqual = Thickness.equals(thicknessA, null);
            expect(areThicknessesEqual).toBe(false);
        });

        it("Equals (static) - Thicknesses are null ",() => {
            var areThicknessesEqual = Thickness.equals(null, null);
            expect(areThicknessesEqual).toBe(false);
        });

        it("Equals with Precision (static) - return true ",() => {
            thicknessA = { left: 125, top: 130, right: 114, bottom: 47 };
            thicknessB = { left: 125, top: 130, right: 114, bottom: 47 };
            var areThicknessesEqual = Shapes.Thickness.equalWithPrecision(thicknessA, thicknessB);
            expect(areThicknessesEqual).toBe(true);
        });

        it("Parse Thickness (from string no default value)",() => {
            var thicknessStr = "200,215,200,180";
            thicknessA = Thickness.parseThickness(thicknessStr);
            expect(thicknessA.left).toBe(200);
            expect(thicknessA.top).toBe(215);
            expect(thicknessA.right).toBe(200);
            expect(thicknessA.bottom).toBe(180);
        });

        it("Parse Thickness - from string,(default value ignored)",() => {
            var thicknessStr = "190,220,150,170";
            thicknessA = Thickness.parseThickness(thicknessStr, defaultThickness);
            expect(thicknessA.left).toBe(190);
            expect(thicknessA.top).toBe(220);
            expect(thicknessA.right).toBe(150);
            expect(thicknessA.bottom).toBe(170);
        });

        it("Parse Thickness (from empty string)",() => {
            var thicknessStr = "";
            thicknessA = Thickness.parseThickness(thicknessStr);
            expect(thicknessA).toBe(null);
        });

        it("Parse Thickness - from empty string (default value taken)",() => {
            var thicknessStr = "";
            thicknessA = Thickness.parseThickness(thicknessStr, defaultThickness);
            expect(thicknessA.left).toBe(defaultThickness.left);
            expect(thicknessA.top).toBe(defaultThickness.top);
            expect(thicknessA.right).toBe(defaultThickness.right);
            expect(thicknessA.bottom).toBe(defaultThickness.bottom);
        });

        it("Parse Thickness (from int array)",() => {
            var intArray = [190, 220, 100, 150];
            thicknessA = Thickness.parseThickness(intArray);
            expect(thicknessA.left).toBe(190);
            expect(thicknessA.top).toBe(220);
            expect(thicknessA.right).toBe(100);
            expect(thicknessA.bottom).toBe(150);
        });

        it("Parse Thickness - from int array (default value ignored)",() => {
            var intArray = [190, 220, 130, 115];
            thicknessA = Thickness.parseThickness(intArray, defaultThickness);
            expect(thicknessA.left).toBe(190);
            expect(thicknessA.top).toBe(220);
            expect(thicknessA.right).toBe(130);
            expect(thicknessA.bottom).toBe(115);
        });

        it("Parse Thickness (int with more than 4 elements)",() => {
            var intArray = [190, 220, 200, 210, 118];
            thicknessA = Thickness.parseThickness(intArray);
            expect(thicknessA).toBe(null);
        });

        it("Parse Thickness (int with more than 4 elements (default value ignored)",() => {
            var intArray = [190, 220, 200, 210];
            thicknessA = Thickness.parseThickness(intArray, defaultThickness);
            expect(thicknessA.left).toBe(190);
            expect(thicknessA.top).toBe(220);
            expect(thicknessA.right).toBe(200);
            expect(thicknessA.bottom).toBe(210);
        });

        it("Parse Thickness (int with one element)",() => {
            var intArray = [190];
            thicknessA = Thickness.parseThickness(intArray);
            expect(thicknessA).toBe(null);
        });

        it("Parse Thickness (int with one element (default value taken)",() => {
            var intArray = [190];
            thicknessA = Thickness.parseThickness(intArray, defaultThickness);
            expect(thicknessA.left).toBe(defaultThickness.left);
            expect(thicknessA.top).toBe(defaultThickness.top);
            expect(thicknessA.right).toBe(defaultThickness.right);
            expect(thicknessA.bottom).toBe(defaultThickness.bottom);
        });

        it("Parse Thickness (int with empty array)",() => {
            var intArray = [];
            thicknessA = Thickness.parseThickness(intArray);
            expect(thicknessA).toBe(null);
        });

        it("Parse Thickness (int with empty array (default value taken)",() => {
            var intArray = [];
            thicknessA = Thickness.parseThickness(intArray, defaultThickness);
            expect(thicknessA.left).toBe(defaultThickness.left);
            expect(thicknessA.top).toBe(defaultThickness.top);
            expect(thicknessA.right).toBe(defaultThickness.right);
            expect(thicknessA.bottom).toBe(defaultThickness.bottom);
        });

        it("Parse Thickness (not string and not array)",() => {
            var num: boolean = true;
            thicknessA = Thickness.parseThickness(num);
            expect(thicknessA).toBe(null);
        });

        it("Parse Thickness (not string and not array (default value taken)",() => {
            var num: boolean = true;
            thicknessA = Thickness.parseThickness(num, defaultThickness);
            expect(thicknessA.left).toBe(defaultThickness.left);
            expect(thicknessA.top).toBe(defaultThickness.top);
            expect(thicknessA.right).toBe(defaultThickness.right);
            expect(thicknessA.bottom).toBe(defaultThickness.bottom);
        });

        it("Parse Thickness - getting null",() => {
            thicknessA = Thickness.parseThickness(null);
            expect(thicknessA).toBe(null);
        });

        it("Parse Thickness - getting null (default value taken)",() => {
            thicknessA = Thickness.parseThickness(null, defaultThickness);
            expect(thicknessA.left).toBe(defaultThickness.left);
            expect(thicknessA.top).toBe(defaultThickness.top);
            expect(thicknessA.right).toBe(defaultThickness.right);
            expect(thicknessA.bottom).toBe(defaultThickness.bottom);
        });

    });

    describe("Vector tests",() => {
        var vectorA;
        var vectorB;

        it("Is Empty true",() => {
            vectorA = { x: 0, y: 0 };
            var isEmpty = Vector.isEmpty(vectorA);
            expect(isEmpty).toBe(true);

        });

        it("Is Empty false",() => {
            vectorA = { x: 125, y: 130 };
            var isEmpty = Vector.isEmpty(vectorA);
            expect(isEmpty).toBe(false);

        });

        it("Equals - return true",() => {
            vectorA = { x: 180, y: 95 };
            vectorB = { x: 180, y: 95 };
            var isEquals = Vector.equals(vectorA, vectorB);
            expect(isEquals).toBe(true);
        });

        it("Equals - return false",() => {
            vectorA = { x: 180, y: 95 };
            vectorB = { x: 100, y: 180 };
            var isEquals = Vector.equals(vectorA, vectorB);
            expect(isEquals).toBe(false);
        });

        it("Equals - first value is null",() => {
            vectorA = null;
            vectorB = { x: 150, y: 117 };
            var isEquals = Vector.equals(vectorA, vectorB);
            expect(isEquals).toBe(false);
        });

        it("Equals - second value is null",() => {
            vectorA = { x: 156, y: 95 };
            vectorB = null;
            var isEquals = Vector.equals(vectorA, vectorB);
            expect(isEquals).toBe(false);
        });

        it("Clone",() => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.clone(vectorA);
            expect(vectorB.left).toBe(vectorA.left);
            expect(vectorB.top).toBe(vectorA.top);

        });

        it("Clone - null value",() => {
            vectorA = null;
            vectorB = Vector.clone(vectorA);
            expect(vectorB).toBe(null);

        });

        it("To string",() => {
            vectorA = { x: 215, y: 412 };
            var vectorString = Vector.toString(vectorA);
            expect(vectorString).toBe("{x:215, y:412}");

        });

        it("Get Length",() => {
            vectorA = { x: 215, y: 412 };
            var vectorLength = Vector.getLength(vectorA);
            var vectorLengthCalculated = Math.sqrt(215 * 215 + 412 * 412);
            expect(vectorLength).toBe(vectorLengthCalculated);
        });

        it("Get Length - Zero",() => {
            vectorA = { x: 0, y: 0 };
            var vectorLength = Vector.getLength(vectorA);
            expect(vectorLength).toBe(0);
        });

        it("Get Length Sqr",() => {
            vectorA = { x: 215, y: 412 };
            var vectorLength = Vector.getLengthSqr(vectorA);
            var vectorLengthCalculated = 215 * 215 + 412 * 412;
            expect(vectorLength).toBe(vectorLengthCalculated);
        });

        it("Get Length Sqr - Zero",() => {
            vectorA = { x: 0, y: 0 };
            var vectorLength = Vector.getLengthSqr(vectorA);
            expect(vectorLength).toBe(0);
        });

        it("Scale - Greater than 1",() => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.scale(vectorA,15);
            expect(vectorB.x).toBe(vectorA.x * 15);
            expect(vectorB.y).toBe(vectorA.y * 15);
        });

        it("Scale -  1",() => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.scale(vectorA, 1);
            expect(vectorB.x).toBe(vectorA.x);
            expect(vectorB.y).toBe(vectorA.y);
        });

        it("Scale -  between 0 and 1",() => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.scale(vectorA, 0.4);
            expect(vectorB.x).toBe(vectorA.x * 0.4);
            expect(vectorB.y).toBe(vectorA.y * 0.4);
        });

        it("Scale -  0",() => {
            vectorA = { x: 215, y: 412 };;
            vectorB = Vector.scale(vectorA, 0);
            expect(vectorB.x).toBe(0);
            expect(vectorB.y).toBe(0);
        });

        it("Scale -  Negative",() => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.scale(vectorA, -4);
            expect(vectorB.x).toBe(vectorA.x * -4);
            expect(vectorB.y).toBe(vectorA.y * -4);
        });

        it("Normalize",() => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.normalize(vectorA);
            var vectorALength = Vector.getLength(vectorA);
            var newVector: Shapes.IVector = { x: vectorA.x / vectorALength, y: vectorA.y / vectorALength };
            expect(newVector.x).toBe(vectorB.x);
            expect(newVector.y).toBe(vectorB.y);
        });

        it("Normalize - empty vector",() => {
            vectorA = { x: 0, y: 0 };
            vectorB = Vector.normalize(vectorA);
            expect(vectorB.x).toBe(0);
            expect(vectorB.y).toBe(0);
        });

        it("Rotate Vector 90 degrees CW",() => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.rotate90DegCW(vectorA);
            expect(vectorB.x).toBe(vectorA.y);
            expect(vectorB.y).toBe(-vectorA.x);
        });

        it("Rotate Vector 90 degrees CCW",() => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.rotate90DegCCW(vectorA);
            expect(vectorB.x).toBe(-vectorA.y);
            expect(vectorB.y).toBe(vectorA.x);
        });

        /*Using the Vector rotate formula newX=(X*cosA)-(y*sinA) */
        it("Rotate - between 0 to 360 degrees",() => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.rotate(vectorA,47);
            var newVector: Shapes.IVector = { x: vectorA.x * Math.cos(47) - vectorA.y * Math.sin(47), y: vectorA.x * Math.sin(47) + vectorA.y * Math.cos(47) };
            expect(vectorB.x).toBe(newVector.x);
            expect(vectorB.y).toBe(newVector.y);
        });

        it("Rotate - 0 degrees",() => {
            vectorA = { x: 215, y: 412 };
            vectorB = Vector.rotate(vectorA, 0);
            expect(vectorB.x).toBe(vectorA.x);
            expect(vectorB.y).toBe(vectorA.y);
        });

        it("Equals (static) - return true ",() => {
            vectorA = { x: 130, y: 47 };
            vectorB = { x: 130, y: 47 };
            var areVectorsEqual = Vector.equals(vectorA, vectorB);
            expect(areVectorsEqual).toBe(true);
        });

        it("Equals (static) - return false ",() => {
            vectorA = { x: 114, y: 47 };
            vectorB = { x: 110, y: 47 };
            var areVectorsEqual = Vector.equals(vectorA, vectorB);
            expect(areVectorsEqual).toBe(false);
        });

        it("Equals (static) - Vector A is null ",() => {
            vectorB = { x: 121, y: 88 };
            var areVectorsEqual = Vector.equals(null, vectorB);
            expect(areVectorsEqual).toBe(false);
        });

        it("Equals (static) - Vector B is null ",() => {
            vectorA = { x: 114, y: 47 };
            var areVectorsEqual = Vector.equals(vectorA, null);
            expect(areVectorsEqual).toBe(false);
        });

        it("Equals (static) - Vectors are null ",() => {
            var areVectorsEqual = Vector.equals(null, null);
            expect(areVectorsEqual).toBe(false);
        });

        it("Equals with Precision (static) - return true ",() => {
            vectorA = { x: 130, y: 114.4 };
            vectorB = { x: 130, y: 114.4 };
            var areVectorsEqual = Shapes.Thickness.equalWithPrecision(vectorA, vectorB);
            expect(areVectorsEqual).toBe(true);
        });

        it("Equals with Precision (static) - return false ",() => {
            vectorA = { x: 130.2, y: 114 };
            vectorB = { x: 130, y: 114 };
            var areVectorsEqual = Shapes.Thickness.equalWithPrecision(vectorA, vectorB);
            expect(areVectorsEqual).toBe(true);
        });

        it("Add 2 Vectors",() => {
            vectorA = { x: 114, y: 47 };
            vectorB = { x: 117, y: 134 };
            var newVector = Vector.add(vectorA, vectorB);
            expect(newVector.x).toBe(vectorA.x + vectorB.x);
            expect(newVector.y).toBe(vectorA.y + vectorB.y);
        });

        it("Add Vector to Empty Vector",() => {
            vectorA = { x: 114, y: 47 };
            vectorB = { x: 0, y: 0 };
            var newVector = Vector.add(vectorA, vectorB);
            expect(newVector.x).toBe(vectorA.x);
            expect(newVector.y).toBe(vectorA.y);
        });

        it("Add Vector to its Inverse vector",() => {
            vectorA = { x: 114, y: 47 };
            vectorB = { x: -114, y: -47 };
            var newVector = Vector.add(vectorA, vectorB);
            expect(newVector.x).toBe(0);
            expect(newVector.y).toBe(0);
        });

        it("Subtract 2 Vectors",() => {
            vectorA = { x: 114, y: 47 };
            vectorB = { x: 117, y: 134 };
            var newVector = Vector.subtract(vectorA, vectorB);
            expect(newVector.x).toBe(vectorA.x - vectorB.x);
            expect(newVector.y).toBe(vectorA.y - vectorB.y);
        });

        it("Subtract Vector to Empty Vector",() => {
            vectorA = { x: 114, y: 47 };
            vectorB = { x: 0, y: 0 };
            var newVector = Vector.subtract(vectorA, vectorB);
            expect(newVector.x).toBe(vectorA.x);
            expect(newVector.y).toBe(vectorA.y);
        });

        it("Subtract Vector from the same vector",() => {
            vectorA = { x: 116, y: 49 };
            vectorB = { x: 116, y: 49 };
            var newVector = Vector.subtract(vectorA, vectorB);
            expect(newVector.x).toBe(0);
            expect(newVector.y).toBe(0);
        });
    
        it("dotProduct",() => {
            vectorA = { x: 116, y: 49 };
            vectorA = { x: 140, y: 154 };
            var dotProduct = Shapes.Vector.dotProduct(vectorA, vectorB);
            var dotProductCalculated = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
            expect(dotProduct).toBe(dotProductCalculated);
        });

        it("Delta Vector",() => {
            var pointA: Shapes.IPoint = { x: 145, y: 217 };
            var pointB: Shapes.IPoint = { x: 140, y: 154 };
            var vectorA = Shapes.Vector.getDeltaVector(pointA, pointB);
            expect(vectorA.x).toBe(pointB.x - pointA.x);
            expect(vectorA.y).toBe(pointB.y - pointA.y);
        });
    });
}
