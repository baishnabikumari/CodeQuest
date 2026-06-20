import { motion } from "framer-motion";
import { useMemo } from "react";

const FACTS = [
    "NYC's subway always runs 24/7 - the only metro in the world the never sleep.",
    "London's big ben only stopped chimming 5 times since 1859.",
    'Paris only have one STOP sign in the entire city.',
    "Dubai have build its won Palm Island using 120 million cubic metres of sand, and guess what? all by hand.",
    "Seoul's metro has very heated seats and women only priority cars during rush hours.",
    "Tokyo's trains are so disciplined that if they delays over 60 seconds come with a written apology.",
    "Africa is one-fifth of the land mass of the globe.",
    "Continental Europe's coastline is about 24,000 miles long.",
    "There are currently 193 countries in the United Nations.",
    "There are 54 countries in the African Group that are members of the UN.",
    "Political maps depict the boundaries of countries, the relationship among countries, cities, regions, islands, and continents, and bodies of water.",
    "There are 1,248 properties on the World Heritage List under the auspices of UNESCO.",
    "UNESCO inscribed 42 more properties on the World Heritage List in 2023.",
    "The Royal Europe, Ancient Europe, Romantic Europe and Underground Europe are part of UNESCO's World Heritage Journeys project.",
    "UNESCO supports the sustainable tourism development through its two programmes, the World Heritage and the tourism programme.",
    "The construction of the Taj Mahal took place from 1631 to 1648.",
    "Earth is the fifth largest planet.",
    "We know of no other place in the Universe that is inhabited by living things.",
    "The English name of the Earth is not of Greek or Roman origin.",
    "The origin of Earth is Old English and Germanic and translates to 'the ground'.",
    "The equatorial diameter of the Earth is approximately 7926 miles.",
    "Earth is the largest of the terrestrial (rocky) planets.",
    "On average, the earth is 93 million miles away from the Sun.",
    "There are five officially recognized \"dwarf planets\" in our solar system.",
    "There are hundreds of moons in our solar system.",
    "The Solar System is full of thousands of asteroids and comets.",
    "Milky Way is a barred spiral galaxy.",
    "The Orion Arm or Orion Spur is the location of our Sun.",
    "Solar system moves around the middle of the galaxy at a rate of approximately 515,000 miles per hour.",
    "There are approximately 1.4 million asteroids in our Solar System, according to NASA.",
    "There are approximately 4,000 comets in our Solar System, according to NASA.",
    "Jupiter is the biggest planet in the solar system.",
    "Jupiter is 2.5 times more massive than all the other planets put together.",
    "NASA has confirmed 6,000 planets that orbit other stars in the Milky Way Galaxy.",
    "It was 30 years ago when the first exoplanet around a sun-like star was found.",
    "Hack Club is the largest non-profit movement of teens building cool projects in the world.",
    "Hack Club is a worldwide non-profit network of high school coding clubs.",
    "Hack Club clubs are student run.",
    "Hack Club enables teens to develop technical proficiency, tangible projects, and momentum.",
    "All of the events from Hack Club's programs page are open to all teens around the world—free and open.",
    "Unlike many programming clubs, Hack Club is a place where you will learn to program as you build!",
    "Hack Club stands for \"You Ship, We Ship.\"",
    "Hack Club's toll-free number is 1-855-625-HACK.",
    "Hack Club has been around since 2014.",
    "Hack Club claims to have almost 1,400 high schools worldwide.",
    "According to Hack Club, they reach approximately 100,000 teens per year!",
]

// function Plane(){
//     return(
//         <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
//             <path d="M22 2 L25 14 L25 32 L22 38 L19 32 L19 14 Z" fill="var(--primary)" />
//             <path d="M19 16 L2 30 L2 34 L19 24 L25 24 L42 34 L42 30 L25 16 Z" fill="var(--primary)" />
//             <path d="M19 33 L11 41 L15 42 L22 36 L29 42 L33 41 L25 33 Z" fill="var(--primary)" opacity="0.8" />
//         </svg>
//     )
// }

export default function Loading() {
    const fact = useMemo(() => FACTS[Math.floor(Math.random() * FACTS.length)], [])
    const words = fact.split(" ")

    return (
        <div className="load-wrap">
            <div className="longfrazers">
                <span></span><span></span><span></span><span></span>
            </div>
            <div className="rocket-loader">
                <span>
                    <span></span><span></span><span></span><span></span>
                </span>
                <div className="rocket-base">
                    <span></span>
                    <div className="rocket-face"></div>
                </div>
            </div>
            <div className="load-bottom">
                <motion.p
                    className="load-txt"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    taking you to the challenge...
                </motion.p>

                <div className="load-fact">
                    <span className="load-fact-lbl">DID YOU KNOW?</span>
                    <p className="load-fact-text">
                        {words.map((w, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + i * 0.07, duration: 0.2 }}
                            >
                                {w}{" "}
                            </motion.span>
                        ))}
                    </p>
                </div>
            </div>
        </div>
    )
}