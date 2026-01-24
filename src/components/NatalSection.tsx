import React from 'react';
import { Card, Form, Select, Button, Space, Typography, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaziResult, FiveElementStat, CHINESE_HOURS } from '../hooks/useBazi';
import BaziChart from './BaziChart';
import FiveElementStats from './FiveElementStats';

const { Title } = Typography;
const { Option } = Select;

interface NatalSectionProps {
    years: number[];
    months: number[];
    days: number[];
    bazi: BaziResult | null;
    onCalculate: () => void;
    onFormChange: (changedValues: any, allValues: any) => void;
    form: any;
    selectedDate: any;
    fiveElementStats: FiveElementStat[];
    imbalance: any;
}

const NatalSection: React.FC<NatalSectionProps> = ({
    years, months, days, bazi, onCalculate, onFormChange, form, selectedDate, fiveElementStats, imbalance
}) => {
    const { t } = useTranslation();

    return (
        <Card bordered={false} style={{ height: '100%', background: 'rgba(255, 255, 255, 0.4)', borderRadius: '16px', backdropFilter: 'blur(20px)' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Title level={3} style={{ margin: '0 0 24px 0', textAlign: 'center', color: '#1f1f1f' }}>{t('Natal Bazi')}</Title>

                <Card title={t('Birth Date & Time')} bordered={false} className="glass-card" style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.6)' }}>
                    <Form
                        form={form}
                        onValuesChange={onFormChange}
                        layout="vertical"
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="year" label={t('Year')} rules={[{ required: true }]}>
                                    <Select placeholder={t('Select year')} showSearch>
                                        {years.map(y => <Option key={y} value={y}>{y}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="month" label={t('Month')} rules={[{ required: true }]}>
                                    <Select placeholder={t('Select month')}>
                                        {months.map(m => <Option key={m} value={m}>{m}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="day" label={t('Day')} rules={[{ required: true }]}>
                                    <Select placeholder={t('Select day')} disabled={days.length === 0}>
                                        {days.map(d => <Option key={d} value={d}>{d}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="hour" label={t('Hour')} rules={[{ required: true }]}>
                                    <Select placeholder={t('Select hour')}>
                                        {CHINESE_HOURS.map(h => <Option key={h.value} value={h.value}>{h.label}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Button
                            type="primary"
                            size="large"
                            onClick={onCalculate}
                            disabled={!selectedDate}
                            block
                            style={{
                                height: '48px',
                                fontSize: '16px',
                                background: 'linear-gradient(45deg, #1890ff, #096dd9)',
                                border: 'none',
                                boxShadow: '0 4px 15px rgba(24, 144, 255, 0.3)'
                            }}
                        >
                            {t('Generate Natal Bazi')}
                        </Button>
                    </Form>
                </Card>

                {bazi && (
                    <div className="animate-fade-in">
                        <BaziChart bazi={bazi} />
                        <FiveElementStats stats={fiveElementStats} imbalance={imbalance} />
                    </div>
                )}
            </Space>
        </Card>
    );
};

export default NatalSection;
