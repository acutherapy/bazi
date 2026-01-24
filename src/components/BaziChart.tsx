import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { FIVE_ELEMENTS_COLORS } from '../constants';
import { BaziResult, FIVE_ELEMENTS_EN } from '../hooks/useBazi';

const { Text } = Typography;

interface BaziChartProps {
    bazi: BaziResult;
    title?: string;
}

const BaziChart: React.FC<BaziChartProps> = ({ bazi, title }) => {
    const { t } = useTranslation();

    const renderPillar = (label: string, pillar: [string, string], elements: [string, string]) => (
        <Card
            title={t(label)}
            bordered={false}
            size="small"
            className="bazi-pillar-card"
            style={{
                minHeight: '120px',
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <Text strong style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>
                    {pillar[0]}
                    {pillar[1]}
                </Text>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    {elements.map((e, idx) => (
                        <span key={idx} style={{
                            color: FIVE_ELEMENTS_COLORS[e as keyof typeof FIVE_ELEMENTS_COLORS],
                            fontWeight: 'bold',
                            fontSize: '12px'
                        }}>
                            {/* @ts-ignore */}
                            {t(FIVE_ELEMENTS_EN[e])}
                        </span>
                    ))}
                </div>
            </div>
        </Card>
    );

    return (
        <Card
            title={title || t('Bazi')}
            bordered={false}
            className="glass-card"
            style={{ marginBottom: '24px', background: 'transparent' }}
        >
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    {renderPillar('Year Pillar', bazi.year, bazi.fiveElements.year)}
                </Col>
                <Col span={6}>
                    {renderPillar('Month Pillar', bazi.month, bazi.fiveElements.month)}
                </Col>
                <Col span={6}>
                    {renderPillar('Day Pillar', bazi.day, bazi.fiveElements.day)}
                </Col>
                <Col span={6}>
                    {renderPillar('Hour Pillar', bazi.hour, bazi.fiveElements.hour)}
                </Col>
            </Row>
        </Card>
    );
};

export default BaziChart;
