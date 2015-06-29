//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    export var localytics: ILocalytics;
    declare var LocalyticsSession;

    /** Defines the Localytics interface */
    export interface ILocalytics {
        tagEvent? (event: string, properties: any): void;
        tagScreen? (screenName: string): void;
        setCustomDimension? (id: number, name: string): void;
        open? (): void;
        setCustomerId? (customerId: string): void;
    }

    export class LocalyticsService implements ILoggerService {
        private hostData: TelemetryHostData;
        private idleTimer: IIdleCallbackTimer;
        private eventQueue: { (): void; }[];
        private localyticsSdk: ILocalytics;
        private document: any;

        private static namespace: string = 'PowerBI';
        // The localytics cookie is '__ll_' + namespace + '_iu'
        private static localyticsUserIdCookie: string = '__ll_PowerBI_iu';
        private static localyticsSessionIdCookie: string = '__ll_PowerBI_csu';

        /**
        * Constructs the localytics logging service.
        * @param localyticsAppKey Application key used via Localytics.
        * @param idleTimer Callback timer to use to detect idle events.
        * @param localyticsSdk Optional reference to the localytics SDK to enable unit testing mocks. If not specified the default production localytics service will be used.
        * @param documentReplacment Optional reference to 'document' to enable unit testing mocks. If not specified 'document' will be used.
        */
        constructor(localyticsAppKey: string, idleTimer: IIdleCallbackTimer, localyticsSdk?: ILocalytics, documentReplacment?: any) {
            var self = this;
            self.idleTimer = idleTimer;

            // localyticsSdk and document are passed to enable unit testing
            if (localyticsSdk) {
                // If an instance of the loclaytics SDK is passed (chances are unit testing) use it
                self.localyticsSdk = localyticsSdk;
            } else {
                // Initialization occurs in background, events will be queued until then
                try {
                    self.localyticsSdk = LocalyticsSession(localyticsAppKey, { logger: false, namespace: LocalyticsService.namespace });
                } catch (e) {
                }
            }

            this.document = documentReplacment ? documentReplacment : document;

            this.eventQueue = [];
            if (self.idleTimer) {
                this.idleTimer.addCallback(function () {
                    // Only dispatch an event if the SDK is loaded
                    if (self.eventQueue.length > 0) {
                        var event = self.eventQueue.shift();
                        event();
                    }
                });
            }

            // Attempt to send any remaining events - not guaranteed to fire
            $(document).on('beforeunload', null, self, function () {
                if (self.idleTimer) {
                    // Trying to dispatch message while the SDK is still loading will trigger errors
                    while (self.eventQueue.length > 0) {
                        var event = self.eventQueue.shift();
                        event();
                    }
                }
            });
        }

        public initialize(hostData: TelemetryHostData): void {
            this.hostData = hostData;
            var self = this;

            // Queue setting of localytics ID, custom dimensions
            // need to ensure that localytics is loaded
            self.executeOrQueue(self, function () {
                self.document.cookie = self.getCookieString(self.document.location.hostname, LocalyticsService.localyticsSessionIdCookie, '"' + hostData.sessionId + '"');

                // Localtics stores the user identifier in a local cookie INSTALL_UUID 
                // overriding this before localytics loads so the localytics definition of a
                // user matches the Power BI definition
                var hashedUserId = getHashCode(hostData.userId);
                var localyticsUserGuid = '"11111111-1111-1111-1111-11' + hashedUserId + '"';
                self.document.cookie = self.getCookieString(self.document.location.hostname, LocalyticsService.localyticsUserIdCookie, localyticsUserGuid);
                self.localyticsSdk.open();

                if (hostData.isInternalUser) {
                    self.localyticsSdk.setCustomDimension(0, "MSFT");
                } else {
                    self.localyticsSdk.setCustomDimension(0, "External");
                }
            });
        }

        public getType(): number {
            return LoggerServiceType.Localytics;
        }

        private getCookieString(url: any, key: string, value: string) {
            var domainMatch = url.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i);
            var domain = domainMatch ? domainMatch[0] : '';

            var cookieText = key + '=' + value + ';' +
                'domain=.' + domain + ';' +
                'max-age=max-age-in-seconds=2592000';

            return cookieText;
        }

        /** Log telemetry event **/
        public logEvent(eventData: ITelemetryEvent): void {
            var self = this;
            var hostData = this.hostData;
            var properties = $.extend({}, eventData.getFormattedInfoObject(), {
                client: hostData.client,
                version: hostData.build,
                cluster: hostData.cluster,

                // Temporary properties
                activityId: eventData.id,
                hashedUuid: getHashCode(hostData.userId),
                isInternal: hostData.isInternalUser
            });

            // Handles QnA which optionally attaches a 'duration' property to events, but doesn't call start/EndTimedEvent
            if (properties.duration && typeof properties.duration === 'number') {
                properties.duration = self.bucketTime(properties.duration);
            }

            self.executeOrQueue(self, function () {
                self.localyticsSdk.tagEvent(eventData.name, properties);
            });
        }

        /** Starts receording a timed event **/
        public startTimedEvent(eventData: ITelemetryEvent): void { }

        /** Log a timed event **/
        public endTimedEvent(eventData: ITelemetryEvent): void {
            var self = this;
            var hostData = this.hostData;

            var properties = $.extend({}, eventData.getFormattedInfoObject(), {
                duration: self.bucketTime(Date.now() - eventData.time),
                client: hostData.client,
                version: hostData.build,
                cluster: hostData.cluster,

                // Temporary properties
                activityId: eventData.id,
                hashedUuid: getHashCode(hostData.userId),
                isInternal: hostData.isInternalUser
            });

            self.executeOrQueue(self, function () {
                self.localyticsSdk.tagEvent(eventData.name, properties);
            });
        }

        private bucketTime(duration: number): string {
            // Localytics doesn't enable performing arbitary calculations on event properties, there is no way of making use of
            // start and event values. Calculating the elapsed time and bucketing using response time targets as
            // defined by the perf team (based on Jakob Nielsen's response times)
            // http://www.nngroup.com/articles/response-times-3-important-limits/

            var bucketedDuration = "1min+";

            if (duration < 10) {
                bucketedDuration = "< 10ms";
            } else if (duration < 100) {
                bucketedDuration = (Math.floor(duration / 10) * 10) + "ms";
            } else if (duration < 1000) {
                bucketedDuration = (Math.floor(duration / 100) * 100) + "ms";
            } else if (duration < 5000) {
                bucketedDuration = Math.floor(duration / 1000) + "s";
            } else if (duration <= 10000) {
                bucketedDuration = "5 - 10s";
            } else if (duration <= 60000) {
                bucketedDuration = "10 - 60s";
            }

            return bucketedDuration;
        }

        private executeOrQueue(self: LocalyticsService, fn: any): void {
            if (self.idleTimer) {
                self.eventQueue.push(function () {
                    try {
                        fn();
                    } catch (e) {
                    }
                });
            } else {
                fn();
            }
        }
    }
}
