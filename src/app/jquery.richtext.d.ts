import 'jquery';

declare module 'jquery' {
    interface JQuery {
        richText(options?: any): JQuery;
    }
}

// global.d.ts
interface JQuery {
    richText: () => JQuery;
}