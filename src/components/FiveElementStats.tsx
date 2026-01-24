import React from 'react';
import { Card, Row, Col, Typography, Progress } from 'antd';
import { useTranslation } from 'react-i18next';
import { FIVE_ELEMENTS_COLORS } from '../constants';
import { FiveElementStat, BaziResult, FIVE_ELEMENTS_EN } from '../hooks/useBazi';

const { Title, Text } = Typography;

interface FiveElementStatsProps {
    stats: FiveElementStat[];
    imbalance: {
        deviations: any[];
        totalImbalance: number;
        overallStatus: string;
    };
    title?: string;
}

const FiveElementStats: React.FC<FiveElementStatsProps> = ({ stats, imbalance, title }) => {
    const { t } = useTranslation();
    const { deviations, totalImbalance, overallStatus } = imbalance;

    return (
        <Card
            title={title || t('Five Elements Analysis')}
            bordered={false}
            className="glass-card"
            style={{ background: 'transparent' }}
        >
            <Row gutter={[16, 16]}>
                {/* Distribution */}
                <Col span={24}>
                    <Title level={5}>{t('Element Distribution')}</Title>
                    {stats.map(({ element, count, percentage }) => (
                        <div key={element} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <Text strong>
                                    {/* @ts-ignore */}
                                    {t(FIVE_ELEMENTS_EN[element])}
                                </Text>
                                <Text>{count} ({percentage}%)</Text>
                            </div>
                            <Progress
                                percent={percentage}
                                strokeColor={FIVE_ELEMENTS_COLORS[element as keyof typeof FIVE_ELEMENTS_COLORS]}
                                showInfo={false}
                                trailColor="rgba(0,0,0,0.05)"
                            />
                        </div>
                    ))}
                </Col>

                {/* Imbalance */}
                <Col span={24}>
                    <Title level={5} style={{ marginTop: '16px' }}>{t('Imbalance Analysis')}</Title>
                    <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
                        <Text strong>{t('Overall Status')}: </Text>
                        <Text type={totalImbalance <= 0.05 ? 'success' : totalImbalance <= 0.1 ? 'warning' : 'danger'} strong>
                            {t(overallStatus)} ({t('Deviation')}: {Math.round(totalImbalance * 100)}%)
                        </Text>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {deviations.map(({ element, deviationPercentage, status }) => {
                            const elementStat = stats.find(s => s.element === element);
                            if (!elementStat) return null;
                            return (
                                <div key={element} style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    background: 'rgba(255,255,255,0.8)',
                                    border: `1px solid ${FIVE_ELEMENTS_COLORS[element as keyof typeof FIVE_ELEMENTS_COLORS]}`,
                                    fontSize: '12px'
                                }}>
                                    <span style={{ color: FIVE_ELEMENTS_COLORS[element as keyof typeof FIVE_ELEMENTS_COLORS], fontWeight: 'bold', marginRight: '4px' }}>
                                        {/* @ts-ignore */}
                                        {t(FIVE_ELEMENTS_EN[element])}
                                    </span>
                                    <Text type={status === 'Balanced' ? 'success' :
                                        (status === 'Slightly High' || status === 'Slightly Low') ? 'warning' : 'danger'}>
                                        {t(status)} ({deviationPercentage > 0 ? '+' : ''}{deviationPercentage}%)
                                    </Text>
                                </div>
                            );
                        })}
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default FiveElementStats;
