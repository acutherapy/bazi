import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Typography, Row, Col, Form, Card, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import './App.css';
import { useBazi, BirthDateTime, BaziResult, FiveElementStat, FIVE_ELEMENTS_EN } from './hooks/useBazi';
import { FIVE_ELEMENTS_COLORS } from './constants';
import NatalSection from './components/NatalSection';
import CurrentSection from './components/CurrentSection';
import EnergyDNA from './components/EnergyDNA';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Combined Analysis Component (Internal for now)
const CombinedAnalysis: React.FC<{
  birthStats: FiveElementStat[];
  currentStats: FiveElementStat[];
  imbalance: any;
}> = ({ birthStats, currentStats, imbalance }) => {
  const { t } = useTranslation();
  const { deviations, totalImbalance, overallStatus } = imbalance;
  // Calculate combined stats for display if needed, but we used the passed imbalance which is based on combined

  return (
    <Card title={t('Combined Five Elements Analysis')} bordered={false} className="glass-card" style={{ marginTop: '24px', background: 'rgba(255,255,255,0.6)' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={5}>{t('Element Distribution')}</Title>
          {/* We can iterate over birthStats keys since elements are same */}
          {birthStats.map(stat => {
            const element = stat.element;
            const birthElement = birthStats.find(s => s.element === element);
            const currentElement = currentStats.find(s => s.element === element);
            const deviation = deviations.find((d: any) => d.element === element);

            if (!birthElement || !currentElement) return null;

            return (
              <div key={element} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <Text strong style={{ width: '60px' }}>
                  {/* @ts-ignore */}
                  {t(FIVE_ELEMENTS_EN[element])}:
                </Text>
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  borderRadius: '12px',
                  minHeight: '32px',
                  padding: '4px 8px',
                  marginRight: '8px'
                }}>
                  {/* Natal (Circle) */}
                  {Array.from({ length: birthElement.count }).map((_, idx) => (
                    <div
                      key={`birth-${idx}`}
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: FIVE_ELEMENTS_COLORS[element as keyof typeof FIVE_ELEMENTS_COLORS],
                        borderRadius: '50%',
                        marginRight: '4px',
                        display: 'inline-block',
                        border: '1px solid rgba(0,0,0,0.1)'
                      }}
                      title="Natal"
                    />
                  ))}
                  {/* Current (Square) */}
                  {Array.from({ length: currentElement.count }).map((_, idx) => (
                    <div
                      key={`current-${idx}`}
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: FIVE_ELEMENTS_COLORS[element as keyof typeof FIVE_ELEMENTS_COLORS],
                        borderRadius: '2px', // Square-ish
                        marginRight: '4px',
                        display: 'inline-block',
                        border: '1px solid rgba(0,0,0,0.1)'
                      }}
                      title="Current"
                    />
                  ))}
                </div>
                <div style={{ minWidth: '140px', textAlign: 'right' }}>
                  <Text type={deviation?.status === 'Balanced' ? 'success' :
                    (deviation?.status === 'Slightly High' || deviation?.status === 'Slightly Low') ? 'warning' : 'danger'}>
                    {t(deviation?.status)} ({deviation?.deviationPercentage > 0 ? '+' : ''}{deviation?.deviationPercentage}%)
                  </Text>
                </div>
              </div>
            );
          })}

          <Divider />
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <Text strong>{t('Overall Status')}: </Text>
            <Text type={totalImbalance <= 0.05 ? 'success' : totalImbalance <= 0.1 ? 'warning' : 'danger'} strong>
              {t(overallStatus)} ({t('Total Deviation')}: {Math.round(totalImbalance * 100)}%)
            </Text>
          </div>
        </Col>
      </Row>
    </Card>
  );
};


