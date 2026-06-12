import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

export async function genChallenge(topic, diff) {
    const prompt = `Generate a ${diff} JavaScript coding challenge for teen student aged 14-20 on: ${topic}

Return ONLY valid, no markdown, no backticks:
{
    "title": "fun short title",
    "description": "2-3 sentence problem with one example. Use \\n for newlines.",
    "starterCode": "function solution(/* params */) {\\n // your code here\\n}",
    "testCases": [
        {"args": [args1], "expected": result},
        {"args": [args2], "expected": result},
        {"args": [args3], "expected": result}
    ],
    "funFact": "one short fun fact about this topic"
}
Rules: function must be named "solution". args must be valid JSON. exactly 3 test cases.`
    try{
        const result = await model.generateContent(prompt)
        const text = result.response.text()
        return JSON.parse(text.replace(/```json\n?|```/g, "").trim())
    } catch {
        return{
            title: "Count the Vowels",
            description: "Write a function that takes a string and returns the number of vowels (a, e, i, o, u).\n\nExample: solution(\"hello\") → 2",
            starterCode: "function solution(str) {\n // your code here\n}",
            testCases: [
                { args: ["hello"], expected: 2},
                { args: ["rhythm"], expected: 0},
                { args: ["beautiful"], expected: 5},
            ],
            funFact: "English has 5 vowels but over 20 vowel sounds!"
        }
    }
}

export async function getHint(description, code, onChunk){
    const prompt = `Challenge: ${description}\n\nStudent code:\n${code}\n\nGive a 2-sentence hint. Be encouraging. dont give away the answer.`
    try{
        const result = await model.generateContentStream(prompt)
        let full = ""
        for await (const chunk of result.stream) {
            full += chunk.text()
            onChunk(full)
        }
        return full
    } catch {
        const fallback = "Try breaking the problem into smaller step!"
        onChunk(fallback)
        return fallback
    }
}

export async function getReview(description, code, onChunk) {
    const prompt = `A student solved this challenge:\n${description}\n\nTheir solution:\n${code}\n\nGive 2-3 sentence of the code review. Mention one strength and one improvement.`
    try{
        const result = await model.generateContentStream(prompt)
        let full = ""
        for await (const chunk of result.stream){
            full += chunk.text()
            onChunk(full)
        }
        return full
    } catch {
        const fallback = "Great solution clean logic. Try thinking about edge cases next time."
        onChunk(fallback)
        return fallback
    }
}