export interface IWhoopsEnvelope {
    whoops: IWhoop[];
}

export interface IWhoop {
    name: string;
    date: Date;
    body: string;
}