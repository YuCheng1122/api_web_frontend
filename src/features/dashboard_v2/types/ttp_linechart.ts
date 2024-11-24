export interface TtpLinechart {
    success: boolean;
    content: Content;
    message: string;
}

export interface Content {
    tactic_linechart: TacticLinechart[];
}

export interface TacticLinechart {
    label: Label[];
    datas: Data[];
}

export interface Data {
    name: string;
    type: string;
    data: Datum[];
}

export interface Datum {
    time:  Date;
    value: number;
}

export interface Label {
    label: string;
}
