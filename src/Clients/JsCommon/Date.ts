//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module jsCommon {
    /** Extensions to Date class */
    export module DateExtensions {
        var datePrefix: string = '/Date(';
        var dateSuffix: string = ')\/';

        /** Formats the date, omitting the time portion, if midnight. */
        export function formatAbsolute(date: Date): string {
            debug.assertValue(date, 'date');

            if (DateExtensions.isMidnight(date)) {
                return date.toLocaleDateString();
            }

            return date.toLocaleString();
        }

        /** Formats the date, preferably showing the elapsed time if possible, falling back on an absolute date. */
        export function formatPretty(date: Date): string {
            debug.assertValue(date, 'date');

            if (DateExtensions.isMomentPresent()) {
                return moment(date).fromNow();
            }

            return formatAbsolute(date);
        }

        var milisecondsPerHour: number = 3600 * 1000;
        var millisecondsPerDay: number = 24 * milisecondsPerHour;

        /** Gets a value indicating whether the specified date has a midnight time portion. */
        export function isMidnight(date: Date) {
            debug.assertValue(date, 'date');

            return (date.getTime() % millisecondsPerDay) === 0;
        }

        /** returns the number of elapsed seconds from a given date to now. */
        export function elapsedToNow(date: Date, units: string): number {
            debug.assertValue(date, 'date');
            var from = moment(date);
            return (moment().diff(from, units));
        }

        /** Returns whether moment is present */
        export function isMomentPresent(): boolean {
            return typeof moment !== 'undefined';
        }

        /** 
         * Parses an ISO 8601 formatted date string and creates a Date object.
         * If timezone information is not present in the date the local timezone will be assumed.
         */
        export function parseIsoDate(isoDate: string): Date {
            debug.assert(isMomentPresent(), 'Moment.js should be loaded for parseIsoDate.');

            return moment(isoDate).toDate();
        }

        export function parseUtcDate(isoDate: string): Date {
            debug.assert(isMomentPresent(), 'Moment.js should be loaded for parseIsoDate.');

            return moment.utc(isoDate).toDate();
        }

        export function fromNow(date: Date) {
            return moment(date).fromNow();
        }

        export function serializeDate(date: Date): string {
            debug.assertValue(date, 'date');
            return datePrefix + date.getTime().toString() + dateSuffix;
        }

        export function deserializeDate(data: string): Date {
            Utility.throwIfNullOrEmptyString(data, null, 'deserializeDate', 'Cannot deserialize empty string');
            Utility.throwIfNotTrue(
                data.indexOf(datePrefix) === 0 && StringExtensions.endsWith(data, dateSuffix),
                null,
                'deserializeDate',
                'Cannot deserialize empty string');

            if (DateExtensions.isMomentPresent()) {
                // Prefer to use moment, which has a more complete implementation.
                var parsedValue = moment(data);
                Utility.throwIfNotTrue(
                    parsedValue.isValid(),
                    null,
                    'deserializeDate',
                    'parsedValue.isValid must be true');

                return parsedValue.toDate();
            }

            var ticksString = data.substring(datePrefix.length, data.length - dateSuffix.length);
            Utility.throwIfNotTrue(
                /^\-?\d+$/.test(ticksString),
                null,
                'deserializeDate',
                'Cannot deserialize invalid date');

            var ticksValue: number = parseInt(ticksString, 10);
            Utility.throwIfNotTrue(
                !isNaN(ticksValue),
                null,
                'deserializeDate',
                'Cannot deserialize invalid date');

            return new Date(ticksValue);
        }

        export function tryDeserializeDate(data: string): Date {
            try
            {
                return deserializeDate(data);
            } catch (e) { }
        }
    }
}