function App() {
  const { t, i18n } = useTranslation();
  const { calculateHelper, calculateFiveElementsStats, calculateImbalance } = useBazi();

  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<BirthDateTime | null>(null);
  const [bazi, setBazi] = useState<BaziResult | null>(null);
  const [currentBazi, setCurrentBazi] = useState<BaziResult | null>(null);
  const [days, setDays] = useState<number[]>([]);

  // Years 1900-2100
  const years = useMemo(() => Array.from({ length: 201 }, (_, i) => 1900 + i), []);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const updateDays = (year?: number, month?: number) => {
    if (year && month) {
      const daysInMonth = new Date(year, month, 0).getDate();
      setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    }
  };

  useEffect(() => {
    const year = form.getFieldValue('year');
    const month = form.getFieldValue('month');
    updateDays(year, month);
  }, [form]);

  const handleFormChange = (changedValues: any, allValues: any) => {
    if ('year' in changedValues || 'month' in changedValues) {
      updateDays(allValues.year, allValues.month);
      const daysInMonth = new Date(allValues.year || 2000, allValues.month || 1, 0).getDate();
      if (allValues.day > daysInMonth) {
        form.setFieldValue('day', null);
      }
    }

    if (allValues.year && allValues.month && allValues.day && allValues.hour !== undefined) {
      setSelectedDate({
        year: allValues.year,
        month: allValues.month,
        day: allValues.day,
        hour: allValues.hour
      });
    } else {
      setSelectedDate(null);
    }
  };

  const calculateBazi = () => {
    if (!selectedDate) return;
    const { year, month, day, hour } = selectedDate;
    const date = new Date(year, month - 1, day, hour);
    const result = calculateHelper(date, 'natal');
    setBazi(result);
  };

  // Current Bazi
  const calculateCurrent = () => {
    const now = new Date();
    const result = calculateHelper(now, 'current');
    setCurrentBazi(result);
  };

  useEffect(() => {
    calculateCurrent();
    const timer = setInterval(calculateCurrent, 60000);
    return () => clearInterval(timer);
  }, [calculateHelper]);

  // Derived Stats
  const natalStats = useMemo(() => bazi ? calculateFiveElementsStats(bazi) : [], [bazi, calculateFiveElementsStats]);
  const currentStats = useMemo(() => currentBazi ? calculateFiveElementsStats(currentBazi) : [], [currentBazi, calculateFiveElementsStats]);

  const natalImbalance = useMemo(() => natalStats.length ? calculateImbalance(natalStats) : { deviations: [], totalImbalance: 0, overallStatus: '' }, [natalStats, calculateImbalance]);
  const currentImbalance = useMemo(() => currentStats.length ? calculateImbalance(currentStats) : { deviations: [], totalImbalance: 0, overallStatus: '' }, [currentStats, calculateImbalance]);

  // Combined Analysis
  const combinedStats = useMemo(() => {
    if (!natalStats.length || !currentStats.length) return [];
    return natalStats.map(({ element }) => {
      const birthElement = natalStats.find(stat => stat.element === element);
      const currentElement = currentStats.find(stat => stat.element === element);
      const totalCount = (birthElement?.count || 0) + (currentElement?.count || 0);
      return {
        element,
        count: totalCount,
        percentage: Math.round((totalCount / 16) * 100)
      };
    });
  }, [natalStats, currentStats]);

  const combinedImbalance = useMemo(() => combinedStats.length ? calculateImbalance(combinedStats) : { deviations: [], totalImbalance: 0, overallStatus: '' }, [combinedStats, calculateImbalance]);

  return (
    <Layout className="layout">
      <Header style={{ background: 'rgba(255, 255, 255, 0.4)', padding: '0 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px', backdropFilter: 'blur(10px)' }}>
        <Title level={2} style={{ margin: 0, fontFamily: 'Noto Serif SC', color: '#1f1f1f' }}>{t('Bazi Calculator')}</Title>
        <div>
          <button onClick={() => i18n.changeLanguage('en')} style={{ marginRight: 8, cursor: 'pointer', background: 'transparent', border: '1px solid #333', borderRadius: '4px', padding: '4px 8px' }}>English</button>
          <button onClick={() => i18n.changeLanguage('zh')} style={{ cursor: 'pointer', background: 'transparent', border: '1px solid #333', borderRadius: '4px', padding: '4px 8px' }}>中文</button>
        </div>
      </Header>
      <Content style={{ padding: '24px 32px', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <NatalSection
                years={years}
                months={months}
                days={days}
                bazi={bazi}
                onCalculate={calculateBazi}
                onFormChange={handleFormChange}
                form={form}
                selectedDate={selectedDate}
                fiveElementStats={natalStats}
                imbalance={natalImbalance}
              />
            </Col>
            <Col xs={24} lg={12}>
              <Card bordered={false} style={{ height: '100%', background: 'rgba(255, 255, 255, 0.4)', borderRadius: '16px', backdropFilter: 'blur(20px)' }}>
                <CurrentSection
                  currentBazi={currentBazi}
                  stats={currentStats}
                  imbalance={currentImbalance}
                />

                {bazi && currentBazi && (
                  <div className="animate-fade-in">
                    <CombinedAnalysis
                      birthStats={natalStats}
                      currentStats={currentStats}
                      imbalance={combinedImbalance}
                    />
                    <div style={{ marginTop: '24px' }}>
                      <EnergyDNA
                        birthStats={natalStats}
                        currentStats={currentStats}
                      />
                    </div>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
