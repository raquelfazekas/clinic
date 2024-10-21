export type GoogleCalendarEvent = {
    kind: string;
    etag: string;
    id: string;
    status: string;
    htmlLink: string;
    created: string;
    updated: string;
    summary: string;
    description: string;
    creator: {
        email: string;
        self: boolean;
    };
    organizer: {
        email: string;
        self: boolean;
    };
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    iCalUID: string;
    sequence: number;
    attendees: Array<{
        email: string;
        displayName?: string;
        responseStatus: string;
        self?: boolean;
        organizer?: boolean
    }>;
    reminders: {
        useDefault: boolean;
    };
    eventType: string;
};
