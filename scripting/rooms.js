import AsyncStorage from '@react-native-async-storage/async-storage';

// removeItemValue('myRooms')
// removeItemValue('personalInfo')
// removeItemValue('firstLoad')

async function removeItemValue(key) {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch(exception) {
        return false;
    }
}

export const deleteRoomData = async (id) => {
    try {
        const currentRooms = await AsyncStorage.getItem('myRooms');
        if (currentRooms !== null) {
            const currentRoomList = JSON.parse(currentRooms);
            currentRoomList.splice(id - 1, 1);
            for (let i = 0; i < currentRoomList.length; i++) {
                currentRoomList[i].id = i + 1;
            }
            await AsyncStorage.setItem('myRooms', JSON.stringify(currentRoomList));
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const fetchRooms = async () => {
    // await removeItemValue('firstLoad');
    try {
        const currentRooms = await AsyncStorage.getItem('myRooms');
        if (currentRooms !== null) {
            return currentRooms;
        } else {
            return null;
        }
    } catch (error) {
        console.log(error); 
        return null;
    }
}

export const fetchPersonalInfo = async () => {
    try {
        const personalInfo = await AsyncStorage.getItem('personalInfo');
        if (personalInfo !== null) {
            return personalInfo;
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const addRoom = async (room, roomName, answers, primary, id) => {
    try {
        const currentRooms = await AsyncStorage.getItem('myRooms');
        const icons = {"Bedroom": "bed", "Bathroom": "bath", "Living Room": "tv", "Kitchen": "cutlery", "Stairway": "signal", "Home Exterior/Garage": "car"}
        if (currentRooms !== null && currentRooms !== undefined && currentRooms !== "[]" && currentRooms !== "" && currentRooms !== "null") {
            const currentRoomList = JSON.parse(currentRooms);
            if (id !== undefined) {
                currentRoomList[id - 1] = {"type": room, "name": roomName, "icon": icons[room], "answers": answers, "primary": primary, "id": id, "hazardStatus": {}, "hazardHistory": []};
            } else {
                currentRoomList.push({"type": room, "name": roomName, "icon": icons[room], "answers": answers, "primary": primary, "id": currentRoomList.length + 1, "hazardStatus": {}, "hazardHistory": []});

            }
            const newRooms = JSON.stringify(currentRoomList);
            await AsyncStorage.setItem('myRooms', newRooms);
        } else {
            const newRoom = JSON.stringify([{"type": room, "name": roomName, "icon": icons[room], "answers": answers, "primary": primary, "id": 1, "hazardStatus": {}, "hazardHistory": []}]);
            await AsyncStorage.setItem('myRooms', newRoom);
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Migrate existing room data to add hazardStatus and hazardHistory
export const migrateRoomData = async () => {
    try {
        const currentRooms = await AsyncStorage.getItem('myRooms');
        if (currentRooms === null || currentRooms === undefined || currentRooms === "[]") {
            return;
        }

        const roomList = JSON.parse(currentRooms);
        let needsMigration = false;

        for (let i = 0; i < roomList.length; i++) {
            const room = roomList[i];

            // Check if migration is needed
            if (!room.hazardStatus || !room.hazardHistory) {
                needsMigration = true;

                // Initialize new fields
                room.hazardStatus = room.hazardStatus || {};
                room.hazardHistory = room.hazardHistory || [];

                // Migrate existing answers to "addressed" status
                if (room.answers && room.answers.length > 0) {
                    const timestamp = Date.now();
                    room.answers.forEach(questionID => {
                        room.hazardStatus[questionID] = {
                            status: 'addressed',
                            timestamp: timestamp
                        };
                    });
                }
            }
        }

        // Only save if migration was needed
        if (needsMigration) {
            await AsyncStorage.setItem('myRooms', JSON.stringify(roomList));
            console.log('Room data migrated successfully');
        }
    } catch (error) {
        console.error('Error migrating room data:', error);
    }
}

// Get hazard status with backward compatibility
export const getHazardStatus = (room, questionID) => {
    // Check new system first
    if (room.hazardStatus && room.hazardStatus[questionID]) {
        return room.hazardStatus[questionID].status;
    }

    // Fallback to legacy answers array
    if (room.answers && room.answers.includes(questionID)) {
        return 'addressed';
    }

    return 'not_addressed';
}

// Update hazard status and maintain history
export const updateHazardStatus = async (roomID, questionID, newStatus, hazardText) => {
    try {
        const currentRooms = await AsyncStorage.getItem('myRooms');
        if (!currentRooms) {
            return false;
        }

        const roomList = JSON.parse(currentRooms);
        const room = roomList.find(r => r.id === roomID);

        if (!room) {
            return false;
        }

        // Initialize fields if not present
        if (!room.hazardStatus) room.hazardStatus = {};
        if (!room.hazardHistory) room.hazardHistory = [];

        const timestamp = Date.now();

        // Update status
        room.hazardStatus[questionID] = {
            status: newStatus,
            timestamp: timestamp
        };

        // Add to history (prepend for reverse chronological order)
        room.hazardHistory.unshift({
            questionID: questionID,
            status: newStatus,
            timestamp: timestamp,
            hazardText: hazardText
        });

        // Maintain backward compatibility with answers array
        if (newStatus === 'addressed') {
            // Add to answers if not already there
            if (!room.answers.includes(questionID)) {
                room.answers.push(questionID);
                room.answers.sort();
            }
        } else {
            // Remove from answers if present
            const index = room.answers.indexOf(questionID);
            if (index > -1) {
                room.answers.splice(index, 1);
            }
        }

        // Save updated room list
        await AsyncStorage.setItem('myRooms', JSON.stringify(roomList));
        return true;
    } catch (error) {
        console.error('Error updating hazard status:', error);
        return false;
    }
}

