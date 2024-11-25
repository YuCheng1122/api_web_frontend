export interface Authentication {
    success: boolean;
    content: Content;
    message: string;
}

export interface Content {
    authentication_piechart: AuthenticationPiechart[];
}

export interface AuthenticationPiechart {
    tactic: string;
    count:  number;
}
