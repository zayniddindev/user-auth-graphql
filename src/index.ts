import { container } from "./ioc/container";
import TYPES from "./ioc/types";
import { ExpressServer } from "./servers/express.server";

async function bootstrap() {
  await container.get<ExpressServer>(TYPES.ExpressServerToken).start();
}

bootstrap();
