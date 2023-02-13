const temperature_info = {
    room: {
        exp: 21,
        low: 15,
        high: 25
    }
}
const humidity_info = {
    normal: {
        exp: 45,
        low: 30,
        high: 60
    }
}
const moisture_info = {
    normal: {
        exp: 2,
        low: 1,
        high: 3
    }
}

const plant_info = {
    "Basil": {
        temperature: "room",
        humidity: "normal",
        moisture: "normal"
    },
    "Mint": {
        temperature: "room",
        humidity: "normal",
        moisture: "normal"
    },
    "Thyme": {
        temperature: "room",
        humidity: "normal",
        moisture: "normal"
    }
}

function check(value,info) {
    if (value > info.low && value < info.high) return "exp"
    else if (value <= info.low) return "low"
    else return "high"
}

function process(plant) {
    return {
        temperature: check(plant.temperature,temperature_info[plant.type.temperature])
    }
}

const tmp = {
    temperature: 24.16087158203124,
    humidity: 16.75,
    moisture: 0,
    light: { '450': 30, '500': 45, '550': 60, '570': 45, '600': 50, '650': 45 },
    type: "Basil",
}

console.log(process(tmp))