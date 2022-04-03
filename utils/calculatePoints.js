const calculatePoints = (body) => {
    const { type, distance, duration } = body
    
    if (type === 'swimming') {
        return distance * 3
    }

    if (type === 'running') {
        return distance * 2
    }

    if (type === 'walking') {
        return distance / 2
    }

    if (type === 'cycling') {
        return distance 
    }

    if (duration) {
        return duration * 100
    }


}

module.exports = calculatePoints