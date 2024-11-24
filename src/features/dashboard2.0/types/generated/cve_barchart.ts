export interface CveBarchart {
    success: boolean;
    content: Content;
    message: string;
}

export interface Content {
    cve_barchart: any[];
}
