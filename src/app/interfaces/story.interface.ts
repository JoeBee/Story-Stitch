export interface StoryData {
    title?: string;
    Title?: string;
    intro?: string;
    Intro?: string;
    images?: string[];
    Images?: string[];
    conclusion?: string;
    Conclusion?: string;
    guild?: string;
    Guild?: string;
    contributions?: StoryContribution[];
    Contributions?: StoryContribution[];
}

export interface StoryContribution {
    penName: string;
    chapter: string;
    guild: string;
    timestamp?: Date;
}

export interface DisplayStory {
    title: string;
    text: string;
    images?: string[];
} 