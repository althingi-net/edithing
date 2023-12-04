const PORT = Number(process.env.PORT) || 3003;

const server = {
    port: PORT,
    host: `http://localhost:${PORT}`,
};

export default server;