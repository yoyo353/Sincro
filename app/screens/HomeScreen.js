import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Card, Title, Paragraph, ActivityIndicator, Appbar } from 'react-native-paper';
import { CycleContext } from '../context/CycleContext';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
    const { currentCycle, startPeriod, endPeriod, loading: cycleLoading, cycles } = useContext(CycleContext);
    const { userInfo, logout } = useContext(AuthContext);

    // Simple Phase Calculation (Logic can be improved)
    const calculatePhase = () => {
        if (currentCycle) {
            // If cycle is open (period started but not ended, or just started tracking cycle?)
            // Assuming 'currentCycle' with no end_date implies the PERIOD is currently happening 
            // OR we are in a cycle.
            // Based on controller logic: "startCycle" creates an entry with start_date.
            // "endCycle" adds end_date. 
            // If we assume the "open" cycle means "User is bleeding", then:
            return { text: 'Menstruation', color: '#ffcccb' };
        }

        // If no open cycle, we are in between periods.
        // Check last closed cycle to guess phase
        if (cycles.length > 0) {
            const lastCycleStart = new Date(cycles[0].start_date);
            const today = new Date();
            const diffTime = Math.abs(today - lastCycleStart);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 5) return { text: 'Menstruation', color: '#ef9a9a' };
            if (diffDays <= 14) return { text: 'Follicular Phase', color: '#e0f7fa' };
            if (diffDays <= 17) return { text: 'Ovulation', color: '#fff9c4' };
            return { text: 'Luteal Phase', color: '#f3e5f5' };
        }

        return { text: 'No Data', color: '#f5f5f5' };
    };

    const phase = calculatePhase();

    const handleLogButton = async () => {
        if (currentCycle) {
            // Assume button means "End Period" if we have an open cycle (representing bleeding)
            // OR better constraint: If we interpret "active cycle" as just "Cycle Started", 
            // we need to know if the user is logging "Period End".
            // Let's assume the simple flow: Button toggle "Start Period" / "End Period".
            // This requires 'currentCycle' to represent the *Bleeding Phase* specifically for this simple UI.
            await endPeriod(new Date().toISOString().split('T')[0]);
        } else {
            // Start Period
            await startPeriod(new Date().toISOString().split('T')[0]);
        }
    };

    return (
        <>
            <Appbar.Header style={{ backgroundColor: '#fff' }}>
                <Appbar.Content title={`Hello, ${userInfo?.display_name || 'User'}`} />
                <Appbar.Action icon="logout" onPress={logout} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.dateText}>{new Date().toDateString()}</Text>
                </View>

                <Card style={[styles.phaseCard, { backgroundColor: phase.color }]}>
                    <Card.Content>
                        <Title style={styles.phaseTitle}>{phase.text}</Title>
                        <Paragraph style={styles.phaseSubtitle}>current phase</Paragraph>
                    </Card.Content>
                </Card>

                <View style={styles.actionContainer}>
                    {cycleLoading ? (
                        <ActivityIndicator animating={true} color="#e91e63" size="large" />
                    ) : (
                        <Button
                            mode="contained"
                            onPress={handleLogButton}
                            style={styles.logButton}
                            contentStyle={{ height: 60 }}
                            labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
                            color={currentCycle ? "#8bc34a" : "#e91e63"} // Green for End, Red for Start
                        >
                            {currentCycle ? 'End Period' : 'Log Period Start'}
                        </Button>
                    )}
                </View>

                <View style={styles.historyContainer}>
                    <Title>Recent History</Title>
                    {cycles.slice(0, 5).map((cycle) => (
                        <Card key={cycle.id} style={styles.historyCard}>
                            <Card.Content>
                                <Paragraph>Started: {cycle.start_date}</Paragraph>
                                <Paragraph>Ended: {cycle.end_date || 'Ongoing'}</Paragraph>
                            </Card.Content>
                        </Card>
                    ))}
                </View>

            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    dateText: {
        fontSize: 18,
        color: '#666',
    },
    phaseCard: {
        marginBottom: 30,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    phaseTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    phaseSubtitle: {
        textAlign: 'center',
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    actionContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logButton: {
        borderRadius: 30,
        width: '100%',
        elevation: 4,
        backgroundColor: '#d81b60', // Fallback color
    },
    historyContainer: {
        marginTop: 10,
    },
    historyCard: {
        marginTop: 10,
        backgroundColor: '#f9f9f9',
    },
});

export default HomeScreen;
