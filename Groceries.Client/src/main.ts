import { Aurelia } from "aurelia-framework";
import environment from "./environment";
import { ProgressService } from "services/progress-service";
import { HttpClient } from "aurelia-fetch-client";

export function configure(aurelia: Aurelia) {
  aurelia.use.standardConfiguration().feature("resources");

  aurelia.use.developmentLogging(environment.debug ? "debug" : "warn");

  if (environment.testing) {
    aurelia.use.plugin("aurelia-testing");
  }

  const httpClient = aurelia.container.get(HttpClient) as HttpClient;

  httpClient.configure((config) => {
    config.withBaseUrl(environment.apiUrl);
  });

  aurelia.start().then(() => {
    const progressService = aurelia.container.get(
      ProgressService
    ) as ProgressService;

    httpClient.configure((config) => {
      config.withInterceptor({
        request(req: Request) {
          progressService.makingApiCall();
          return req;
        },
        async response(resp: Response) {
          progressService.notMakingApiCallAnymore();
          return resp;
        },
      });
    });

    aurelia.setRoot();
  });
}
