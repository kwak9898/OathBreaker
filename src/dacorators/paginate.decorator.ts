import { applyDecorators, Type } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
} from "@nestjs/swagger";

export interface ApiPaginateQueryInterface {
  filterColumns?: string[];
  sortColumns?: string[];
  searchColumns?: string[];
}

export const ApiPaginateQuery = (config?: ApiPaginateQueryInterface): any => {
  let decorators = [];

  if (config?.filterColumns) {
    decorators = Object.keys(config.filterColumns).map((key) => {
      return ApiQuery({
        name: `filter.${key}`,
        type: "string",
        isArray: false,
        required: false,
        description: `Filter operators: ${config.filterColumns[key].join(
          ", "
        )}`,
        example: `${config.filterColumns[key][0]}:value`,
      });
    });
  }

  if (config?.sortColumns) {
    decorators.push(
      ApiQuery({
        name: "sortBy",
        type: "string",
        isArray: true,
        required: false,
        description: `Sortable columns: ${config?.sortColumns.join(
          ", "
        )} (default: ${config?.sortColumns})`,
        example: "id:DESC",
      })
    );
  }

  if (config?.searchColumns) {
    decorators.push(
      ApiQuery({
        name: "search",
        type: "string",
        required: false,
        description: `Search columns: ${(config?.searchColumns || []).join(
          ", "
        )}`,
      })
    );
  }

  return applyDecorators(
    ApiQuery({ name: "page", type: "number", required: false }),
    ApiQuery({ name: "limit", type: "number", required: false }),
    ...decorators
  );
};

export const ApiPaginatedResponse = <TModel extends Type>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: { $ref: getSchemaPath(model) },
            // items: { $ref: getSchemaPath(model) },
          },
          meta: {
            type: "object",
            properties: {
              totalItems: {
                type: "number",
              },
              itemCount: {
                type: "number",
              },
              itemsPerPage: {
                type: "number",
              },
              totalPages: {
                type: "number",
              },
              currentPage: {
                type: "number",
              },
            },
          },
        },
      },
    })
  );
};
