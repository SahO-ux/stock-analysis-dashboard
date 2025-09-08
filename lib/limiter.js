import Bottleneck from "bottleneck";

// allow ~4–5 requests per second
const limiter = new Bottleneck({ minTime: 220 });

export default limiter;
