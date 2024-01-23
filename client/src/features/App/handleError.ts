import { notification } from 'antd';

const handleError = (error: any) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(error);

        if (error.body) {
            console.log(error.body);
        }
    }
    
    notification.error({ message: error.message });
};

export default handleError;