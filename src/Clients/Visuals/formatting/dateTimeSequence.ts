//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    /** Repreasents the sequence of the dates/times */
    export class DateTimeSequence {
        // Constants
        private static MIN_COUNT: number = 1;
        private static MAX_COUNT: number = 1000;        

        // Fields
        public min: Date;
        public max: Date;
        public unit: DateTimeUnit;
        public sequence: Date[];
        public interval: number;
        public intervalOffset: number;

        // Constructors
        /** Creates new instance of the DateTimeSequence */
        constructor(unit: DateTimeUnit) { 
            this.unit = unit;
            this.sequence = [];
            this.min = new Date("9999-12-31T23:59:59.999");
            this.max = new Date("0001-01-01T00:00:00.000");
        }

        // Methods
        /** Add a new Date to a sequence.
          * @param x - date to add
          */
        public add(date: Date) { 
            if (date < this.min) { 
                this.min = date;
            }
            if (date > this.max) { 
                this.max = date;
            }
            this.sequence.push(date);
        }

        // Methods
        /** Extends the sequence to cover new date range
          * @param min - new min to be covered by sequence
          * @param max - new max to be covered by sequence
          */
        public extendToCover(min: Date, max: Date): void {
            var x: Date = this.min;
            while (min < x) {
                x = DateTimeSequence.addInterval(x, -this.interval, this.unit);
                this.sequence.splice(0, 0, x);
            }
            this.min = x;

            x = this.max;
            while (x < max) {
                x = DateTimeSequence.addInterval(x, this.interval, this.unit);
                this.sequence.push(x);
            }
            this.max = x;
        }

        /** Move the sequence to cover new date range
          * @param min - new min to be covered by sequence
          * @param max - new max to be covered by sequence
          */
        public moveToCover(min: Date, max: Date): void { 
            var delta: number = DateTimeSequence.getDelta(min, max, this.unit);
            var count = Math.floor(delta / this.interval);
            this.min = DateTimeSequence.addInterval(this.min, count * this.interval, this.unit);

            this.sequence = [];            
            this.sequence.push(this.min);
            this.max = this.min;
            while (this.max < max) {
                this.max = DateTimeSequence.addInterval(this.max, this.interval, this.unit);
                this.sequence.push(this.max);
            }
        }

        // Static
        /** Calculate a new DateTimeSequence
          * @param dataMin - Date representing min of the data range
          * @param dataMax - Date representing max of the data range
          * @param expectedCount - expected number of intervals in the sequence
          * @param unit - of the intervals in the sequence
          */
        public static calculate(dataMin: Date, dataMax: Date, expectedCount: number, unit?: DateTimeUnit): DateTimeSequence {
            if (!unit) { 
                unit = DateTimeSequence.getIntervalUnit(dataMin, dataMax, expectedCount);
            }
            switch (unit) {
                case DateTimeUnit.Year:
                    return DateTimeSequence.calculateYears(dataMin, dataMax, expectedCount);
                case DateTimeUnit.Month:
                    return DateTimeSequence.calculateMonths(dataMin, dataMax, expectedCount);
                case DateTimeUnit.Week:
                    return DateTimeSequence.calculateWeeks(dataMin, dataMax, expectedCount);
                case DateTimeUnit.Day:
                    return DateTimeSequence.calculateDays(dataMin, dataMax, expectedCount);
                case DateTimeUnit.Hour:
                    return DateTimeSequence.calculateHours(dataMin, dataMax, expectedCount);
                case DateTimeUnit.Minute:
                    return DateTimeSequence.calculateMinutes(dataMin, dataMax, expectedCount);
                case DateTimeUnit.Second:
                    return DateTimeSequence.calculateSeconds(dataMin, dataMax, expectedCount);
                case DateTimeUnit.Millisecond:
                    return DateTimeSequence.calculateMilliseconds(dataMin, dataMax, expectedCount);
                default:
                    debug.assertFail("Unsupported DateTimeUnit");
            }
        }

        public static calculateYears(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence {
            debug.assertValue(dataMin, "dataMin");
            debug.assertValue(dataMax, "dataMax");
            debug.assert(!expectedCount || (expectedCount >= DateTimeSequence.MIN_COUNT && expectedCount <= DateTimeSequence.MAX_COUNT), "Expected count is out of range");

            // Calculate range and sequence
            var yearsRange = NumericSequenceRange.calculateDataRange(dataMin.getFullYear(), dataMax.getFullYear(), false);
            var yearsSequence = NumericSequence.calculate(yearsRange, expectedCount, 0);
            var years = yearsSequence.sequence;

            // Convert to date sequence
            var result = new DateTimeSequence(DateTimeUnit.Year);
            for (var i = 0; i < years.length; i++) { 
                var year = years[i];
                if (year) {
                    result.add(new Date(year, 0, 1));
                }
            }
            result.interval = yearsSequence.interval;
            result.intervalOffset = yearsSequence.intervalOffset;
            return result;
        }

        public static calculateMonths(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence {
            debug.assertValue(dataMin, "dataMin");
            debug.assertValue(dataMax, "dataMax");
            debug.assert(expectedCount === undefined || (expectedCount >= DateTimeSequence.MIN_COUNT && expectedCount <= DateTimeSequence.MAX_COUNT), "expected count is out of range");

            // Calculate range
            var minYear = dataMin.getFullYear();
            var maxYear = dataMax.getFullYear();
            var minMonth = dataMin.getMonth();
            var maxMonth = (maxYear - minYear) * 12 + dataMax.getMonth();
            var date = new Date(minYear, 0, 1);
            
            // Calculate month sequence 
            var sequence = NumericSequence.calculateUnits(minMonth, maxMonth, expectedCount, [1, 2, 3, 6, 12]);

            // Convert to date sequence
            var result = DateTimeSequence.fromNumericSequence(date, sequence, DateTimeUnit.Month);
            return result;
        }

        public static calculateWeeks(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence {
            debug.assertValue(dataMin, "dataMin");
            debug.assertValue(dataMax, "dataMax");
            debug.assert(expectedCount === undefined || (expectedCount >= DateTimeSequence.MIN_COUNT && expectedCount <= DateTimeSequence.MAX_COUNT), "expected count is out of range");

            var firstDayOfWeek = 0;
            var minDayOfWeek = dataMin.getDay();
            var dayOffset = (minDayOfWeek - firstDayOfWeek + 7) % 7;
            var minDay = dataMin.getDate() - dayOffset;

            // Calculate range
            var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), minDay);
            var min = 0;
            var max = Double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, DateTimeUnit.Week));

            // Calculate week sequence
            var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 4, 8]);

            // Convert to date sequence
            var result = DateTimeSequence.fromNumericSequence(date, sequence, DateTimeUnit.Week);
            return result;
        }

        public static calculateDays(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence {
            debug.assertValue(dataMin, "dataMin");
            debug.assertValue(dataMax, "dataMax");
            debug.assert(expectedCount === undefined || (expectedCount >= DateTimeSequence.MIN_COUNT && expectedCount <= DateTimeSequence.MAX_COUNT), "expected count is out of range");

            // Calculate range
            var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate());
            var min = 0;
            var max = Double.ceilWithPrecision(DateTimeSequence.getDelta(dataMin, dataMax, DateTimeUnit.Day));
            
            // Calculate day sequence
            var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 7, 14]);

            // Convert to date sequence
            var result = DateTimeSequence.fromNumericSequence(date, sequence, DateTimeUnit.Day);
            return result;
        }

        public static calculateHours(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence {
            debug.assertValue(dataMin, "dataMin");
            debug.assertValue(dataMax, "dataMax");
            debug.assert(expectedCount === undefined || (expectedCount >= DateTimeSequence.MIN_COUNT && expectedCount <= DateTimeSequence.MAX_COUNT), "expected count is out of range");

            // Calculate range
            var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate());
            var min = Double.floorWithPrecision(DateTimeSequence.getDelta(date, dataMin, DateTimeUnit.Hour));
            var max = Double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, DateTimeUnit.Hour));
            
            // Calculate hour sequence
            var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 3, 6, 12, 24]);

            // Convert to date sequence
            var result = DateTimeSequence.fromNumericSequence(date, sequence, DateTimeUnit.Hour);
            return result;
        }

        public static calculateMinutes(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence {
            debug.assertValue(dataMin, "dataMin");
            debug.assertValue(dataMax, "dataMax");
            debug.assert(expectedCount === undefined || (expectedCount >= DateTimeSequence.MIN_COUNT && expectedCount <= DateTimeSequence.MAX_COUNT), "expected count is out of range");

            // Calculate range
            var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate(), dataMin.getHours());
            var min = Double.floorWithPrecision(DateTimeSequence.getDelta(date, dataMin, DateTimeUnit.Minute));
            var max = Double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, DateTimeUnit.Minute));

            // Calculate minutes numeric sequence
            var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 5, 10, 15, 30, 60, 60 * 2, 60 * 3, 60 * 6, 60 * 12, 60 * 24]);

            // Convert to date sequence
            var result = DateTimeSequence.fromNumericSequence(date, sequence, DateTimeUnit.Minute);
            return result;
        }

        public static calculateSeconds(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence {
            debug.assertValue(dataMin, "dataMin");
            debug.assertValue(dataMax, "dataMax");
            debug.assert(expectedCount === undefined || (expectedCount >= DateTimeSequence.MIN_COUNT && expectedCount <= DateTimeSequence.MAX_COUNT), "expected count is out of range");

            // Calculate range
            var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate(), dataMin.getHours(), dataMin.getMinutes());
            var min = Double.floorWithPrecision(DateTimeSequence.getDelta(date, dataMin, DateTimeUnit.Second));
            var max = Double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, DateTimeUnit.Second));

            // Calculate minutes numeric sequence
            var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 5, 10, 15, 30, 60, 60 * 2, 60 * 5, 60 * 10, 60 * 15, 60 * 30, 60 * 60]);

            // Convert to date sequence
            var result = DateTimeSequence.fromNumericSequence(date, sequence, DateTimeUnit.Second);
            return result;
        }

        public static calculateMilliseconds(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence {
            debug.assertValue(dataMin, "dataMin");
            debug.assertValue(dataMax, "dataMax");
            debug.assert(expectedCount === undefined || (expectedCount >= DateTimeSequence.MIN_COUNT && expectedCount <= DateTimeSequence.MAX_COUNT), "expected count is out of range");

            // Calculate range
            var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate(), dataMin.getHours(), dataMin.getMinutes(), dataMin.getSeconds());
            var min = DateTimeSequence.getDelta(date, dataMin, DateTimeUnit.Millisecond);
            var max = DateTimeSequence.getDelta(date, dataMax, DateTimeUnit.Millisecond);
            
            // Calculate milliseconds numeric sequence
            var sequence = NumericSequence.calculate(NumericSequenceRange.calculate(min, max), expectedCount, 0);

            // Convert to date sequence
            var result = DateTimeSequence.fromNumericSequence(date, sequence, DateTimeUnit.Millisecond);
            return result;
        }

        private static fromNumericSequence(date: Date, sequence: NumericSequence, unit: DateTimeUnit) { 
            var result = new DateTimeSequence(unit);
            for (var i = 0; i < sequence.sequence.length; i++) { 
                var x: number = sequence.sequence[i];
                var d: Date = DateTimeSequence.addInterval(date, x, unit);
                result.add(d);
            }
            result.interval = sequence.interval;
            result.intervalOffset = sequence.intervalOffset;
            return result;
        }

        private static addInterval(value: Date, interval: number, unit: DateTimeUnit): Date {
            interval = Math.round(interval);
            switch (unit)
            {
                case DateTimeUnit.Year:
                    return DateUtils.addYears(value, interval);
                case DateTimeUnit.Month:
                    return DateUtils.addMonths(value, interval);
                case DateTimeUnit.Week:
                    return DateUtils.addWeeks(value, interval);
                case DateTimeUnit.Day:
                    return DateUtils.addDays(value, interval);
                case DateTimeUnit.Hour:
                    return DateUtils.addHours(value, interval);
                case DateTimeUnit.Minute:
                    return DateUtils.addMinutes(value, interval);
                case DateTimeUnit.Second:
                    return DateUtils.addSeconds(value, interval);
                case DateTimeUnit.Millisecond:
                    return DateUtils.addMilliseconds(value, interval);
            }
        }

        private static getDelta(min: Date, max: Date, unit: DateTimeUnit): number {
            var delta: number = 0;
            switch (unit) {
                case DateTimeUnit.Year:
                    delta = max.getFullYear() - min.getFullYear();
                    break;
                case DateTimeUnit.Month:
                    delta = (max.getFullYear() - min.getFullYear()) * 12 + max.getMonth() - min.getMonth();
                    break;
                case DateTimeUnit.Week:
                    delta = (max.getTime() - min.getTime()) / (7 * 24 * 3600000);
                    break;
                case DateTimeUnit.Day:
                    delta = (max.getTime() - min.getTime()) / (24 * 3600000);
                    break;
                case DateTimeUnit.Hour:
                    delta = (max.getTime() - min.getTime()) / 3600000;
                    break;
                case DateTimeUnit.Minute:
                    delta = (max.getTime() - min.getTime()) / 60000;
                    break;
                case DateTimeUnit.Second:
                    delta = (max.getTime() - min.getTime()) / 1000;
                    break;
                case DateTimeUnit.Millisecond:
                    delta = max.getTime() - min.getTime();
                    break;
            }
            return delta;
        }

        public static getIntervalUnit(min:Date, max:Date, maxCount: number): DateTimeUnit {
            maxCount = Math.max(maxCount, 2);
            var totalDays = DateTimeSequence.getDelta(min, max, DateTimeUnit.Day);            
            if (totalDays > 356 && totalDays >= 30 * 6 * maxCount)
                return DateTimeUnit.Year;
            if (totalDays > 60 && totalDays > 7 * maxCount)
                return DateTimeUnit.Month;
            if (totalDays > 14 && totalDays > 2 * maxCount)
                return DateTimeUnit.Week;
            var totalHours = DateTimeSequence.getDelta(min, max, DateTimeUnit.Hour);
            if (totalDays > 2 && totalHours > 12 * maxCount)
                return DateTimeUnit.Day;
            if (totalHours >= 24 && totalHours >= maxCount)
                return DateTimeUnit.Hour;
            var totalMinutes = DateTimeSequence.getDelta(min, max, DateTimeUnit.Minute);
            if (totalMinutes > 2 && totalMinutes >= maxCount)
                return DateTimeUnit.Minute;
            var totalSeconds = DateTimeSequence.getDelta(min, max, DateTimeUnit.Second);
            if (totalSeconds > 2 && totalSeconds >= 0.8 * maxCount)
                return DateTimeUnit.Second;
            var totalMilliseconds = DateTimeSequence.getDelta(min, max, DateTimeUnit.Millisecond);
            if (totalMilliseconds > 0)
                return DateTimeUnit.Millisecond;
  
            // If the size of the range is 0 we need to guess the unit based on the date's non-zero values starting with milliseconds
            var date = min;
            if (date.getMilliseconds() !== 0)
                return DateTimeUnit.Millisecond;
            if (date.getSeconds() !== 0)
                return DateTimeUnit.Second;
            if (date.getMinutes() !== 0)
                return DateTimeUnit.Minute;
            if (date.getHours() !== 0)
                return DateTimeUnit.Hour;
            if (date.getDate() !== 1)
                return DateTimeUnit.Day;
            if (date.getMonth() !== 0)
                return DateTimeUnit.Month;
            
            return DateTimeUnit.Year;
        }
    }

    /** DateUtils module provides DateTimeSequence with set of additional date manipulation routines */
    export module DateUtils { 
        var MonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var MonthDaysLeap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        /** Returns bool indicating weither the provided year is a leap year.
          * @param year - year value
          */
        function isLeap(year: number): boolean { 
            return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
        }

        /** Returns number of days in the provided year/month.
          * @param year - year value
          * @param month - month value
          */
        function getMonthDays(year: number, month: number) { 
            return isLeap(year) ? MonthDaysLeap[month] : MonthDays[month];
        }

        /** Adds a specified number of years to the provided date.
          * @param date - date value
          * @param yearDelta - number of years to add
          */
        export function addYears(date: Date, yearDelta: number): Date { 
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();
            var isLeapDay = month === 2 && day === 29;

            var result = new Date(date.getTime());
            var year = year + yearDelta;
            if (isLeapDay && !isLeap(year)) {
                day = 28;
            } 
            result.setFullYear(year, month, day);
            return result;
        }

        /** Adds a specified number of months to the provided date.
          * @param date - date value
          * @param monthDelta - number of months to add
          */
        export function addMonths(date: Date, monthDelta: number): Date { 
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();
           
            var result = new Date(date.getTime());
            year += (monthDelta - (monthDelta % 12)) / 12;
            month += monthDelta % 12;

            // VSTS 1325771: Certain column charts don't display any data
            // Wrap arround the month if is after december (value 11)
            if (month > 11) {
                month = month % 12;
                year++;
            }

            day = Math.min(day, getMonthDays(year, month));
            result.setFullYear(year, month, day);
            return result;
        }

        /** Adds a specified number of weeks to the provided date.
          * @param date - date value
          * @param weekDelta - number of weeks to add
          */
        export function addWeeks(date: Date, weeks: number): Date { 
            return addDays(date, weeks * 7);
        }

        /** Adds a specified number of days to the provided date.
          * @param date - date value
          * @param dayDelta - number of days to add
          */
        export function addDays(date: Date, days: number): Date { 
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();           
            var result = new Date(date.getTime());
            result.setFullYear(year, month, day + days);
            return result;
        }

        /** Adds a specified number of hours to the provided date.
          * @param date - date value
          * @param hours - number of hours to add
          */
        export function addHours(date: Date, hours: number): Date { 
            return new Date(date.getTime() + hours * 3600000);
        }

        /** Adds a specified number of minutes to the provided date.
          * @param date - date value
          * @param minutes - number of minutes to add
          */
        export function addMinutes(date: Date, minutes: number): Date { 
            return new Date(date.getTime() + minutes * 60000);
        }

        /** Adds a specified number of seconds to the provided date.
          * @param date - date value
          * @param seconds - number of seconds to add
          */
        export function addSeconds(date: Date, seconds: number): Date { 
            return new Date(date.getTime() + seconds * 1000);
        }

        /** Adds a specified number of milliseconds to the provided date.
          * @param date - date value
          * @param milliseconds - number of milliseconds to add
          */
        export function addMilliseconds(date: Date, milliseconds: number): Date { 
            return new Date(date.getTime() + milliseconds);
        }
    }
}