/**
 * Интерфейс для описание информации об объекте
 */
export interface IContentModel {
    id?: number;                       // Идентификатор записи объекта в IndexedDB
    uuid: number;                      // Идентификатор объекта взятый из БД основного сервиса
    title: string;
    price: number;
    img: string;
    count_files: number;
    type: string;
}

export interface ICreateContentModel {
    title: string;
    description: string;
    price: string;
}

export interface IUpdateContentModel {
    content_sales_id: number;
    title: string;
    description: string;
    price: string;
}


export interface IGetContentModel {
    id?:             number;
    title?:          string;
    description?:    string;
    path?:           string;
    price?:          number;
    type?:           string;
    created_at?:     Date;
    updated_at?:     Date;
    users_id?:       number;
    is_buy?:         boolean;
    content_objects?: IContentObjectModel[];
}

export interface IContentObjectModel {
    id?:             number;
    path?:           string;
    filename?:       string;
    ext?:            string;
    created_at?:      Date;
    updated_at?:      Date;
    content_sales_id?: number;
}
