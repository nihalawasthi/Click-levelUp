"use client"

import { useEffect, useState } from "react"
import BackGround from "../components/background"

export default function HunterId() {
    const [mounted, setMounted] = useState(true)
    const Gender = localStorage.getItem('gender') || "Male";
    const [kname, setKname] = useState("")

    const username = localStorage.getItem('username') || "No Name";
    async function updateKname(username: string) {
        const translate = async (text: string) => {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            return data[0][0][0];
        };
        const translated = await translate(username);
        console.log(translated);
        setKname(translated);
    }
    updateKname(username);

    function formatHash(hash: number): string {
        const hashString = hash.toString().padStart(10, '0');

        const part1 = hashString.slice(0, 3);
        const part2 = hashString.slice(3, 7);
        const part3 = hashString.slice(7, 10);

        return `${part1}  ${part2}  ${part3}`;
    }

    function generateHash(input: number) {
        const seed = 987654321;
        let hash = (input * seed) ^ (input << 5);
        hash = Math.abs(hash) % 10000000000;
        return hash;
    }
    const hunterid = formatHash(generateHash(Math.floor(Math.random() * 1000000)));
    const joined_at = localStorage.getItem('joined_at') || "2025-05-??T00:00:00Z";
    const user_rank = localStorage.getItem('user_rank') || "F";


    if (!mounted) return null

    return (
        <div className="w-full h-screen overflow-hidden">
            <BackGround />

            <div className="w-full h-screen glitch bg-transparent flex items-center justify-center absolute inset-0">
                <div className="w-full h-screen flex items-center justify-center absolute inset-0 bg-black bg-opacity-10">
                    <div className="relative h-[80vh] bg-none flex items-end justify-center glitch">
                        <div className="relative aspect-[4/3] lg:w-[60vw] lg:max-h-[60vh] md:w-[80vw] rounded-[20px] bg-black overflow-visible w-[100vw] max-h-[40vh]">
                            {/* Logo in top left */}
                            <div className="absolute top-6 left-6">
                                <img
                                    src="/icon.png"
                                    alt="Logo"
                                    className="w-20 h-20"
                                />
                            </div>

                            {/* Character image */}
                            <div className="absolute right-0 bottom-0 h-[150%] w-[50%] flex justify-center z-10">
                                <img
                                    src={Gender === "Female" ? "/female-1.png" : "/male-1.png"}
                                    className="h-full w-auto"
                                    style={{ filter: "drop-shadow(0 0.2rem 0.25rem rgba(255, 255, 255, 0.2))" }}
                                />
                            </div>

                            {/* Dynamic Text Content */}
                            <div className="absolute text-left h-[60%] z-20 left-16 top-1/2 transform -translate-y-1/2 text-cyan-100">
                                <div className="mt-10 mb-2">
                                    <h2 className="text-3xl font-bold italic tracking-wider">
                                        <span className="inline-block">
                                            <span className="text-3xl glitch">{user_rank} </span>
                                            <span className="text-lg glitch">RANK</span>
                                        </span>
                                    </h2>
                                </div>
                                <div className="mb-2">
                                    <p className="text-lg tracking-wide text-[#505050]">{"No Title"}</p>
                                </div>
                                <div>
                                    <h1 className="text-3xl tracking-tight mb-1 glitch">{username || "Player"}</h1>
                                    <p className="text-xl text-[#505050] mt-2">( {kname} )</p>
                                </div>
                                <div className="mt-2 bottom-0 w-[450px] h-[280px]">
                                    <p className="text-md tracking-wide"><span className="text-[#505050]">Gender : </span>{Gender}</p>
                                    <p className="text-md tracking-wide"><span className="text-[#505050]">Registration Date : </span> {joined_at?.split("T")[0] ?? "Unknown Date"}</p>
                                </div>
                            </div>

                            <div className="mt-10 bottom-5 w-1/4 absolute left-0 text-center">
                                <p className="text-lg tracking-wide text-[#505050]">{hunterid}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
