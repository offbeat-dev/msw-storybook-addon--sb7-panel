import {
  SetupWorker,
  RequestHandler,
  setupWorker,
  graphql,
  GraphQLHandler,
  GraphQLRequest,
  GraphQLVariables,
} from "msw";

export type SetupApi = SetupWorker;
export type InitializeOptions = Parameters<SetupWorker["start"]>[0];

export type MswParameters = {
  msw?: {
    handlers: any[];
    originalResponses: Record<string, any>;
    graphQLClientUri?: string;
  };
};

type Context = {
  id: any;
  parameters: MswParameters;
  viewMode: string;
  args: Record<string, any>;
  allArgs: Record<string, any>;
  initialArgs: Record<string, any>;
};

let worker: SetupWorker;
let opt: InitializeOptions;

export const initialize = async (options?: InitializeOptions) => {
  opt = options;
};

export function getWorker(): SetupWorker {
  if (worker === undefined) {
    throw new Error(
      `[MSW] Failed to retrieve the worker: no active worker found. Did you forget to call "initialize"?`
    );
  }

  return worker;
}

export const mswLoader = async (context: Context) => {
  const {
    parameters: { msw },
    viewMode,
  } = context;
  if (!msw) return;
  if (msw.originalResponses || ((window as any).msw && viewMode !== "docs"))
    return;

  console.log(context, msw);

  let worker;
  if (viewMode === "docs" && (window as any).msw) {
    worker = typeof global.process === "undefined" && (window as any).msw;
  } else {
    worker = typeof global.process === "undefined" && setupWorker();
  }

  if ("handlers" in msw && msw.handlers) {
    let handlers = Object.values(msw.handlers)
      .filter(Boolean)
      .reduce(
        (handlers, handlersList) => handlers.concat(handlersList),
        [] as RequestHandler[]
      );
    // if (viewMode === "docs") {
    //   const { handlers: modifiedHandlers, context: modifiedContext } =
    //     modifyHandlersAndArgs(handlers, context);
    //   handlers = modifiedHandlers;
    //   context = modifiedContext;
    // }

    if (handlers.length > 0) {
      worker.use(...handlers);
    }
    if (!(window as any).msw) worker.start(opt || {});

    (window as any).msw = worker;
    const responses = await getOriginalResponses(handlers, context);

    context.parameters.msw = {
      ...msw,
      originalResponses: responses,
    };
  }

  return {};
};

const modifyHandlersAndArgs = (handlers: any, context: Context) => {
  const newHandlers: GraphQLHandler<GraphQLRequest<GraphQLVariables>>[] = [];
  handlers.forEach((handler: any) => {
    if (!!handler.info.method) {
      const modifiedPath =
        handler.info.path.replace(/\/$/, "") + `/${self.crypto.randomUUID()}`;

      Object.keys(context.args).forEach((key) => {
        if (context.args[key] === handler.info.path) {
          context.args[key] = modifiedPath;
        }
      });
      Object.keys(context.allArgs).forEach((key) => {
        if (context.allArgs[key] === handler.info.path) {
          context.allArgs[key] = modifiedPath;
        }
      });
      Object.keys(context.initialArgs).forEach((key) => {
        if (context.initialArgs[key] === handler.info.path) {
          context.initialArgs[key] = modifiedPath;
        }
      });
      handler.info.header = handler.info.header.replace(
        handler.info.path,
        modifiedPath
      );
      handler.info.path = modifiedPath;
      newHandlers.push(handler);
    }
  });

  return { handlers: newHandlers, context: context };
};

const getOriginalResponses = async (handlers: any[], context: Context) => {
  const originalResponses = {} as Record<string, any>;
  for (const handler of handlers) {
    if (!!handler.info.method) {
      const originalRequest = new Request(handler.info.path);
      const originalResponse = await fetch(originalRequest);
      let originalData;
      if (!originalResponse.ok) originalData = null;
      else originalData = await originalResponse.json();
      originalResponses[handler.info.path] = {
        data: originalData,
        status: originalResponse.status,
      };
    }
    // else if (!!handler.info.operationName) {
    //   const originalResponse = await fetch(
    //     context.parameters.msw.graphQLClientUri,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         query: context.args.query,
    //         variables: {},
    //       }),
    //     }
    //   );
    //   let originalData;
    //   if (!originalResponse.ok) originalData = null;
    //   else originalData = await originalResponse.json();
    //   originalResponses[handler.info.operationName] = {
    //     ...originalData,
    //     status: originalResponse.status,
    //   };
    // }
  }

  return originalResponses;
};
