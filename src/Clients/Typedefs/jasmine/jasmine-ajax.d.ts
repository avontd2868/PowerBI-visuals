// Type definitions for Jasmine-Ajax 
// Project: https://github.com/pivotal/jasmine-ajax

/// <reference path="../jasmine/jasmine.d.ts"/>

declare module jasmine {
    interface AjaxRequestStub {
        andReturn(options: any);
    }

    interface MockAjax {
        install();
        uninstall();
        stubRequest(url: string, data?: any, method?: string): AjaxRequestStub;
    }

    var Ajax: MockAjax;
}