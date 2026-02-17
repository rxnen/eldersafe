import { StyleSheet, Text, View, Pressable, FlatList, SectionList, Linking, useWindowDimensions, StatusBar, Platform, Image, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {styles} from '../styles/Styles';
import { colors } from '../styles/theme';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useMemo, useRef} from 'react';
import { verticalScale, horizontalScale, moderateScale } from '../styles/Styles';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import {products, hazardsDict, questions, important, roomQuestionNumbers, exclusions} from '../scripting/algorithm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {useRoute, useIsFocused, useNavigation} from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { migrateRoomData, getHazardStatus, updateHazardStatus } from '../scripting/rooms';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Calculate stats hook
const useHazardStats = (roomList, personalInfo) => {
    return useMemo(() => {
        if (!roomList || roomList.length === 0) {
            return { total: 0, inProgress: 0, fixed: 0, notAddressed: 0, percentage: 0 };
        }

        let total = 0;
        let inProgress = 0;
        let fixed = 0;
        let notAddressed = 0;

        roomList.forEach(room => {
            const roomHazards = hazardsDict[room.type] || [];
            roomHazards.forEach((hazard, k) => {
                const exclusion = exclusions.find(r => r.id === k && r.room === room.type);
                const isExcluded = exclusion &&
                    !(personalInfo[exclusion.exclusion] === "true" ||
                      personalInfo[exclusion.exclusion] === true ||
                      ['walker', 'cane', 'wheelchair'].includes(personalInfo[exclusion.exclusion]));

                if (!isExcluded) {
                    total++;
                    const status = getHazardStatus(room, hazard.questionID);
                    if (status === 'addressed') {
                        fixed++;
                    } else if (status === 'in_progress') {
                        inProgress++;
                    } else {
                        notAddressed++;
                    }
                }
            });
        });

        const percentage = total > 0 ? Math.round((fixed / total) * 100) : 0;
        return { total, inProgress, fixed, notAddressed, percentage };
    }, [roomList, personalInfo]);
};

// Progress Ring Component (scrollable)
const ProgressRing = ({ stats }) => {
    const gradientColors = stats.percentage >= 75
        ? ['#2E7D32', '#81C784']
        : stats.percentage >= 50
            ? ['#EF6C00', '#FFB74D']
            : ['#C62828', '#FF8A80'];

    return (
        <View style={styles.progressRingContainer}>
            <View style={styles.progressOuterRing}>
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.progressGradientRing}
                >
                    <View style={styles.progressInnerCircle}>
                        <Text style={styles.progressPercentage}>{stats.percentage}%</Text>
                        <Text style={styles.progressLabel}>Complete</Text>
                    </View>
                </LinearGradient>
            </View>
        </View>
    );
};

// Stats Cards Component (reusable for both scrollable and sticky versions)
const StatsCards = ({ stats, activeFilter, onFilterChange }) => {
    return (
        <View style={styles.progressStatsContainer}>
            <Pressable
                style={({ pressed }) => [
                    styles.progressStatCard,
                    activeFilter === 'not_addressed' && { borderColor: '#F44336' },
                    pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }
                ]}
                onPress={() => onFilterChange(activeFilter === 'not_addressed' ? 'all' : 'not_addressed')}
                accessibilityLabel={`Filter by not addressed hazards, ${stats.notAddressed} total`}
                accessibilityRole="button"
                accessibilityHint="Tap to filter hazards"
            >
                <Text style={[styles.progressStatNumber, { color: '#F44336' }]}>
                    {stats.notAddressed}
                </Text>
                <Text style={styles.progressStatLabel}>To Address</Text>
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    styles.progressStatCard,
                    activeFilter === 'in_progress' && { borderColor: '#FF9800' },
                    pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }
                ]}
                onPress={() => onFilterChange(activeFilter === 'in_progress' ? 'all' : 'in_progress')}
                accessibilityLabel={`Filter by in progress hazards, ${stats.inProgress} total`}
                accessibilityRole="button"
                accessibilityHint="Tap to filter hazards"
            >
                <Text style={[styles.progressStatNumber, { color: '#FF9800' }]}>
                    {stats.inProgress}
                </Text>
                <Text style={styles.progressStatLabel}>In Progress</Text>
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    styles.progressStatCard,
                    activeFilter === 'addressed' && { borderColor: '#4CAF50' },
                    pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }
                ]}
                onPress={() => onFilterChange(activeFilter === 'addressed' ? 'all' : 'addressed')}
                accessibilityLabel={`Filter by addressed hazards, ${stats.fixed} total`}
                accessibilityRole="button"
                accessibilityHint="Tap to filter hazards"
            >
                <Text style={[styles.progressStatNumber, { color: '#4CAF50' }]}>
                    {stats.fixed}
                </Text>
                <Text style={styles.progressStatLabel}>Addressed</Text>
            </Pressable>
        </View>
    );
};

