import {
  IPaginationMeta,
  ObjectLiteral,
} from "nestjs-typeorm-paginate/dist/interfaces";

export class MyPagination<
  PaginationObject,
  T extends ObjectLiteral = IPaginationMeta
> {
  items: PaginationObject[];

  readonly meta: T;

  constructor(items: PaginationObject[], meta: T) {
    this.items = items;
    this.meta = meta;
  }
}
