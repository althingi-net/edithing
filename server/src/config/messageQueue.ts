
const messageQueue = {
    url: process.env.MESSAGE_BROKER_URL || 'amqp://guest:guest@127.0.0.1:5672',
};

export default messageQueue;