// Hazard Item Component
const HazardItem = ({ item, onStatusChange }) => {
    const [expanded, setExpanded] = useState(false);

    const handleLongPress = () => {
        Alert.alert(
            "Mark as Addressed",
            "Are you sure you want to mark this hazard as addressed?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Addressed",
                    onPress: () => onStatusChange(item.roomID, item.questionID, 'addressed', item.status, item.hazard)
                }
            ],
            { cancelable: false }
        );
    };

    const statusConfig = {
        'not_addressed': {
            label: 'Not Addressed',
            icon: 'warning',
            color: '#F44336',
            bgColor: 'rgba(244, 67, 54, 0.15)'
        },
        'in_progress': {
            label: 'In Progress',
            icon: 'autorenew',
            color: '#FF9800',
            bgColor: 'rgba(255, 152, 0, 0.15)'
        },
        'addressed': {
            label: 'Addressed',
            icon: 'check-circle',
            color: '#4CAF50',
            bgColor: 'rgba(76, 175, 80, 0.15)'
        }
    };

    const config = statusConfig[item.status] || statusConfig['not_addressed'];

    return (
        <View style={styles.hazardCardContainer}>
            <Pressable
                style={({ pressed }) => [
                    styles.hazardCardHeader,
                    pressed && { opacity: 0.7 }
                ]}
                onPress={() => setExpanded(!expanded)}
                onLongPress={handleLongPress}
                accessibilityLabel={`${item.hazard} in ${item.room}, status: ${config.label}`}
                accessibilityRole="button"
                accessibilityHint="Tap to expand actions, long press to mark as addressed"
            >
                <View style={styles.hazardIconStyle}>
                    <FontAwesome name={item.icon} size={25} color={colors.text.primary} />
                </View>
                <View style={styles.hazardCardContent}>
                    <Text style={styles.hazardCardText}>{item.hazard}</Text>
                    <View style={[styles.hazardStatusBadge, { backgroundColor: config.bgColor }]}>
                        <View style={styles.hazardStatusIcon}>
                            <MaterialIcons
                                name={config.icon}
                                size={14}
                                color={config.color}
                            />
                        </View>
                        <Text style={[styles.hazardStatusText, { color: config.color }]}>
                            {config.label}
                        </Text>
                    </View>
                </View>
            </Pressable>

            {expanded && (
                <View style={styles.hazardActionsContainer}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.hazardActionButton,
                            { backgroundColor: 'rgba(244, 67, 54, 0.15)' },
                            pressed && { opacity: 0.7 }
                        ]}
                        onPress={() => {
                            onStatusChange(item.roomID, item.questionID, 'not_addressed', item.status, item.hazard);
                            setExpanded(false);
                        }}
                    >
                        <Text style={[styles.hazardActionButtonText, { color: '#F44336' }]}>
                            Not Started
                        </Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.hazardActionButton,
                            { backgroundColor: 'rgba(255, 152, 0, 0.15)' },
                            pressed && { opacity: 0.7 }
                        ]}
                        onPress={() => {
                            onStatusChange(item.roomID, item.questionID, 'in_progress', item.status, item.hazard);
                            setExpanded(false);
                        }}
                    >
                        <Text style={[styles.hazardActionButtonText, { color: '#FF9800' }]}>
                            In Progress
                        </Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.hazardActionButton,
                            { backgroundColor: 'rgba(76, 175, 80, 0.15)' },
                            pressed && { opacity: 0.7 }
                        ]}
                        onPress={() => {
                            onStatusChange(item.roomID, item.questionID, 'addressed', item.status, item.hazard);
                            setExpanded(false);
                        }}
                    >
                        <Text style={[styles.hazardActionButtonText, { color: '#4CAF50' }]}>
                            Addressed
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

