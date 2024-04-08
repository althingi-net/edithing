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

        // Limit parallel processing tasks to one
        await this.channel.prefetch(1);
  
        console.log('🛸 Created RabbitMQ Channel successfully');
    }

    async close() {
        if (this.channel) {
            await this.channel.close();
            this.channel.removeAllListeners();
        }
  
        if (this.connection) {
            await this.connection.close();
        }
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
            async (msg) => {
                if (!msg) {
                    throw new Error('Consumer cancelled by RabbitMQ server');
                }

                await handleIncomingNotification(JSON.parse(msg.content.toString()) as Messages[MessageKey]);
                
                this.channel!.ack(msg);
            }
        );

    }
}
  
const connection = new RabbitMqConnection();
  
export default connection;