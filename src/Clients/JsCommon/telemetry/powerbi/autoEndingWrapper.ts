//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>  
//-----------------------------------------------------------------------

module powerbi {

    export enum Status {
        Open,
        CanBeClosed
    }

    export interface IAutoEndingWrapperEventContainer {
        eventData: ITelemetryEvent;
        status: Status;
    }

    /* Wrapper used by the perf team. Keeps track of when child events are closed. */
    export class AutoEndingWrapper implements ILoggerService {
        private loggerService: ILoggerService;
        public eventsInStorage: IAutoEndingWrapperEventContainer[] = [];

        constructor(loggerService: ILoggerService) {
            this.loggerService = loggerService;
        }

        public initialize(hostData: TelemetryHostData): void {
            this.loggerService.initialize(hostData);
        }

        public getType(): number {
            return this.loggerService.getType();
        }

        /** Log telemetry event **/
        public logEvent(eventData: ITelemetryEvent): void {
            // Don't worry about hanging onto calls to log
            this.loggerService.logEvent(eventData);
        }

        /** Starts receording a timed event **/
        public startTimedEvent(eventData: ITelemetryEvent): void {
            this.eventsInStorage.push({
                eventData: eventData,
                status: Status.Open
            });

            this.loggerService.startTimedEvent(eventData);
        }

        /** Log a timed event **/
        public endTimedEvent(eventData: ITelemetryEvent): void {
            var children = this.getChildren(eventData.id);

            // Remove the event from the list
            // - Won't fail if the event isn't registered (telemery shouldn't fail)
            // - If the event wasn't transmitted still going to remove, need to update the partC details
            this.removeEventsWithId(eventData.id);

            // Transmit event if there are children
            if (children.length === 0) {
                this.loggerService.endTimedEvent(eventData);

                // Event was transmitted - try and send out all elligable parents
                var currentEvent: any = eventData;

                while (currentEvent) {

                    // Check for and remove the parent if it is finished and the parent has no children
                    var parents = this.eventsInStorage.filter((event: any) => {
                        return currentEvent.info.parentId &&
                            event.eventData.id === currentEvent.info.parentId &&
                            event.status === Status.CanBeClosed &&
                            this.getChildren(event.eventData.id).length === 0;
                    });

                    if (parents.length > 0) {
                        this.loggerService.endTimedEvent(parents[0].eventData);
                        this.removeEventsWithId(parents[0].eventData.id);
                        currentEvent = parents[0].eventData;
                    } else {
                        currentEvent = null;
                    }
                }
            } else {
                // If the event wasn't transmitted add it back to the list for future transmitting
                this.eventsInStorage.push({
                    eventData: eventData,
                    status: Status.CanBeClosed
                });
            }
        }

        private getChildren(id: string): IAutoEndingWrapperEventContainer[] {
            return this.eventsInStorage.filter((event: any) => { return event.eventData.info.parentId !== undefined && event.eventData.info.parentId === id; });
        }

        private removeEventsWithId(id: string) {
            for (var i = this.eventsInStorage.length - 1; i >= 0; i--) {
                var eventToRemove: ITelemetryEvent = this.eventsInStorage[i].eventData;
                if (eventToRemove.id === id) {
                    this.eventsInStorage.splice(i, 1);
                }
            }
        }
    }
}
