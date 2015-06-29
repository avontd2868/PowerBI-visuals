//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    /** Interface for logger service */
    export interface ILoggerService {
        getType(): number;

        /** Initialize logger service. it is called before events are logged. This method might be called more than once */
        initialize(hostData: TelemetryHostData): void;

        /** Log telemetry event **/
        logEvent(eventData: ITelemetryEvent): void;

        /** Starts receording a timed event **/
        startTimedEvent(eventData: ITelemetryEvent): void;

        /** Log a timed event **/
        endTimedEvent(eventData: ITelemetryEvent): void;
    }

    export interface TelemetryHostData {
        sessionId?: string;
        client?: string;
        build?: string;
        cluster?: string;
        userId?: string;
        isInternalUser?: boolean;
    }

    /** The interfaces that the TelemetryService need from the host */
    export interface ITelemetryHostService {
        getLoggerServices(): ILoggerService[];
        getHostData(): TelemetryHostData;
    }

    /** Interface for instrumentation service */
    // !!! If you update the below interface, update the copy in the Power View source.
    // TODO 3028710: Merge with the definition in the Power View project
    export interface ITelemetryService extends jsCommon.ITraceListener{
        /** Gets the root event. */
        root: ITelemetryEvent;

        /** Session Id **/
        sessionId: string;

        /** Suspend capturing telemetry events **/
        suspend(): void;
        
        /** Resume capturing telemery events **/
        resume(): void;

        /** Log Telemetry event */
        logEvent(eventFactory: ITelemetryEventFactory): ITelemetryEvent;
        logEvent<T>(eventFactory: ITelemetryEventFactory1<T>, arg: T): ITelemetryEvent;
        logEvent<T1, T2>(eventFactory: ITelemetryEventFactory2<T1, T2>, arg1: T1, arg2: T2): ITelemetryEvent;
        logEvent<T1, T2, T3>(eventFactory: ITelemetryEventFactory3<T1, T2, T3>, arg1: T1, arg2: T2, arg3: T3): ITelemetryEvent;
        logEvent<T1, T2, T3, T4>(eventFactory: ITelemetryEventFactory4<T1, T2, T3, T4>, arg1: T1, arg2: T2, arg3: T3, arg4: T4): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5>(eventFactory: ITelemetryEventFactory5<T1, T2, T3, T4, T5>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6>(eventFactory: ITelemetryEventFactory6<T1, T2, T3, T4, T5, T6>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6, T7>(eventFactory: ITelemetryEventFactory7<T1, T2, T3, T4, T5, T6, T7>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): ITelemetryEvent;

        /** Log child telemetry event */
        logChildEvent(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory): ITelemetryEvent;
        logChildEvent<T>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory1<T>, arg: T): ITelemetryEvent;
        logChildEvent<T1, T2>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory2<T1, T2>, arg1: T1, arg2: T2): ITelemetryEvent;
        logChildEvent<T1, T2, T3>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory3<T1, T2, T3>, arg1: T1, arg2: T2, arg3: T3): ITelemetryEvent;
        logChildEvent<T1, T2, T3, T4>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory4<T1, T2, T3, T4>, arg1: T1, arg2: T2, arg3: T3, arg4: T4): ITelemetryEvent;
        logChildEvent<T1, T2, T3, T4, T5>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory5<T1, T2, T3, T4, T5>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): ITelemetryEvent;
        logChildEvent<T1, T2, T3, T4, T5, T6>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory6<T1, T2, T3, T4, T5, T6>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): ITelemetryEvent;
        logChildEvent<T1, T2, T3, T4, T5, T6, T7>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory7<T1, T2, T3, T4, T5, T6, T7>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): ITelemetryEvent;

        /** Starts recording a timed event, which is completed by using the returned promise. */
        startEvent(eventFactory: ITelemetryEventFactory): IDeferredTelemetryEvent;
        startEvent<T>(eventFactory: ITelemetryEventFactory1<T>, arg: T): IDeferredTelemetryEvent;
        startEvent<T1, T2>(eventFactory: ITelemetryEventFactory2<T1, T2>, arg1: T1, arg2: T2): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3>(eventFactory: ITelemetryEventFactory3<T1, T2, T3>, arg1: T1, arg2: T2, arg3: T3): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4>(eventFactory: ITelemetryEventFactory4<T1, T2, T3, T4>, arg1: T1, arg2: T2, arg3: T3, arg4: T4): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5>(eventFactory: ITelemetryEventFactory5<T1, T2, T3, T4, T5>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5, T6>(eventFactory: ITelemetryEventFactory6<T1, T2, T3, T4, T5, T6>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5, T6, T7>(eventFactory: ITelemetryEventFactory7<T1, T2, T3, T4, T5, T6, T7>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): IDeferredTelemetryEvent;

        /** Starts recording a child timed event, which is completed by using the returned promise. */
        startChildEvent(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory): IDeferredTelemetryEvent;
        startChildEvent<T>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory1<T>, arg: T): IDeferredTelemetryEvent;
        startChildEvent<T1, T2>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory2<T1, T2>, arg1: T1, arg2: T2): IDeferredTelemetryEvent;
        startChildEvent<T1, T2, T3>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory3<T1, T2, T3>, arg1: T1, arg2: T2, arg3: T3): IDeferredTelemetryEvent;
        startChildEvent<T1, T2, T3, T4>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory4<T1, T2, T3, T4>, arg1: T1, arg2: T2, arg3: T3, arg4: T4): IDeferredTelemetryEvent;
        startChildEvent<T1, T2, T3, T4, T5>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory5<T1, T2, T3, T4, T5>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): IDeferredTelemetryEvent;
        startChildEvent<T1, T2, T3, T4, T5, T6>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory6<T1, T2, T3, T4, T5, T6>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): IDeferredTelemetryEvent;
        startChildEvent<T1, T2, T3, T4, T5, T6, T7>(parent: ITelemetryEvent, eventFactory: ITelemetryEventFactory7<T1, T2, T3, T4, T5, T6, T7>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): IDeferredTelemetryEvent;

        /** Starts recording a timed event, used for measure performance, using the scope to find a parent event */
        startPerfEvent(scope, eventFactory: Function, ...args: any[]): IDeferredTelemetryEvent;

        /** <DEPRECATED> Log Telemetry event. This method is deprecated, recommend calling log or logChild instead. */
        logEventDeprecated(eventFactory: ITelemetryEvent): void;
    }

    export interface ITelemetryEventFactory {
        (parentId: string): ITelemetryEvent;
    }

    export interface ITelemetryEventFactory1<T> {
        (arg: T, parentId: string): ITelemetryEvent;
    }

    export interface ITelemetryEventFactory2<T1, T2> {
        (arg1: T1, arg2: T2, parentId: string): ITelemetryEvent;
    }

    export interface ITelemetryEventFactory3<T1, T2, T3> {
        (arg1: T1, arg2: T2, arg3: T3, parentId: string): ITelemetryEvent;
    }

    export interface ITelemetryEventFactory4<T1, T2, T3, T4> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, parentId: string): ITelemetryEvent;
    }

    export interface ITelemetryEventFactory5<T1, T2, T3, T4, T5> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5,parentId: string): ITelemetryEvent;
    }

    export interface ITelemetryEventFactory6<T1, T2, T3, T4, T5, T6> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, parentId: string): ITelemetryEvent;
    }

    export interface ITelemetryEventFactory7<T1, T2, T3, T4, T5, T6, T7> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, parentId: string): ITelemetryEvent;
    }

    /** Identifies a long-running telemetry event. */
    export interface IDeferredTelemetryEvent {
        /** The event being recorded. */
        event: ITelemetryEvent;

        /** Marks the telemetry event as complete. */
        resolve();
        /** Marks the telemetry event as failed. */
        reject();
    }

    /** Interface for event arguments containing activity event*/
    export interface ITelemetryEventArgs {
        /** Parent event started by the invoker and passed to the event handler */
        parentEvent: ITelemetryEvent;
    };

    export enum TelemetryCategory {
        Verbose,
        CustomerAction,
        CriticalError,
        Trace,
    }

    export interface ITelemetryEvent {
        name: string;
        category?: TelemetryCategory;
        id: string;
        
        // Loggers bit mask
        loggers?: number;

        // Time (and any properties of ITelemetryEvent) need to be primivative types
        // Telemetry events may be created in frames which get unloaded. If the event was created
        // in a frame which gets unloaded ie. calling Date.getTime() will result in a
        // "Can't execute code from a freed script" exception
        time: number;

        // Returns a formatted version of the info object ie. Enums replaced with their text values (instead of numeric values)
        getFormattedInfoObject(): any;
        info: any;
    }

    export interface ITelemetryEventI<T> extends ITelemetryEvent {
        info: T;
    }

    export enum LoggerServiceType {
        Localytics = 0x1,
        AppInsightDeprecated = 0x2,
        AppInsight = 0x4,
        Etw = 0x8,
        Mobile = 0x10,
        WinJs = 0x20,
        Designer = 0x40
    }
}
