//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    export declare var telemetrySamplingRules: any;
    export declare var build;

    export function createTelemetryService(hostService: ITelemetryHostService): ITelemetryService {
        return new TelemetryService(hostService);
    }

    export class PerfEvent {
        scopeId: number;
        telemetryEvent: IDeferredTelemetryEvent;
        parentTelemetryId: string;
        childCount: number;
        resolved: boolean;
    }

    /// <disable>JS2055.DoNotReferenceBannedTerms</disable>
    // Justification: ModernCop doesn't like the use of the 'arguments' variable in the JavaScript
    // generated for methods that have at least one parameter before rest parameters.
    // Example: myMethod(a: any, ...b: any[]). We know the variable is used correctly, so it's safe
    // to suppress the error. Also, this suppression has the minimal possible scope where the
    // TypeScript compiler won't discard the disable/enable comments.
    class TelemetryService implements ITelemetryService {
        private sessionExpirationTimerId: number;
        private hostData: TelemetryHostData;
        private loggerServices: ILoggerService[];
        private isSuspended: boolean;

        // The timeout in ms after which a users session will expire if no user activity has occurred
        private static SessionTimeout: number = 30 * 60 * 1000;

        constructor(telemetryHost: ITelemetryHostService) {
            this.loggerServices = telemetryHost ? telemetryHost.getLoggerServices() : [];
            this.hostData = telemetryHost ? telemetryHost.getHostData() : {};
            this.startSession();
            this.startSessionTimeout();
            this.isSuspended = false;
            this.perfEvents = [];
        }

        private startSession() {
            // Start or reset loggers
            for (var i = 0, len = this.loggerServices.length; i < len; i++)
                this.loggerServices[i].initialize(this.hostData);

            // TODO: Before the telemetry service is shared outside of the dashboard the root event needs to be customizable
            this._rootEvent = telemetry.DashboardRootSession('', false);
            this.logEventInternal(this._rootEvent);
        }

        private startSessionTimeout() {
            // TODO: evaluate the following if it is needed; it seems wrong.
            this.sessionExpirationTimerId = window.setTimeout(() => {
                // reset session id
                this.hostData.sessionId = jsCommon.Utility.generateGuid();
                this.startSession();
            }, TelemetryService.SessionTimeout);
        }

        private resetSessionTimeout() {
            window.clearTimeout(this.sessionExpirationTimerId);
            this.startSessionTimeout();
        }

        public suspend(): void {
            this.isSuspended = true;
            window.clearTimeout(this.sessionExpirationTimerId);
        }

        public resume(): void {
            this.isSuspended = false;
            this.resetSessionTimeout();
        }

        // Collection of perfEvent dependencies
        private perfEvents: PerfEvent[];

        // Remove an event based on the telemetry event id
        private removeEvent(eventId: string): boolean {
            for (var i = 0, len = this.perfEvents.length; i < len; i++) {
                if (this.perfEvents[i].telemetryEvent.event.id === eventId) {
                    this.perfEvents[i].resolved = true;

                    // Only remove the event if it has no children
                    if (this.perfEvents[i].childCount === 0) {
                        this.perfEvents.splice(i, 1);
                        return true;
                    }
                    return false;
                }
            }
        }

        // Remove an event based on the scope ID -- this is for perf activities that don't have associated telemetry events
        // This method should be the exact same as the removeEvent method except for comparing scopeId instead of eventId
        private removeScopeEvent(scopeId: number): boolean {
            for (var i = 0, len = this.perfEvents.length; i < len; i++) {
                if (this.perfEvents[i].scopeId === scopeId) {
                    this.perfEvents[i].resolved = true;
                    if (this.perfEvents[i].childCount === 0) {
                        this.perfEvents.splice(i, 1);
                        return true;
                    }
                    return false;
                }
            }
        }

        // Removes the first dependency on 'eventType' from the collection
        // If this is the last dependency for an event, resolve the parent event
        private resolveParent(parentEventId: string): void {
            for (var i = 0, len = this.perfEvents.length; i < len; i++) {
                // This is the matching parent event
                if (this.perfEvents[i].telemetryEvent.event.id === parentEventId) {
                    // Decrement the dependency and verify that the parent already resolved itself before calling resolve
                    if (--this.perfEvents[i].childCount === 0 && this.perfEvents[i].resolved) {
                        this.perfEvents[i].telemetryEvent.resolve();
                    }
                    return;
                }
            }
        }

        // Force resolution of a perf event in case a component on a scope starts a new event without resolving the old one
        private forceResolve(scopeId: number): void {
            for (var i = 0, len = this.perfEvents.length; i < len; i++) {
                if (this.perfEvents[i].scopeId === scopeId) {
                    this.perfEvents[i].childCount = 0;

                    // Do a reject instead of a resolve so we know that there was some 'error' condition
                    this.perfEvents[i].telemetryEvent.reject();
                    return;
                }
            }
        }

        // Start a perf-focused event that depends on tracking some number of child events (dependents)
        public startPerfEvent(scope, eventFactory: Function, ...args: any[]): IDeferredTelemetryEvent {
            // Glob contains parentEvent and dependents -- See if any events are registered to listen to this type of event
            var tempEvent: IDeferredTelemetryEvent;

            // Find parent ID
            var parentEventId: string = null;
            var perfEventCount = this.perfEvents.length;
            if (scope && perfEventCount > 0) {

                // Explicitly resolve any unresolved events on the incoming scope
                this.forceResolve(scope.$id);
                // The above call could have removed an item from perfEvents so the count should be updated just in case
                perfEventCount = this.perfEvents.length;
                var parentScope = scope.$parent;

                // Iterate up the scope chain until you reach the top or find a parent telemetry event
                while (parentScope && !parentEventId) {
                    var id = parentScope.$id;

                    // For a given scope Id, iterate over the existing perf events to see if the scope matches
                    for (var i = 0; i < perfEventCount; i++) {
                        // The scope needs to match AND there needs to be a valid event.id to parent to
                        if (this.perfEvents[i].scopeId === id && this.perfEvents[i].telemetryEvent.event.id) {
                            parentEventId = this.perfEvents[i].telemetryEvent.event.id;

                            // Increment the dependency count for the parent event
                            this.perfEvents[i].childCount++;
                            break;
                        }
                    }
                    parentScope = parentScope.$parent;
                }
            }

            // If there was a parent, use its ID, otherwise use the root id.
            if (parentEventId) {
                args.push(parentEventId);
            }
            else
                args.push(this.root.id);

            // Create a fake/empty event for perf calls that don't want to log telemetry, but want to use the dependency tracking
            // The dummy event needs an 'info' object so that it can call 'reject' 
            var event: ITelemetryEvent = <ITelemetryEvent>{ info: {}};
            if (eventFactory) {
                event = eventFactory.apply(null, args);
                this.startTimedEventInternal(event);
            }
          
            var eventTimeout;

            // This event will be returned to be resolved or rejected
            tempEvent = new DeferredTelemetryEvent(event,(e) => {
                // Try to remove the event from the list of outstanding events -- this will fail if the event has any children
                // If there is an event.id, search for the matching event
                if (event.id) {
                    if (!this.removeEvent(event.id))
                        return;
                }
                // For events without an id, try to remove the event by the scope.$id
                else {
                    if (!this.removeScopeEvent(scope.$id))
                        return;
                }

                // End the timed telemetry event
                if (eventFactory)
                    this.endTimedEventInternal(e);

                // If there is a parent event, remove this event as a dependency
                if (parentEventId)
                    this.resolveParent(parentEventId);

                if (eventTimeout)
                    window.clearTimeout(eventTimeout);
            });

            // Create a timeout to resolve this if it takes too long (more than 2 minutes?)
            eventTimeout =  window.setTimeout(() => {
                this.forceResolve(scope.$id);
            }, 120000);

            // Create a perfEvent to add to the collection of pending perf activities
            var perfEvent: PerfEvent = {
                scopeId: scope ? scope.$id : null,
                telemetryEvent: tempEvent,
                parentTelemetryId: parentEventId,
                childCount: 0,
                resolved: false
            };

            this.perfEvents.push(perfEvent);

            return tempEvent;
        }

        /** Log telemetry event **/
        logEvent(eventFactory: ITelemetryEventFactory): ITelemetryEvent;
        logEvent<T>(eventFactory: ITelemetryEventFactory1<T>, arg: T): ITelemetryEvent;
        logEvent<T1, T2>(eventFactory: ITelemetryEventFactory2<T1, T2>, arg1: T1, arg2: T2): ITelemetryEvent;
        logEvent<T1, T2, T3>(eventFactory: ITelemetryEventFactory3<T1, T2, T3>, arg1: T1, arg2: T2, arg3: T3): ITelemetryEvent;
        logEvent<T1, T2, T3, T4>(eventFactory: ITelemetryEventFactory4<T1, T2, T3, T4>, arg1: T1, arg2: T2, arg3: T3, arg4: T4): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5>(eventFactory: ITelemetryEventFactory5<T1, T2, T3, T4, T5>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6>(eventFactory: ITelemetryEventFactory6<T1, T2, T3, T4, T5, T6>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6, T7>(eventFactory: ITelemetryEventFactory7<T1, T2, T3, T4, T5, T6, T7>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): ITelemetryEvent;
        public logEvent(eventFactory: Function, ...args: any[]): ITelemetryEvent {
            // TODO 5000346 - here and in the other log methods - validate number of arguments and that they are defined
            debug.assertValue(eventFactory, 'eventFactory');

            args.push(/*parentActivityId*/ this.root.id);
            var event: ITelemetryEvent = eventFactory.apply(null, args);
            this.logEventInternal(event);
            return event;
        }

        /** Log child telemetry event */
        logChildEvent(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory): ITelemetryEvent;
        logChildEvent<T>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory1<T>, arg: T): ITelemetryEvent;
        logChildEvent<T1, T2>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory2<T1, T2>, arg1: T1, arg2: T2): ITelemetryEvent;
        logChildEvent<T1, T2, T3>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory3<T1, T2, T3>, arg1: T1, arg2: T2, arg3: T3): ITelemetryEvent;
        logChildEvent<T1, T2, T3, T4>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory4<T1, T2, T3, T4>, arg1: T1, arg2: T2, arg3: T3, arg4: T4): ITelemetryEvent;
        logChildEvent<T1, T2, T3, T4, T5>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory5<T1, T2, T3, T4, T5>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): ITelemetryEvent;
        logChildEvent<T1, T2, T3, T4, T5, T6>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory6<T1, T2, T3, T4, T5, T6>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): ITelemetryEvent;
        logChildEvent<T1, T2, T3, T4, T5, T6, T7>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory7<T1, T2, T3, T4, T5, T6, T7>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): ITelemetryEvent;
        public logChildEvent(parent: ITelemetryEvent, eventFactory: Function, ...args: any[]): ITelemetryEvent {
            debug.assertValue(parent, 'parent');
            debug.assertValue(eventFactory, 'eventFactory');

            args.push(/*parentActivityId*/ parent.id);
            var event: ITelemetryEvent = eventFactory.apply(null, args);
            this.logEventInternal(event);
            return event;
        }

        /** Starts recording a timed event **/
        startEvent(eventFactory: ITelemetryEventFactory): IDeferredTelemetryEvent;
        startEvent<T>(eventFactory: ITelemetryEventFactory1<T>, arg: T): IDeferredTelemetryEvent;
        startEvent<T1, T2>(eventFactory: ITelemetryEventFactory2<T1, T2>, arg1: T1, arg2, T2): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3>(eventFactory: ITelemetryEventFactory3<T1, T2, T3>, arg1: T1, arg2: T2, arg3: T3): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4>(eventFactory: ITelemetryEventFactory4<T1, T2, T3, T4>, arg1: T1, arg2: T2, arg3: T3, arg4: T4): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5>(eventFactory: ITelemetryEventFactory5<T1, T2, T3, T4, T5>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5, T6>(eventFactory: ITelemetryEventFactory6<T1, T2, T3, T4, T5, T6>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5, T6, T7>(eventFactory: ITelemetryEventFactory7<T1, T2, T3, T4, T5, T6, T7>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): IDeferredTelemetryEvent;
        public startEvent(eventFactory: Function, ...args: any[]): IDeferredTelemetryEvent {
            debug.assertValue(eventFactory, 'eventFactory');

            args.push(/*parentActivityId*/ this.root.id);
            var event: ITelemetryEvent = eventFactory.apply(null, args);
            this.startTimedEventInternal(event);
            return new DeferredTelemetryEvent(event, e => this.endTimedEventInternal(e));
        }

        /** Starts recording a timed event **/
        startChildEvent(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory): IDeferredTelemetryEvent;
        startChildEvent<T>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory1<T>, arg: T): IDeferredTelemetryEvent;
        startChildEvent<T1, T2>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory2<T1, T2>, arg1: T1, arg2, T2): IDeferredTelemetryEvent;
        startChildEvent<T1, T2, T3>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory3<T1, T2, T3>, arg1: T1, arg2: T2, arg3: T3): IDeferredTelemetryEvent;
        startChildEvent<T1, T2, T3, T4>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory4<T1, T2, T3, T4>, arg1: T1, arg2: T2, arg3: T3, arg4: T4): IDeferredTelemetryEvent;
        startChildEvent<T1, T2, T3, T4, T5>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory5<T1, T2, T3, T4, T5>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): IDeferredTelemetryEvent;
        startChildEvent<T1, T2, T3, T4, T5, T6>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory6<T1, T2, T3, T4, T5, T6>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): IDeferredTelemetryEvent;
        startChildEvent<T1, T2, T3, T4, T5, T6, T7>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory7<T1, T2, T3, T4, T5, T6, T7>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): IDeferredTelemetryEvent;
        public startChildEvent(parent: ITelemetryEvent, eventFactory: Function, ...args: any[]): IDeferredTelemetryEvent {
            debug.assertValue(parent, 'parent');
            debug.assertValue(eventFactory, 'eventFactory');

            args.push(/*parentActivityId*/ parent.id);
            var event: ITelemetryEvent = eventFactory.apply(null, args);
            this.startTimedEventInternal(event);
            return new DeferredTelemetryEvent(event, e => this.endTimedEventInternal(e));
        }

        public logTrace(trace: jsCommon.TraceItem): void {
            debug.assertValue(trace, 'trace');
            var event = powerbi.telemetry.Trace(trace.type, trace.text);
            this.logEventInternal(event);
        }

        /** <DEPRECATED> Log Telemetry event. This method is deprecated, recommend calling log or logChild instead. */
        public logEventDeprecated(event: ITelemetryEvent): void {
            this.logEventInternal(event);
        }

        private startTimedEventInternal(event: ITelemetryEvent): void {
            this.resetSessionTimeout();
            var loggerServices = this.getLoggerServices();
            for (var i = 0, len = loggerServices.length; i < len; i++)
                loggerServices[i].startTimedEvent(event);
        }

        private endTimedEventInternal(event: ITelemetryEvent): void {
            this.resetSessionTimeout();
            var loggerServices = this.getLoggerServices();
            for (var i = 0, len = loggerServices.length; i < len; i++)
                loggerServices[i].endTimedEvent(event);
        }

        private logEventInternal(event: ITelemetryEvent): void {
            // Uncomment to debug telemetry log events
            // console.log(event.name, event.getFormattedInfoObject(), event.time);

            this.resetSessionTimeout();
            var loggerServices = this.getLoggerServices();
            for (var i = 0, len = loggerServices.length; i < len; i++)
                loggerServices[i].logEvent(event);
        }

        public get sessionId() {
            return this.hostData.sessionId;
        }

        private _rootEvent: ITelemetryEvent;
        public get root(): ITelemetryEvent {
            return this._rootEvent;
        }

        private getLoggerServices(): ILoggerService[] {
            if (this.isSuspended)
                return [];

            return this.loggerServices;
        }
    }
    // This needs to stay at the end of the TelemetryService class to ensure that the ModernCop
    // suppression has the right scope.
    /// <enable>JS2055.DoNotReferenceBannedTerms</enable>

    // NOTE: Consider using $q to address the issues with the Angular digest chain being broken.  This can be done either in
    // this class, or in the TelemetryService above.
    class DeferredTelemetryEvent implements IDeferredTelemetryEvent {
        public event: ITelemetryEvent;
        private end: (event: ITelemetryEvent) => void;

        constructor(event: ITelemetryEvent, end: (event: ITelemetryEvent) => void) {
            debug.assertValue(event, 'event');
            debug.assertValue(end, 'end');

            this.event = event;
            this.end = end;
        }

        public resolve(): void {
            this.end(this.event);
        }

        public reject(): void {
            var event = this.event;
            event.info.isError = true;

            this.end(event);
        }
    }
}