// Loading Skeleton Component
const LoadingSkeleton = () => {
    return (
        <View style={styles.hazardContainer}>
            <View style={styles.progressRingContainer}>
                <View style={[styles.progressOuterRing, { backgroundColor: colors.background.secondary, borderRadius: 100 }]} />
            </View>
            <View style={styles.progressSummaryStatsContainer}>
                <View style={styles.progressStatsContainer}>
                    {[1, 2, 3].map((i) => (
                        <View
                            key={i}
                            style={[
                                styles.progressStatCard,
                                { height: verticalScale(70), backgroundColor: colors.background.secondary }
                            ]}
                        />
                    ))}
                </View>
            </View>
            <View style={{ paddingHorizontal: horizontalScale(20), marginTop: verticalScale(20) }}>
                {[1, 2, 3].map((i) => (
                    <View
                        key={i}
                        style={{
                            height: verticalScale(80),
                            backgroundColor: colors.background.secondary,
                            borderRadius: moderateScale(10),
                            marginBottom: verticalScale(12),
                        }}
                    />
                ))}
            </View>
        </View>
    );
};

// Main Hazards Component (converted to functional)
const Hazards = () => {
    const [hazards, setHazards] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const [personalInfo, setPersonalInfo] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [activeFilter, setActiveFilter] = useState('all');
    const [isStatsStuck, setIsStatsStuck] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();

    // Approximate height of the progress ring (180px ring + margins)
    const PROGRESS_RING_HEIGHT = 200;

    useEffect(() => {
        // Run migration on mount
        migrateRoomData();
    }, []);

    useEffect(() => {
        if (!isFocused) return;

        const loadHazards = async () => {
            // Only show loading if we don't have data yet
            const hasData = hazards.length > 0 || roomList.length > 0;
            if (!hasData) {
                setIsLoading(true);
            }

            try {
                const items = await AsyncStorage.multiGet(["myRooms", "personalInfo"]);
                const rooms = JSON.parse(items[0][1]);
                const info = JSON.parse(items[1][1]);

                setPersonalInfo(info);
                setRoomList(rooms || []);

                if (!rooms || rooms.length === 0) {
                    setHazards([]);
                    setIsLoading(false);
                    return;
                }

                const allHazards = [
                    {importance: 'High Risk', data: []},
                    {importance: 'Medium Risk', data: []},
                    {importance: 'Low Risk', data: []}
                ];

                rooms.forEach(room => {
                    const roomHazards = JSON.parse(JSON.stringify(hazardsDict[room.type] || []));

                    roomHazards.forEach((hazard, k) => {
                        const status = getHazardStatus(room, hazard.questionID);

                        let importance = 0;
                        const exclusion = exclusions.find(r => r.id === k && r.room === room.type);

                        if (exclusion) {
                            const isExcluded = !(info[exclusion.exclusion] === "true" ||
                                info[exclusion.exclusion] === true ||
                                ['walker', 'cane', 'wheelchair'].includes(info[exclusion.exclusion]));

                            if (isExcluded) {
                                return; // Skip excluded hazards
                            }
                        }

                        // Determine importance level
                        if (['cane', 'walker', 'wheelchair'].includes(info.mobility) &&
                            important['Mobility'].some(r => r.id === k && r.room === room.type)) {
                            importance = 0;
                        } else if (info.vision &&
                            important['Vision'].some(r => r.id === k && r.room === room.type)) {
                            importance = 0;
                        } else if (info.hearing &&
                            important['Hearing'].some(r => r.id === k && r.room === room.type)) {
                            importance = 0;
                        } else if (room.primary === true || room.primary === 'true') {
                            importance = 1;
                        } else {
                            importance = 2;
                        }

                        allHazards[importance].data.push({
                            room: room.type,
                            hazard: hazard.hazard,
                            icon: room.icon,
                            questionID: hazard.questionID,
                            roomID: room.id,
                            status: status
                        });
                    });
                });

                const filteredHazards = allHazards.filter(section => section.data.length > 0);
                setHazards(filteredHazards);

                // Small delay to ensure smooth rendering on initial load
                if (isLoading) {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 100);
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error loading hazards:', error);
                setHazards([]);
                setIsLoading(false);
            }
        };

        loadHazards();
    }, [refreshKey, isFocused]);

    // Filter hazards based on active filter
    const filteredHazards = useMemo(() => {
        if (activeFilter === 'all') {
            // When showing all, exclude addressed hazards (only show active hazards)
            return hazards.map(section => ({
                ...section,
                data: section.data.filter(item => item.status !== 'addressed')
            })).filter(section => section.data.length > 0);
        }

        // Filter by specific status
        return hazards.map(section => ({
            ...section,
            data: section.data.filter(item => item.status === activeFilter)
        })).filter(section => section.data.length > 0);
    }, [hazards, activeFilter]);

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    const handleStatusChange = async (roomID, questionID, newStatus, oldStatus, hazardText) => {
        if (oldStatus === newStatus) return; // No change needed
        const success = await updateHazardStatus(roomID, questionID, newStatus, hazardText);
        if (success) {
            // Force re-render
            setRefreshKey(prev => prev + 1);
        }
    };

    const handleScroll = (event) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        setIsStatsStuck(scrollY > PROGRESS_RING_HEIGHT);
    };

    const stats = useHazardStats(roomList, personalInfo);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <View style={styles.hazardContainer}>
            {/* Sticky stats header - absolutely positioned, only visible when scrolled */}
            {isStatsStuck && roomList.length > 0 && personalInfo && (
                <View style={styles.stickyStatsAbsolute}>
                    <StatsCards
                        stats={stats}
                        activeFilter={activeFilter}
                        onFilterChange={handleFilterChange}
                    />
                </View>
            )}

            <SectionList
                sections={filteredHazards}
                keyExtractor={(item, index) => `${item.questionID}-${item.roomID}-${index}`}
                stickySectionHeadersEnabled={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                ListHeaderComponent={
                    roomList.length > 0 && personalInfo ? (
                        <View>
                            <ProgressRing stats={stats} />
                            <View style={styles.progressSummaryStatsContainer}>
                                <StatsCards
                                    stats={stats}
                                    activeFilter={activeFilter}
                                    onFilterChange={handleFilterChange}
                                />
                            </View>
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    <Text style={styles.hazardEmptyText}>
                        {activeFilter === 'all'
                            ? 'No hazards have been identified in your home!'
                            : `No ${activeFilter === 'not_addressed' ? 'unaddressed' : activeFilter.replace('_', ' ')} hazards found.`
                        }
                    </Text>
                }
                renderItem={({ item }) => (
                    <HazardItem item={item} onStatusChange={handleStatusChange} />
                )}
                renderSectionHeader={({section: {importance}}) => (
                    <Text style={styles.tipSectionHeader}>{importance}</Text>
                )}
            />
        </View>
    );
};


