export interface MaliciousFile {
    success: boolean;
    content: Content;
    message: string;
}

export interface Content {
    malicious_file_barchart: MaliciousFileBarchart[];
}

export interface MaliciousFileBarchart {
    name:  string;
    count: number;
}
