import client, { Connection, Channel } from 'amqplib';
import messageQueue from '../../config/messageQueue';

type ConsumerCallback<MsgKey extends MessageKey> = (msg: Messages[MsgKey]) => any;

type Messages = {
    BillDocumentUpdate: number;
}

type MessageKey = keyof Messages;

class RabbitMqConnection {
    private connection?: Connection;
    private channel?: Channel;
    private connected?: boolean;
  
    async connect() {
        if (this.connected && this.channel) {
            return;
        } else {
            this.connected = true;
        }
  
        console.log('⌛️ Connecting to Rabbit-MQ Server');
        this.connection = await client.connect(messageQueue.url);
  
        console.log('✅ Rabbit MQ Connection is ready');
  
        this.channel = await this.connection.createChannel();
  
        console.log('🛸 Created RabbitMQ Channel successfully');
    }
  
    async sendToQueue(queue: MessageKey, message: Messages[MessageKey]) {
        if (!this.channel) {
            await this.connect();
        }
  
        this.channel!.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }

    async consume(queue: MessageKey, handleIncomingNotification: ConsumerCallback<MessageKey>) {
        if (!this.channel) {
            await this.connect();
        }

        await this.channel!.assertQueue(queue, {
            durable: true,
        });

        await this.channel!.consume(
            queue,
            (msg) => {
                if (!msg) {
                    throw new Error('Consumer cancelled by RabbitMQ server');
                }

                handleIncomingNotification(JSON.parse(msg.content.toString()) as Messages[MessageKey]);
                
                this.channel!.ack(msg);
            }
        );

    }
}
  
const connection = new RabbitMqConnection();
  
export default connection;