// Timeline Component
const HazardTimeline = ({ isActive }) => {
    const [timelineEntries, setTimelineEntries] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isFocused || !isActive) return;

        const loadTimeline = async () => {
            // Only show loading if we don't have data yet
            if (timelineEntries.length === 0) {
                setIsLoading(true);
            }
            try {
                const currentRooms = await AsyncStorage.getItem('myRooms');
                if (!currentRooms) {
                    setTimelineEntries([]);
                    setIsLoading(false);
                    return;
                }

                const roomList = JSON.parse(currentRooms);
                const allEntries = [];

                roomList.forEach(room => {
                    if (room.hazardHistory && room.hazardHistory.length > 0) {
                        room.hazardHistory.forEach((entry, index) => {
                            allEntries.push({
                                ...entry,
                                roomName: room.name,
                                roomType: room.type,
                                roomIcon: room.icon,
                                roomId: room.id,
                                entryIndex: index
                            });
                        });
                    }
                });

                // Sort by timestamp (most recent first) and limit to 20
                allEntries.sort((a, b) => b.timestamp - a.timestamp);
                setTimelineEntries(allEntries.slice(0, 20));
                if (isLoading) {
                    setTimeout(() => setIsLoading(false), 100);
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error loading timeline:', error);
                setTimelineEntries([]);
                setIsLoading(false);
            }
        };

        loadTimeline();
    }, [isFocused, refreshKey, isActive]);

    const deleteTimelineEntry = async (item) => {
        try {
            const currentRooms = await AsyncStorage.getItem('myRooms');
            if (!currentRooms) return;

            const roomList = JSON.parse(currentRooms);
            const room = roomList.find(r => r.id === item.roomId);

            if (!room || !room.hazardHistory) return;

            // Find and remove the specific entry by matching timestamp and questionID
            const entryIndex = room.hazardHistory.findIndex(
                entry => entry.timestamp === item.timestamp && entry.questionID === item.questionID
            );

            if (entryIndex > -1) {
                room.hazardHistory.splice(entryIndex, 1);
                await AsyncStorage.setItem('myRooms', JSON.stringify(roomList));
                setRefreshKey(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error deleting timeline entry:', error);
        }
    };

    const formatTimeAgo = (timestamp) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
        return `${Math.floor(seconds / 2592000)}mo ago`;
    };

    const statusConfig = {
        'not_addressed': {
            label: 'Not Addressed',
            icon: 'warning',
            color: '#F44336',
            bgColor: 'rgba(244, 67, 54, 0.15)'
        },
        'in_progress': {
            label: 'In Progress',
            icon: 'autorenew',
            color: '#FF9800',
            bgColor: 'rgba(255, 152, 0, 0.15)'
        },
        'addressed': {
            label: 'Addressed',
            icon: 'check-circle',
            color: '#4CAF50',
            bgColor: 'rgba(76, 175, 80, 0.15)'
        }
    };

    const renderRightActions = (progress, dragX, item) => {
        const trans = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <Pressable
                style={styles.timelineDeleteButton}
                onPress={() => {
                    Alert.alert(
                        'Delete Entry',
                        'Remove this entry from your timeline? This won\'t change the hazard status.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => deleteTimelineEntry(item)
                            }
                        ]
                    );
                }}
            >
                <Animated.View style={{ opacity: trans }}>
                    <MaterialIcons name="delete" size={24} color={colors.text.primary} />
                </Animated.View>
            </Pressable>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.timelineContainer}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <View
                        key={i}
                        style={{
                            flexDirection: 'row',
                            marginHorizontal: horizontalScale(20),
                            marginBottom: verticalScale(16),
                        }}
                    >
                        <View
                            style={{
                                width: horizontalScale(40),
                                height: verticalScale(40),
                                borderRadius: moderateScale(20),
                                backgroundColor: colors.background.secondary,
                                marginRight: horizontalScale(12),
                            }}
                        />
                        <View style={{ flex: 1 }}>
                            <View
                                style={{
                                    height: verticalScale(14),
                                    backgroundColor: colors.background.secondary,
                                    borderRadius: moderateScale(4),
                                    marginBottom: verticalScale(8),
                                    width: '40%',
                                }}
                            />
                            <View
                                style={{
                                    height: verticalScale(16),
                                    backgroundColor: colors.background.secondary,
                                    borderRadius: moderateScale(4),
                                    marginBottom: verticalScale(8),
                                }}
                            />
                            <View
                                style={{
                                    height: verticalScale(12),
                                    backgroundColor: colors.background.secondary,
                                    borderRadius: moderateScale(4),
                                    width: '60%',
                                }}
                            />
                        </View>
                    </View>
                ))}
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.timelineContainer}>
                {timelineEntries.length === 0 ? (
                    <Text style={styles.timelineEmptyText}>
                        No activity yet. Start marking hazards as in progress or addressed to see your timeline!
                    </Text>
                ) : (
                    <FlatList
                        data={timelineEntries}
                        keyExtractor={(item, index) => `${item.questionID}-${item.timestamp}-${index}`}
                        renderItem={({ item }) => {
                            const config = statusConfig[item.status] || statusConfig['not_addressed'];
                            return (
                                <Swipeable
                                    renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
                                    overshootRight={false}
                                >
                                    <View style={styles.timelineItem}>
                                        <View style={[
                                            styles.timelineIconContainer,
                                            { backgroundColor: config.bgColor }
                                        ]}>
                                            <MaterialIcons
                                                name={config.icon}
                                                size={20}
                                                color={config.color}
                                            />
                                        </View>
                                        <View style={styles.timelineContent}>
                                            <Text style={styles.timelineRoom}>
                                                {item.roomName} • {item.roomType}
                                            </Text>
                                            <Text style={styles.timelineHazardText} numberOfLines={2}>
                                                {item.hazardText}
                                            </Text>
                                            <View style={styles.timelineStatusRow}>
                                                <Text style={[styles.timelineStatus, { color: config.color }]}>
                                                    {config.label}
                                                </Text>
                                                <Text style={styles.timelineTimestamp}>
                                                    {formatTimeAgo(item.timestamp)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </Swipeable>
                            );
                        }}
                    />
                )}
            </View>
        </GestureHandlerRootView>
    );
};

