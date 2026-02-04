export interface User {
    email: string;
    name: string;
    role: 'admin' | 'client';
    clientId?: string;
    clientIds?: string[];
}

export interface Client {
    id: string;
    name: string;
    logo: string;
    theme?: string;
    baseKnowledge?: string;
}

export interface Document {
    id: string;
    title: string;
    type: string;
    date: string;
    content?: string;
    url?: string;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    time?: string;
    type?: 'meeting' | 'workshop' | 'deadline' | 'other';
    description: string;
    joined?: boolean;
    attendees?: string[];
    link?: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface UserMapping {
    email: string;
    clientId: string;
    clientIds?: string[];
    createdAt: string;
    createdBy: string;
}
