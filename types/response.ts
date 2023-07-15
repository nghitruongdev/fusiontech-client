import { Page } from "types";
import { _listLinks } from "./_link";

export type CustomResponse<T = unknown> =
    | {
          _embedded: {
              _links?: _listLinks;
              page?: Page;
          } & { [key: string]: T[] };
      }
    | (T & { _embedded: undefined });
