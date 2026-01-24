import React from 'react';
import { Card, Space, Typography, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaziResult, FiveElementStat } from '../hooks/useBazi';
import BaziChart from './BaziChart';
import FiveElementStats from './FiveElementStats';
import EnergyDNA from './EnergyDNA';

const { Title, Text } = Typography;

interface CurrentSectionProps {
    currentBazi: BaziResult | null;
    stats: FiveElementStat[];
    imbalance: any;
    combinedStats?: any; // For flexible future use if we pass combined analysis here
}

const CurrentSection: React.FC<CurrentSectionProps> = ({ currentBazi, stats, imbalance }) => {
    const { t } = useTranslation();

    if (!currentBazi) return null;

    return (
        <Card bordered={false} style={{ height: '100%', background: 'rgba(255, 255, 255, 0.4)', borderRadius: '16px', backdropFilter: 'blur(20px)' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Title level={3} style={{ margin: '0 0 24px 0', textAlign: 'center', color: '#1f1f1f' }}>{t('Current Bazi')}</Title>

                <Card bordered={false} className="glass-card" style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                    <Text strong style={{ fontSize: '18px', display: 'block' }}>{currentBazi.solarDate}</Text>
                    <Text type="secondary" style={{ fontSize: '14px' }}>{currentBazi.lunarDate}</Text>
                </Card>

                <BaziChart bazi={currentBazi} />
                <FiveElementStats stats={stats} imbalance={imbalance} />
            </Space>
        </Card>
    );
};

export default CurrentSection;
