export interface CveBcCveBarchart {
    success: boolean;
    content: Content;
    message: string;
}

export interface Content {
    cve_barchart: CveBarchart[];
}

export interface CveBarchart {
    cve_name: string;
    count:    number;
}
