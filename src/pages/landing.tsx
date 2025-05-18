'use client'
import { useState } from 'react';
import Head from 'next/head'
import { AlarmWindow } from '../components/AlarmWindow';
import BackGround from '../components/background';
import "../components/styles/glitch.css"

export default function SignupPanel() {
  const [showAlarmWindow, setShowAlarmWindow] = useState(true);

  return (
    <div className="antialiased text-gray-800 min-h-screen flex flex-col">
      <Head>
        <title>Click Leveling</title>
      </Head>

      <main id="main-content" className="flex-1 relative" style={{ maxHeight: "100vh", overflowY: "hidden" }}>
        <section id="hero" className="min-h-screen bg-[#0a0e17] text-white flex items-center relative">
          <BackGround />
        </section>
      </main>

      {/* Alarm Window */}
      {showAlarmWindow && <AlarmWindow onClose={() => setShowAlarmWindow(false)} />}
    </div>
  );
}
