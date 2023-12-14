import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Space, notification } from 'antd';
import { AuthService } from 'client-sdk';
import { FC, useCallback, useState } from 'react';
import Modal from '../Modal';
import useLanguageContext from './useLanguageContext';
import useSessionContext from './useSessionContext';

interface FormValues {
    email: string;
    password: string;
}

const LoginButton: FC = () => {
    const { t } = useLanguageContext();
    const [isOpen, setOpen] = useState(false);
    const handleClose = useCallback(() => setOpen(false), [setOpen]);
    const [form] = Form.useForm<FormValues>();
    const { setSession, isAuthenticated } = useSessionContext();

    const handleSubmit = async (values: FormValues) => {
        try {
            const session = await AuthService.authControllerLogin(values);
            setSession(session);
            
            form.setFieldsValue({ password: '', email: '' });
            handleClose();
        } catch (error) {
            form.setFieldsValue({ password: '' });
            notification.error({
                message: t('Login failed!'),
                description: t('Please check your credentials and try again.'),
            });
        }
    };

    if (isAuthenticated()) {
        return null;
    }

    return (
        <>
            <Button type="primary" onClick={() => setOpen(true)}>{t('Login')}</Button>
            <Modal title={t('Login')} isOpen={isOpen} onClose={handleClose}>
                <div>
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: t('Please input your Email!') }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder={t('Email')}
                                autoComplete='email'
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: t('Please input your Password!') }]}
                        >
                            <Input
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder={t('Password')}
                                autoComplete='current-password'
                            />
                        </Form.Item>
                        
                        <Divider />

                        <Space direction="horizontal" style={{ float: 'right', marginBottom: '-24px' }}>
                            <Form.Item>
                                <Button onClick={handleClose}>{t('Cancel')}</Button>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    {t('Login')}
                                </Button>
                            </Form.Item>
                        </Space>
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default LoginButton;