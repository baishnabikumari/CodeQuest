import { motion, AnimatePresence } from "framer-motion"
import { X, Lock, Hotel, TowerControl } from "lucide-react"
import { useState } from "react"

const CITIES = [
    {
        id: "nyc", name: "New York", emoji: "🗽", country: "USA",
        xpNeeded: 0, x: 13, y: 68,
        fact: "NYC has about 300,000 teck workers and the world's most iconic skyline too.",
        codeLink: "Wall street's trading systems monitor of prices of stocks every milliseconds by using variables"
    },
    {
        id: "london", name: "London", emoji: "🎡", country: "UK",
        xpNeeded: 150, x: 28, y: 26,
        fact: "London has 270+ nationalities speaking over 300+ languages.",
        codeLink: "The financial systems in london constantly check out millions of current market points with the aid of loops"
    },
    {
        id: 'paris', name: "Paris", emoji: "🗼", country: "France",
        xpNeeded: 300, x: 34, y: 75,
        fact: "The eiffel tower grows 15cm taller every summer due to the heat expansion.",
        codeLink: "The scheduling system of Paris Metro optimises routes for 5M daily passengers using functions"
    },
    {
        id: "dubai", name: "Dubai", emoji: "🕋", country: "UAE",
        xpNeeded: 500, x: 53, y: 23,
        fact: "Dubai has around 200+ natinalities - the world's most diverse city.",
        codeLink: "In duabi, sensor readings are stored in arrays in the small city to control power, water and traffic"
    },
    {
        id: "seoul", name: "Seoul", emoji: "⛩️", country: "South Korea",
        xpNeeded: 750, x: 62, y: 72,
        fact: "Seoul has the world's fastest avg internet speed.",
        codeLink: "String manipulation is a method used by korean tech giants to create multilingual software for billion of users."
    },
    {
        id: "tokyo", name: "Tokyo", emoji: "🏯", country: "Japan",
        xpNeeded: 1000, x: 82, y: 33,
        fact: "Tokyo's shinjuku station handle around 3.5 million passangers daily - the world's busiest station.",
        codeLink: "The smart city tokyo has sophisticated algorithm powering the city's traffic, power and emergency management systems."
    },
]

export default function MapScreen({ xp, onClose }) {
    const [selectedCity, setSelectedCity] = useState(null)
    const unlocked = city => xp >= city.xpNeeded
    const visited = CITIES.filter(c => unlocked(c)).length

    return (
        <motion.div
            className="map-screen"
            initial={{ clipPath: "circle(0% at 95% 95%)" }}
            animate={{ clipPath: "circle(150% at 95% 95%)" }}
            exit={{ clipPath: "circle(0% at 95% 95%)" }}
            transition={{ type: "spring", stiffness: 180, damping: 26 }}
        >
            <div className="map-hdr">
                <span className="map-title">YOUR JOURNEY</span>
                <span className="map-visited">{visited}/{CITIES.length} cities visited</span>
                <button className="map-close-btn" onClick={onClose}><X size={18} /></button>
            </div>

            <div className="map-area">
                <img src="/map.jpg" className="map-bg" alt="world map" />

                {CITIES.map((city, i) => {
                    const isUnlocked = unlocked(city)
                    return (
                        <motion.div
                        >
                            {isUnlocked && (
                                <motion.div
                                    className="pin-pulse"
                                    animate={{ scale: [1, 2.5], opacity: [0.6, 0]}}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                />
                            )}
                            <div className="pin-bubble">{city.emoji}</div>
                            <div className="pin-label">{city.name}</div>
                        </motion.div>
                    )
                })}
            </div>

            <AnimatePresence>
                {selectedCity && (
                    <motion.div
                        className="city-card"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="city-card-top">
                            <span className="city-card-emoji">{selectedCity.emoji}</span>
                            <div>
                                <div className="city-card-name">{selectedCity.name}</div>
                                <div className="city-card-country">{selectedCity.country}</div>
                            </div>
                            <button className="city-card-x" onClick={() => setSelectedCity(null)}>
                                <X size={16} />
                            </button>
                        </div>
                        <div className="city-card-section">
                            <div className="city-section-lbl">Travel Fact</div>
                            <p>{selectedCity.fact}</p>
                        </div>
                        <div className="city-card-section">
                            <div className="city-section-lbl">Code Connection</div>
                            <p>{selectedCity.codeLink}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}