const Products = () => {
    const [tipsList, setTipsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            // Only show loading on initial load
            if (tipsList.length === 0) {
                setIsLoading(true);
            }
            const items = await AsyncStorage.multiGet(["myRooms", "personalInfo"]);
        const tips = [];
        const roomList = JSON.parse(items[0][1]);
        const personalInfo = JSON.parse(items[1][1]);
        if (roomList == null || roomList == undefined || roomList == [] || roomList == '[]') {
        } else {
                for (let i = 0; i < roomList.length; i++) {
                    const roomProducts = JSON.parse(JSON.stringify(products[roomList[i].type]));
                    const neededProducts = [];

                    for (let j = 0; j < roomQuestionNumbers[roomList[i].type].length; j++) {
                        if (!roomList[i].answers.includes(roomQuestionNumbers[roomList[i].type][j])) {
                            for (let k = 0; k < roomProducts.length; k++) {
                                if (roomProducts[k].hazardID == roomQuestionNumbers[roomList[i].type][j]) {
                                    if (exclusions.some(r => r.id == j && r.room == roomList[i].type)) {
                                        const exclusion = exclusions.find(r => r.id == j && r.room == roomList[i].type);
                                        if (personalInfo[exclusion.exclusion] == "true" || personalInfo[exclusion.exclusion] == true || personalInfo[exclusion.exclusion] == "walker" || personalInfo[exclusion.exclusion] == "cane" || personalInfo[exclusion.exclusion] == "wheelchair") {
                                            if ((personalInfo.mobility == 'cane' || personalInfo.mobility == 'walker' || personalInfo.mobility == 'wheelchair') && important['Mobility'].some(r => r.id == j && r.room == roomList[i].type)) {
                                                roomProducts[k].importance = 'high';
                                            } else if (personalInfo.vision && important['Vision'].some(r => r.id == j && r.room == roomList[i].type)) {
                                                roomProducts[k].importance = 'high';
                                            } else if (personalInfo.hearing && important['Hearing'].some(r => r.id == j && r.room == roomList[i].type)) {
                                                roomProducts[k].importance = 'high';
                                            } else if (roomList[i].primary == true || roomList[i].primary == 'true') {
                                                roomProducts[k].importance = 'medium';
                                            } else {
                                                roomProducts[k].importance = 'low';
                                            }
                                        }
                                    } else {
                                        if ((personalInfo.mobility == 'cane' || personalInfo.mobility == 'walker' || personalInfo.mobility == 'wheelchair') && important['Mobility'].some(r => r.id == j && r.room == roomList[i].type)) {
                                            roomProducts[k].importance = 'high';
                                        } else if (personalInfo.vision && important['Vision'].some(r => r.id == j && r.room == roomList[i].type)) {
                                            roomProducts[k].importance = 'high';
                                        } else if (personalInfo.hearing && important['Hearing'].some(r => r.id == j && r.room == roomList[i].type)) {
                                            roomProducts[k].importance = 'high';
                                        } else if (roomList[i].primary == true || roomList[i].primary == 'true') {
                                            roomProducts[k].importance = 'medium';
                                        } else {
                                            roomProducts[k].importance = 'low';
                                        }
                                    }
                                    neededProducts.push(roomProducts[k]);
                                }
                            }
                        }
                    }
                    if (neededProducts.length > 0) {
                        tips.push({
                            title: roomList[i].name,
                            data: neededProducts
                        });
                    }
                }
            }
            setTipsList(tips);
            if (isLoading) {
                setTimeout(() => setIsLoading(false), 100);
            } else {
                setIsLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, paddingTop: verticalScale(20), paddingHorizontal: horizontalScale(20) }}>
                {[1, 2, 3, 4].map((i) => (
                    <View
                        key={i}
                        style={{
                            height: verticalScale(100),
                            backgroundColor: colors.background.secondary,
                            borderRadius: moderateScale(10),
                            marginBottom: verticalScale(12),
                        }}
                    />
                ))}
            </View>
        );
    }

    return (
        <View>
            {tipsList.length == 0 && <Text style={styles.noProductsText}>You currently have no product suggestions</Text>}
            <SectionList
                sections={tipsList}
                renderItem={({item}) => {
                    const importanceColor = item.importance == "high" ? colors.status.error : (item.importance == "medium" ? colors.status.warning : colors.status.success);
                    const importanceText = item.importance == "high" ? "Very Important" : (item.importance == "medium" ? "Important" : "Good to Have");
                    return (
                        <Pressable
                            style={({ pressed }) => [
                                styles.tip,
                                pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }
                            ]}
                            onPress={() => {Linking.openURL(item.link);}}
                            accessibilityLabel={`${item.name}, ${importanceText}`}
                            accessibilityRole="button"
                            accessibilityHint="Opens product link in browser"
                        >
                            <Image
                                style={styles.tipImage}
                                source={item.image}
                                />
                            <View style={styles.tipTextContainer}>
                                <Text style={styles.tipText}>{item.name}</Text>
                                <Text style={styles.tipDescription}>{item.description}</Text>
                                <Text style={{color: importanceColor, fontWeight: 'bold'}}>{importanceText}</Text>
                            </View>
                        </Pressable>
                    );
                }}
                renderSectionHeader={({section}) => <Text style={styles.tipSectionHeader}>{section.title}</Text>}
                ListFooterComponent={tipsList.length > 0 && <Text style={styles.affiliateNote}>* Products may contain affiliate links</Text>}
                keyExtractor={(item, index) => index}
                style={styles.tipsList}
            />
        </View>
    );
};



