export interface Theme {
    id : number;
    name : string;
    created_by_id? : number;
    created_at? : Date;
    updated_at? : Date;
}

export interface ApiResponse {
    member: Theme[];
    totalItems: number;
}