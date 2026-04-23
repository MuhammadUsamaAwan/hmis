import { log } from "../lib/logger";

export async function runSeed() {
  // Seed here
}

if (import.meta.main) {
  const startTime = Date.now();

  runSeed()
    .then(() => {
      const endTime = Date.now();
      log.info(`DB seed completed successfully in ${endTime - startTime}ms`);
    })
    .catch(error => {
      const endTime = Date.now();
      log.error(error, `DB seed failed in ${endTime - startTime}ms`);
    });
}
