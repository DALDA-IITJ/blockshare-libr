// minerWorker.mjs
import { parentPort } from "worker_threads";
import crypto from "crypto";

parentPort.on("message", ({ message, k }) => {
    const targetPrefix = "0".repeat(k);
    let nonce = Math.floor(Math.random() * 1e9); // Random large starting point
    let hash;

    while (true) {
        const data = `${message}${nonce}`;
        hash = crypto.createHash("sha256").update(data, "utf8").digest("hex");

        if (hash.startsWith(targetPrefix)) {
            parentPort.postMessage({ nonce, hash });
            break;
        }

        nonce++;
    }
});