export default function Tips() {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const route = useRoute();
    const initialIndex = route.params?.goTo || 0;

    const [routes] = React.useState([
        { key: 'hazards', title: 'Hazards' },
        { key: 'products', title: 'Products' },
        { key: 'timeline', title: 'Timeline' },
    ]);

    const [index, setIndex] = React.useState(initialIndex);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (isFocused) {
          setIndex(initialIndex);
        }
      }, [isFocused, initialIndex]);

    const layout = useWindowDimensions();

    const renderScene = ({ route: sceneRoute }) => {
        switch (sceneRoute.key) {
            case 'hazards':
                return <Hazards />;
            case 'products':
                return <Products />;
            case 'timeline':
                return <HazardTimeline isActive={index === 2} />;
            default:
                return null;
        }
    };

    return (
        // <SafeAreaView style={{backgroundColor: colors.background.primary, flex: 1,
        // flexDirection: 'column', }} edges={['top', 'left', 'right']}>
        <SafeAreaInsetsContext.Consumer>
        {insets => (
        <View style={{backgroundColor: colors.background.primary, flex: 1, paddingTop: insets.top}}>
            {Platform.OS === 'android' && <StatusBar backgroundColor={colors.background.primary} barStyle="light-content" />}
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                style={{backgroundColor: colors.background.primary}}

                renderTabBar={props => {
                    // Extract key and remaining props
                    const { key, ...tabBarProps } = props;
                    return (
                        <TabBar
                            key={key}  // Pass key directly
                            {...tabBarProps}  // Spread remaining props
                            style={{
                                backgroundColor: colors.background.primary,
                                color: colors.text.primary,
                            }}
                            indicatorStyle={{
                                backgroundColor: colors.accent.primary,
                            }}
                        />
                    );
                }}

            />
            <ExpoStatusBar style="light" translucent={false} />
        </View>
        )}
        </SafeAreaInsetsContext.Consumer>
    );
}