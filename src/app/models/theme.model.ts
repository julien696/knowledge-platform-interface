export interface Theme {
    id : number;
    name : string;
    created_by_id? : number;
    created_at? : Date;
    updated_at? : Date;
    imageFile?: File;        
    imageName?: string;            
    created_by?: any;
    cursus?: any[];
    certifications?: any[];
}

export interface ThemeApiResponse {
    member: Theme[];
    totalItems: number;
}
