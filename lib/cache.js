import NodeCache from "node-cache";

// cache entries live 15s (change as needed)
const cache = new NodeCache({ stdTTL: 15 });

export default cache;
